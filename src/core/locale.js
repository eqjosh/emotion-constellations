/**
 * Locale management for i18n support.
 *
 * Detection priority: URL path > localStorage > browser language.
 *
 * URL scheme:  /constellation/es  →  Spanish
 *              /constellation/fr  →  French
 *              /constellation/    →  auto-detect (stored or browser)
 *
 * Supported locales: en, es, ko, zh, ar, he, ja, fr, pt, it, de
 */

import { emit, on } from './events.js';

const STORAGE_KEY = 'constellation_locale';
const DEFAULT_LOCALE = 'en';

/** Supported locale codes and their display labels */
export const SUPPORTED_LOCALES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' },
  { code: 'ko', label: 'Korean', nativeLabel: '한국어' },
  { code: 'zh', label: 'Chinese', nativeLabel: '中文' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية' },
  { code: 'he', label: 'Hebrew', nativeLabel: 'עברית' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語' },
  { code: 'fr', label: 'French', nativeLabel: 'Français' },
  { code: 'pt', label: 'Portuguese', nativeLabel: 'Português' },
  { code: 'it', label: 'Italian', nativeLabel: 'Italiano' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch' },
];

const SUPPORTED_CODES = new Set(SUPPORTED_LOCALES.map(l => l.code));

let currentLocale = DEFAULT_LOCALE;

// ─── URL helpers ────────────────────────────────────────────────────────────

/** Base path from Vite config (e.g. '/constellation/') */
function basePath() {
  return (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
}

/**
 * Extract a locale code from the URL path.
 * e.g. /constellation/es → 'es',  /constellation/ → null
 */
function getLocaleFromUrl() {
  const base = basePath();
  const path = window.location.pathname;
  if (!path.startsWith(base)) return null;
  const rest = path.slice(base.length).replace(/^\//, '').replace(/\/$/, '');
  if (rest && SUPPORTED_CODES.has(rest)) return rest;
  return null;
}

/**
 * Update the browser URL to include the locale code.
 * Uses replaceState so there's no extra history entry.
 */
function setUrlLocale(code) {
  const target = `${basePath()}/${code}`;
  const current = window.location.pathname.replace(/\/$/, '');
  if (current !== target) {
    window.history.replaceState(
      null, '',
      target + window.location.search + window.location.hash,
    );
  }
}

// ─── Browser detection ──────────────────────────────────────────────────────

/**
 * Detect the best locale from browser settings.
 * Matches the first two characters of navigator.language against supported codes.
 */
function detectBrowserLocale() {
  const languages = navigator.languages || [navigator.language || 'en'];
  for (const lang of languages) {
    const code = lang.slice(0, 2).toLowerCase();
    if (SUPPORTED_CODES.has(code)) return code;
  }
  return DEFAULT_LOCALE;
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Initialize locale.
 * Priority: URL path  →  localStorage  →  browser detection.
 * @returns {string} The resolved locale code.
 */
export function initLocale() {
  // 1. Check URL path first (e.g. /constellation/fr)
  const urlLocale = getLocaleFromUrl();
  if (urlLocale) {
    currentLocale = urlLocale;
    localStorage.setItem(STORAGE_KEY, urlLocale);
  } else {
    // 2. Check localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_CODES.has(stored)) {
      currentLocale = stored;
    } else {
      // 3. Browser detection
      currentLocale = detectBrowserLocale();
    }
  }

  document.documentElement.lang = currentLocale;

  // Always reflect the resolved locale in the URL
  setUrlLocale(currentLocale);

  return currentLocale;
}

/**
 * Get the current locale code.
 * @returns {string}
 */
export function getLocale() {
  return currentLocale;
}

/**
 * Set the locale explicitly. Persists to localStorage, updates URL,
 * and emits 'locale:changed'.
 * @param {string} code - Locale code (e.g. 'ko')
 */
export function setLocale(code) {
  if (!SUPPORTED_CODES.has(code)) {
    console.warn(`Unsupported locale: ${code}`);
    return;
  }
  if (code === currentLocale) return;

  currentLocale = code;
  localStorage.setItem(STORAGE_KEY, code);
  document.documentElement.lang = code;
  setUrlLocale(code);
  emit('locale:changed', { locale: code });
}

/**
 * Check if a locale code is supported.
 * @param {string} code
 * @returns {boolean}
 */
export function isLocaleSupported(code) {
  return SUPPORTED_CODES.has(code);
}
