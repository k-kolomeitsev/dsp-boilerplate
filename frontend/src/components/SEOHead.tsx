// @dsp obj-e9179045
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5173'
const SUPPORTED_LANGS = ['ru', 'en', 'kz', 'zh', 'ar'] as const

const LOCALE_MAP: Record<string, string> = {
  ru: 'ru_RU',
  en: 'en_US',
  kz: 'kk_KZ',
  zh: 'zh_CN',
  ar: 'ar_AE',
}

interface SEOHeadProps {
  title: string
  description: string
  ogImage?: string
}

// @dsp func-8fc7e7c4
export default function SEOHead({ title, description, ogImage }: SEOHeadProps) {
  const { i18n, ready } = useTranslation()
  const location = useLocation()
  const [forceUpdate, setForceUpdate] = useState(0)

  useEffect(() => {
    const handleLanguageChange = () => {
      setForceUpdate(prev => prev + 1)
    }

    i18n.on('languageChanged', handleLanguageChange)
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n])

  if (!ready) {
    return null
  }

  const currentUrl = `${APP_BASE_URL}${location.pathname}?lang=${i18n.language}`
  const languageKey = `${i18n.language}-${forceUpdate}`

  return (
    <Helmet key={languageKey} defer={false}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <html lang={i18n.language} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:locale" content={LOCALE_MAP[i18n.language] || 'en_US'} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <link rel="canonical" href={currentUrl} />

      {SUPPORTED_LANGS.map(lang => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={`${APP_BASE_URL}${location.pathname}?lang=${lang}`}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${APP_BASE_URL}${location.pathname}?lang=en`} />

      <link rel="apple-touch-icon" sizes="180x180" href="/img/favicon_img/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/img/favicon_img/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/img/favicon_img/favicon-16x16.png" />
      <link rel="manifest" href="/img/favicon_img/site.webmanifest" />
      <link rel="shortcut icon" href="/img/favicon_img/favicon.ico" />
    </Helmet>
  )
}
