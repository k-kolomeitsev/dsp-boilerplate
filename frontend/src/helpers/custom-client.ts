// @dsp obj-b30ecedf
import Axios, {
  type AxiosError,
  type AxiosHeaderValue,
  type AxiosRequestConfig,
} from 'axios';

const API_PREFIX = '/api';

type PlainObject = Record<string, unknown>;
type HeadersObject = Record<string, AxiosHeaderValue>;

const isAbsoluteUrl = (url: string): boolean => {
  // RFC 3986 scheme: ALPHA *( ALPHA / DIGIT / "+" / "-" / "." ) ":"
  // Also allow scheme-relative URLs: "//example.com"
  return /^[a-z][a-z\d+\-.]*:\/\//i.test(url) || url.startsWith('//');
};

const ensureLeadingSlash = (path: string): string => (path.startsWith('/') ? path : `/${path}`);

const normalizeApiUrl = (url?: string): string | undefined => {
  if (!url) return url;
  if (isAbsoluteUrl(url)) return url;

  const normalized = ensureLeadingSlash(url);
  if (normalized === API_PREFIX || normalized.startsWith(`${API_PREFIX}/`)) {
    return normalized;
  }

  return `${API_PREFIX}${normalized}`;
};

const headersToObject = (headers: AxiosRequestConfig['headers']): HeadersObject => {
  if (!headers) return {};

  // AxiosHeaders (runtime) exposes toJSON(); types here are broad, so keep it safe.
  const maybeToJson = (headers as { toJSON?: () => unknown }).toJSON;
  if (typeof maybeToJson === 'function') {
    const json = maybeToJson.call(headers);
    return json && typeof json === 'object' ? (json as HeadersObject) : {};
  }

  if (typeof headers === 'object') return headers as unknown as HeadersObject;
  return {};
};

const isPlainObject = (value: unknown): value is PlainObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const mergeAxiosConfig = (
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): AxiosRequestConfig => {
  const merged: AxiosRequestConfig = {
    ...config,
    ...options,
  };

  // Normalize URL so that all relative calls go to /api, without producing /api/api/*
  merged.url = normalizeApiUrl(options?.url ?? config.url);

  // Merge headers (support both plain objects and AxiosHeaders instances).
  merged.headers = {
    ...headersToObject(config.headers),
    ...headersToObject(options?.headers),
  };

  // Merge query params only when both sides are plain objects.
  if (isPlainObject(config.params) && isPlainObject(options?.params)) {
    merged.params = { ...config.params, ...options?.params };
  }

  // Prefer per-call signal if provided (TanStack Query v4/v5 cancellation).
  merged.signal = options?.signal ?? config.signal;

  return merged;
};

/**
 * Shared Axios instance for Orval with cookie-based auth (`sid`) and a unified `/api` prefix.
 *
 * Note: paths in the current `api.yaml` already start with `/api/...`, so we normalize URLs
 * to avoid `/api/api/...` while still ensuring `/api` for paths without the prefix.
 */
// @dsp func-44b768a7
export const AXIOS_INSTANCE = Axios.create({
  baseURL: '',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});

/**
 * Mutator function for Orval (axios + TanStack Query): returns `data` as T.
 * Supports AbortSignal via `config.signal`/`options.signal` (axios >= 0.22).
 */
// @dsp func-9222c247
export const customInstance = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const requestConfig = mergeAxiosConfig(config, options);
  const response = await AXIOS_INSTANCE.request<T>(requestConfig);
  return response.data;
};

/**
 * Mutator hook for Orval `client: 'react-query'`.
 * Orval imports this hook and uses it inside the generated hooks.
 */
// @dsp func-73cd8e07
export const useCustomInstance = <T>(): ((
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
) => Promise<T>) => {
  return (config: AxiosRequestConfig, options?: AxiosRequestConfig) =>
    customInstance<T>(config, options);
};

export default useCustomInstance;

// Orval types: allow overriding error/body types during generation if needed.
export type ErrorType<ErrorData> = AxiosError<ErrorData>;
export type BodyType<BodyData> = BodyData;


