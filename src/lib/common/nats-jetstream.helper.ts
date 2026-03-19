// @dsp obj-e904a0e5
import {
  AckPolicy,
  DeliverPolicy,
  RetentionPolicy,
  StorageType,
  type JetStreamManager,
  type NatsConnection,
} from 'nats';

export const DEFAULT_JS_DEDUP_WINDOW_NS = 3_600_000_000_000; // 1 hour

type JetStreamApiErrorLike = {
  code?: unknown;
  api_error?: {
    code?: unknown;
  };
};

function toOptionalNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function getJetStreamErrorCode(err: unknown): number | undefined {
  const e = err as JetStreamApiErrorLike | null | undefined;
  return toOptionalNumber(e?.code ?? e?.api_error?.code);
}

export type EnsureWorkQueueStreamOptions = {
  stream: string;
  subject: string;
  duplicateWindowNs?: number;
  retention?: RetentionPolicy;
  storage?: StorageType;
};

/**
 * Ensures a JetStream stream (WorkQueuePolicy) exists and guarantees
 * that the stream is subscribed to the subject with a deduplication window no less than required.
 */
// @dsp func-804f4e42
export async function ensureJetStreamWorkQueueStream(
  jsm: JetStreamManager,
  opts: EnsureWorkQueueStreamOptions,
): Promise<void> {
  const duplicateWindowNs =
    typeof opts.duplicateWindowNs === 'number' && opts.duplicateWindowNs > 0
      ? opts.duplicateWindowNs
      : DEFAULT_JS_DEDUP_WINDOW_NS;

  const retention = opts.retention ?? RetentionPolicy.Workqueue;
  const storage = opts.storage ?? StorageType.File;

  try {
    const info = await jsm.streams.info(opts.stream);
    const subjects = info.config.subjects ?? [];

    const currentDuplicateWindowNs =
      typeof info.config.duplicate_window === 'number'
        ? info.config.duplicate_window
        : 0;

    const needsSubjectsUpdate = !subjects.includes(opts.subject);
    const needsDedupUpdate = currentDuplicateWindowNs < duplicateWindowNs;

    if (!needsSubjectsUpdate && !needsDedupUpdate) {
      return;
    }

    await jsm.streams.update(opts.stream, {
      subjects: Array.from(new Set([...subjects, opts.subject])),
      duplicate_window: Math.max(currentDuplicateWindowNs, duplicateWindowNs),
    });
    return;
  } catch (err) {
    const code = getJetStreamErrorCode(err);
    if (code !== 404) {
      throw err;
    }
  }

  await jsm.streams.add({
    name: opts.stream,
    subjects: [opts.subject],
    retention,
    storage,
    duplicate_window: duplicateWindowNs,
  });
}

export type PublishWorkQueueMessageOptions = {
  stream: string;
  subject: string;
  payload: Uint8Array;
  msgId?: string;
  duplicateWindowNs?: number;
};

/**
 * Publishes a message to a JetStream subject (work-queue stream),
 * ensuring the stream exists beforehand.
 */
// @dsp func-dfd80e12
export async function publishJetStreamWorkQueueMessage(
  nc: NatsConnection,
  opts: PublishWorkQueueMessageOptions,
): Promise<void> {
  const jsm = await nc.jetstreamManager();
  await ensureJetStreamWorkQueueStream(jsm, {
    stream: opts.stream,
    subject: opts.subject,
    duplicateWindowNs: opts.duplicateWindowNs,
  });

  const js = nc.jetstream();
  await js.publish(
    opts.subject,
    opts.payload,
    opts.msgId ? { msgID: opts.msgId } : undefined,
  );
}

export type EnsureDurablePullConsumerOptions = {
  stream: string;
  subject: string;
  consumer: string;
  /**
   * Ack wait in nanoseconds (defaults to 60s).
   * For long-running tasks use `msg.working()` to extend the timer.
   */
  ackWaitNs?: number;
  /**
   * How many messages can be simultaneously delivered and awaiting ACK for this consumer.
   */
  maxAckPending?: number;
  /**
   * Maximum number of delivery attempts per message.
   */
  maxDeliver?: number;
};

/**
 * Ensures a durable pull-consumer exists for a work-queue stream.
 * If the consumer already exists, updates its config when necessary.
 */
// @dsp func-a420687c
export async function ensureJetStreamDurablePullConsumer(
  jsm: JetStreamManager,
  opts: EnsureDurablePullConsumerOptions,
): Promise<void> {
  const ackWaitNs = toOptionalNumber(opts.ackWaitNs) ?? 60_000_000_000; // 60s
  const maxAckPending =
    typeof opts.maxAckPending === 'number' && opts.maxAckPending > 0
      ? Math.floor(opts.maxAckPending)
      : undefined;
  const maxDeliver =
    typeof opts.maxDeliver === 'number' && opts.maxDeliver > 0
      ? Math.floor(opts.maxDeliver)
      : 10;

  try {
    const info = await jsm.consumers.info(opts.stream, opts.consumer);
    const current = info.config ?? ({} as any);

    const currentAckWaitNs = toOptionalNumber((current as any).ack_wait) ?? 0;
    const currentMaxAckPending =
      typeof (current as any).max_ack_pending === 'number'
        ? (current as any).max_ack_pending
        : undefined;
    const currentFilterSubject =
      typeof (current as any).filter_subject === 'string'
        ? String((current as any).filter_subject).trim()
        : '';

    const needsAckWaitUpdate = currentAckWaitNs < ackWaitNs;
    const needsMaxAckPendingUpdate =
      typeof maxAckPending === 'number' &&
      currentMaxAckPending !== maxAckPending;
    const needsFilterSubjectUpdate = currentFilterSubject !== opts.subject;

    if (
      !needsAckWaitUpdate &&
      !needsMaxAckPendingUpdate &&
      !needsFilterSubjectUpdate
    ) {
      return;
    }

    await jsm.consumers.update(opts.stream, opts.consumer, {
      ack_wait: needsAckWaitUpdate ? ackWaitNs : undefined,
      max_ack_pending: needsMaxAckPendingUpdate ? maxAckPending : undefined,
      filter_subject: needsFilterSubjectUpdate ? opts.subject : undefined,
    });
    return;
  } catch (err) {
    const code = getJetStreamErrorCode(err);
    if (code !== 404) {
      throw err;
    }
  }

  await jsm.consumers.add(opts.stream, {
    durable_name: opts.consumer,
    deliver_policy: DeliverPolicy.All,
    ack_policy: AckPolicy.Explicit,
    filter_subject: opts.subject,
    ack_wait: ackWaitNs,
    ...(typeof maxAckPending === 'number'
      ? { max_ack_pending: maxAckPending }
      : {}),
    max_deliver: maxDeliver,
  });
}

/**
 * Parses a payload from a NATS message where the id can be provided as:
 * - plain string: "<id>"
 * - JSON string: "\"<id>\""
 * - JSON object: { "<key>": "<id>" }
 *
 * Used for both core NATS and JetStream payloads.
 */
// @dsp func-2620b1d7
export function parseNatsIdPayload(
  raw: string,
  keys: readonly string[],
): string | null {
  const s = String(raw ?? '').trim();
  if (!s) return null;

  if (s.startsWith('{') || s.startsWith('"')) {
    try {
      const parsed = JSON.parse(s) as unknown;
      if (typeof parsed === 'string') {
        return parsed.trim() || null;
      }
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const obj = parsed as Record<string, unknown>;
        for (const key of keys) {
          const v = obj[key];
          if (typeof v === 'string' && v.trim()) {
            return v.trim();
          }
        }
      }
    } catch {
      // ignore JSON parse errors; fallback to raw string
    }
  }

  return s;
}
