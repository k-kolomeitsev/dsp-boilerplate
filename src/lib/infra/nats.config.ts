// @dsp obj-06d9d5e2
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { type NatsOptions } from '@nestjs/microservices';
import { ConfigFragment, EnvValue } from '../common';

type ResolvedNatsOptions = NonNullable<NatsOptions['options']>;
type AuthOptions = Pick<ResolvedNatsOptions, 'token' | 'user' | 'pass'>;
type TlsOptions = Record<string, unknown>;

const parseServers = (raw: string): string[] =>
  String(raw)
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

// @dsp func-4b6ebdf5
export class NatsConfig extends ConfigFragment {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @EnvValue({
    name: 'NATS_SERVERS',
    transform: parseServers,
    defaultValue: ['nats://localhost:4222'],
  })
  public readonly NATS_SERVERS: string[];

  @IsString()
  @IsOptional()
  @EnvValue({ name: 'NATS_QUEUE' })
  public readonly NATS_QUEUE?: string;

  @IsString()
  @IsOptional()
  @EnvValue({ name: 'NATS_NAME' })
  public readonly NATS_NAME?: string;

  @IsString()
  @IsOptional()
  @EnvValue({ name: 'NATS_USER' })
  public readonly NATS_USER?: string;

  @IsString()
  @IsOptional()
  @EnvValue({ name: 'NATS_PASSWORD' })
  public readonly NATS_PASSWORD?: string;

  @IsString()
  @IsOptional()
  @EnvValue({ name: 'NATS_AUTH_TOKEN' })
  public readonly NATS_AUTH_TOKEN?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  @EnvValue({ name: 'NATS_MAX_RECONNECT_ATTEMPTS', defaultValue: 10 })
  public readonly NATS_MAX_RECONNECT_ATTEMPTS?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  @EnvValue({ name: 'NATS_RECONNECT_TIME_WAIT', defaultValue: 2000 })
  public readonly NATS_RECONNECT_TIME_WAIT?: number;

  @IsString()
  @IsOptional()
  @EnvValue({ name: 'NATS_TLS_CA' })
  public readonly NATS_TLS_CA?: string;

  @IsString()
  @IsOptional()
  @EnvValue({ name: 'NATS_TLS_CERT' })
  public readonly NATS_TLS_CERT?: string;

  @IsString()
  @IsOptional()
  @EnvValue({ name: 'NATS_TLS_KEY' })
  public readonly NATS_TLS_KEY?: string;

  get clientOptions(): ResolvedNatsOptions {
    const options: ResolvedNatsOptions = {
      servers: this.NATS_SERVERS,
      ...(this.NATS_QUEUE && { queue: this.NATS_QUEUE }),
      ...(this.NATS_NAME && { name: this.NATS_NAME }),
      ...(typeof this.NATS_MAX_RECONNECT_ATTEMPTS === 'number'
        ? { maxReconnectAttempts: this.NATS_MAX_RECONNECT_ATTEMPTS }
        : {}),
      ...(typeof this.NATS_RECONNECT_TIME_WAIT === 'number'
        ? { reconnectTimeWait: this.NATS_RECONNECT_TIME_WAIT }
        : {}),
    };

    const tls = this.getTlsOptions();
    if (tls) {
      options.tls = tls;
    }

    const auth = this.getAuthOptions();
    if (auth) {
      Object.assign(options, auth);
    }

    return options;
  }

  private getAuthOptions(): AuthOptions | undefined {
    if (this.NATS_AUTH_TOKEN) {
      return { token: this.NATS_AUTH_TOKEN };
    }

    if (this.NATS_USER || this.NATS_PASSWORD) {
      return {
        ...(this.NATS_USER && { user: this.NATS_USER }),
        ...(this.NATS_PASSWORD && { pass: this.NATS_PASSWORD }),
      };
    }

    return undefined;
  }

  private getTlsOptions(): TlsOptions | undefined {
    const ca = this.toBuffer(this.NATS_TLS_CA);
    const cert = this.toBuffer(this.NATS_TLS_CERT);
    const key = this.toBuffer(this.NATS_TLS_KEY);

    if (!ca && !cert && !key) {
      return undefined;
    }

    return {
      ...(ca && { ca: [ca] }),
      ...(cert && { cert }),
      ...(key && { key }),
    };
  }

  private toBuffer(value?: string): Buffer | undefined {
    if (!value) {
      return undefined;
    }

    return Buffer.from(value, 'base64');
  }
}
