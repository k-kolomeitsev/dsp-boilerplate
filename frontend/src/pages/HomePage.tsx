// @dsp obj-018f8a29
import { useTranslation } from 'react-i18next'
import SEOHead from '../components/SEOHead'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { Button } from '../components/ui/Button'

// @dsp func-a9a3e546
export default function HomePage() {
  const { t } = useTranslation()

  return (
    <>
      <SEOHead
        title={t('common.seo.title')}
        description={t('common.seo.description')}
      />

      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="absolute top-6 right-6">
          <LanguageSwitcher />
        </div>

        <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
          {t('common.title')}
        </h1>

        <a href="https://github.com/k-kolomeitsev/data-structure-protocol" target="_blank" rel="noopener noreferrer">
          <Button variant="primary" size="lg">
            {t('common.githubLink')}
          </Button>
        </a>
      </div>
    </>
  )
}
