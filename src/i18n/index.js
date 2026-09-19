import { en } from './en'
import { fa } from './fa'
import { DEFAULT_LOCALE, isLocale } from './config'

const DICTIONARIES = { en, fa }

/** Returns the dictionary for a locale, falling back to the default. */
export function getDictionary(locale) {
  return DICTIONARIES[isLocale(locale) ? locale : DEFAULT_LOCALE]
}

export * from './config'
export * from './numerals'
