/**
 * Language selector — small dropdown near the help icon (top-right area).
 *
 * Shows current locale code (e.g. "EN"). On click, expands a dropdown
 * with all supported languages using their native labels.
 *
 * Shifts left when the wisdom panel is open so it doesn't overlap.
 *
 * Calls setLocale() on selection, which emits 'locale:changed'.
 */

import { getLocale, setLocale, SUPPORTED_LOCALES } from '../core/locale.js';
import { t } from '../core/ui-strings.js';
import { on } from '../core/events.js';

export function createLanguageSelector(container) {
  const el = document.createElement('div');
  el.className = 'lang-selector';

  const btn = document.createElement('button');
  btn.className = 'lang-selector__btn';
  btn.setAttribute('aria-label', t('language.label'));
  btn.textContent = getLocale().toUpperCase();

  const dropdown = document.createElement('div');
  dropdown.className = 'lang-selector__dropdown';

  for (const loc of SUPPORTED_LOCALES) {
    const item = document.createElement('button');
    item.className = 'lang-selector__item';
    if (loc.code === getLocale()) {
      item.classList.add('lang-selector__item--active');
    }
    item.dataset.locale = loc.code;
    item.textContent = loc.nativeLabel;
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      setLocale(loc.code);
      btn.textContent = loc.code.toUpperCase();
      closeDropdown();
      // Update active state
      dropdown.querySelectorAll('.lang-selector__item').forEach(i => {
        i.classList.toggle('lang-selector__item--active', i.dataset.locale === loc.code);
      });
    });
    dropdown.appendChild(item);
  }

  el.appendChild(btn);
  el.appendChild(dropdown);

  // Prevent canvas deselect
  el.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
  });

  // Toggle dropdown
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = el.classList.contains('lang-selector--open');
    if (isOpen) {
      closeDropdown();
    } else {
      el.classList.add('lang-selector--open');
    }
  });

  // Close on outside click
  function handleOutsideClick() {
    closeDropdown();
  }

  function closeDropdown() {
    el.classList.remove('lang-selector--open');
  }

  document.addEventListener('click', handleOutsideClick);

  // Shift when panel opens/closes
  const unsubOpen = on('panel:opened', () => {
    el.classList.add('lang-selector--panel-open');
  });
  const unsubClose = on('panel:closed', () => {
    el.classList.remove('lang-selector--panel-open');
  });

  container.appendChild(el);

  return {
    destroy() {
      document.removeEventListener('click', handleOutsideClick);
      unsubOpen();
      unsubClose();
      if (el.parentNode) el.remove();
    },
  };
}
