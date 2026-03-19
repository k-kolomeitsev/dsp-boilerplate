// @dsp obj-9e2c3997
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translations
import ruTranslation from './locales/ru.json'
import enTranslation from './locales/en.json'
import kzTranslation from './locales/kz.json'
import zhTranslation from './locales/zh.json'
import arTranslation from './locales/ar.json'

const resources = {
  en: {
    translation: enTranslation
  },
  ru: {
    translation: ruTranslation
  },
  kz: {
    translation: kzTranslation
  },
  zh: {
    translation: zhTranslation
  },
  ar: {
    translation: arTranslation
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupQuerystring: 'lang'
    },

    interpolation: {
      escapeValue: false
    }
  })

export default i18n
