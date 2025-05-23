export const LANGUAGE_NAMES = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  zh: 'Chinese',
  ja: 'Japanese',
} as const;

export type SupportedLanguage = keyof typeof LANGUAGE_NAMES;