import type { TFunction } from 'i18next';

type ApiError =
  { message?: string; response?: { status?: number } } | null | undefined;

export const errorStatus = (error: unknown) =>
  (error as ApiError)?.response?.status ?? 0;

// Backend errors are either UPPER_SNAKE codes (translated under errors.*) or
// class-validator sentences (shown generically — the form already validates).
export const errorMessage = (error: unknown, t: TFunction) => {
  const e = error as ApiError;
  const status = e?.response?.status ?? 0;
  const msg = e?.message ?? '';
  if (/^[A-Z][A-Z_]+$/.test(msg))
    return t(`errors.${msg}`, { defaultValue: t('errors.generic') });
  if (status === 429) return t('errors.rateLimited');
  if (status === 0 || status >= 500) return t('errors.server');
  if (status === 401) return t('errors.unauthorized');
  if (status === 403) return t('errors.forbidden');
  if (status === 404) return t('errors.notFound');
  return t('errors.generic');
};
