// @dsp obj-80f8b3e4
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import HomePage from './pages/HomePage'
import './App.css'

const SUPPORTED_LANGS = ['en', 'ru', 'kz', 'zh', 'ar']

// @dsp func-d7af3bb7
function App() {
  const { i18n } = useTranslation()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const langParam = urlParams.get('lang')

    if (langParam && SUPPORTED_LANGS.includes(langParam)) {
      if (i18n.language !== langParam) {
        i18n.changeLanguage(langParam)
      }
    }
  }, [i18n])

  useEffect(() => {
    const setTextDirection = (lang: string) => {
      const isRTL = lang === 'ar'
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
      document.documentElement.lang = lang
    }

    setTextDirection(i18n.language)

    i18n.on('languageChanged', setTextDirection)

    return () => {
      i18n.off('languageChanged', setTextDirection)
    }
  }, [i18n])

  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen bg-black text-white">
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  )
}

export default App
