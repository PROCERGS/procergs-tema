import config from '@plone/volto/registry';

export const ENDPOINT = '/++api++/@consentimento';
export const CONSENT_STORAGE_KEY = 'procergs-consentimento';
export const CONSENT_CHANGE_EVENT = 'procergs:consentimento';
export const CONSENT_COOKIE_NAME = 'consentimento_lgpd';

export const CONSENT_CATEGORIES = [
  { id: 'essenciais', label: 'Essenciais', required: true },
  { id: 'analiticos', label: 'Analíticos', required: true },
  { id: 'youtube', label: 'Youtube' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'google', label: 'Google' },
];

const TOGGLE_CATEGORIES = CONSENT_CATEGORIES.filter(({ required }) => !required);

const buildPreferences = (value) =>
  CONSENT_CATEGORIES.reduce(
    (acc, { id, required }) => ({ ...acc, [id]: required ? true : value }),
    {},
  );

export const getDefaultPreferences = () => buildPreferences(false);

export const getAcceptedPreferences = () => buildPreferences(true);

/**
 * Decodifica o cookie consentimento_lgpd definido pelo backend.
 * Retorna { status, id, categorias? } ou null.
 */
export const getCookieConsent = () => {
  if (typeof document === 'undefined') return null;
  try {
    const match = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${CONSENT_COOKIE_NAME}=`));
    if (!match) return null;
    const value = decodeURIComponent(match.split('=').slice(1).join('='));
    return JSON.parse(atob(value));
  } catch (e) {
    return null;
  }
};

export const getStoredConsent = () => {
  if (typeof window === 'undefined') return null;
  // 1. localStorage (cache rápido, atualizado no ato do consentimento)
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (raw) {
      return {
        ...getDefaultPreferences(),
        ...JSON.parse(raw),
        essenciais: true,
        analiticos: true,
      };
    }
  } catch (e) {

  }
  // 2. Cookie do backend
  const cookie = getCookieConsent();
  if (cookie) {
    if (cookie.status === 'aceito') return getAcceptedPreferences();
    if (cookie.status === 'personalizado' && cookie.categorias) {
      const prefs = getDefaultPreferences();
      for (const [id, enabled] of Object.entries(cookie.categorias)) {
        if (id in prefs) prefs[id] = Boolean(enabled);
      }
      return prefs;
    }
    
    return getDefaultPreferences();
  }
  return null;
};

/**
 * Chama GET /@consentimento para obter o status atual do consentimento.
 * Retorna { versao, texto, ativo, status } ou null em caso de erro.
 */
export const getConsentStatus = () => {
  if (typeof window === 'undefined') return Promise.resolve(null);
  const settings = config.settings.procergsConsentimento || {};
  const url = new URL(ENDPOINT, window.location.origin);
  url.searchParams.set('versao', settings.versao ?? 1);
  return fetch(url.toString(), {
    method: 'GET',
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  })
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null);
};

export const postConsent = (value) => {
  const settings = config.settings.procergsConsentimento || {};
  const allOn = TOGGLE_CATEGORIES.every(({ id }) => value[id]);
  const allOff = TOGGLE_CATEGORIES.every(({ id }) => !value[id]);

  let tipoAceite;
  let categorias;
  if (allOn) {
    tipoAceite = 'total';
  } else if (allOff) {
    tipoAceite = 'restrito';
  } else {
    tipoAceite = 'personalizado';
    categorias = Object.fromEntries(
      TOGGLE_CATEGORIES.map(({ id }) => [id, Boolean(value[id])]),
    );
  }

  const body = {
    sigla_sistema: settings.siglaSistema,
    sigla_site: settings.siglaSite,
    url: window.location.href,
    versao: settings.versao ?? 1,
    tipo_aceite: tipoAceite,
  };
  if (categorias) body.categorias = categorias;

  return fetch(ENDPOINT, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  }).catch(() => null);
};

export const saveConsent = (preferences) => {
  const value = {
    ...getDefaultPreferences(),
    ...preferences,
    essenciais: true,
    analiticos: true,
  };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value));
  } catch (e) {
    
  }
  postConsent(value);
  window.dispatchEvent(
    new CustomEvent(CONSENT_CHANGE_EVENT, { detail: value }),
  );
  return value;
};

export const hasConsent = (categoryId) =>
  Boolean(getStoredConsent()?.[categoryId]);
