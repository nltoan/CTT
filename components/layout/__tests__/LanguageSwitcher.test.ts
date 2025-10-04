import {describe, expect, it} from 'vitest';

import {getAlternateLocale, getSwitchLocalePath} from '../LanguageSwitcher';

describe('LanguageSwitcher helpers', () => {
  it('picks alternate locale from list', () => {
    expect(getAlternateLocale('vi', ['vi', 'en'])).toBe('en');
    expect(getAlternateLocale('en', ['vi', 'en'])).toBe('vi');
  });

  it('falls back to current locale when no alternatives', () => {
    expect(getAlternateLocale('vi', ['vi'])).toBe('vi');
  });

  it('builds switch path for homepage', () => {
    expect(getSwitchLocalePath('/', 'vi', ['vi', 'en'])).toBe('/en');
  });

  it('replaces the leading locale segment for nested routes', () => {
    expect(getSwitchLocalePath('/vi/news/updates', 'vi', ['vi', 'en'])).toBe('/en/news/updates');
  });

  it('handles unexpected locales by falling back to the first supported entry', () => {
    expect(getSwitchLocalePath('/fr/events', 'fr', ['vi', 'en'])).toBe('/vi/events');
  });
});
