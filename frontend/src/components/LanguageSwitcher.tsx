// @dsp obj-0383d3e5
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, LanguageIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'en', name: 'languages.english', flag: '🇺🇸' },
  { code: 'ru', name: 'languages.russian', flag: '🇷🇺' },
  { code: 'kz', name: 'languages.kazakh', flag: '🇰🇿' },
  { code: 'zh', name: 'languages.chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'languages.arabic', flag: '🇸🇦' },
]

// @dsp func-a9a7fe67
export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode)
    
    // Update the URL lang parameter
    const url = new URL(window.location.href)
    url.searchParams.set('lang', langCode)
    window.history.replaceState({}, '', url.toString())
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="cursor-pointer inline-flex items-center gap-x-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/90 shadow-sm backdrop-blur-md hover:bg-white/10 transition-colors duration-200">
          <LanguageIcon className="h-5 w-5" />
          <span className="hidden sm:inline-flex items-center gap-x-1">
            <span>{currentLanguage.flag}</span>
            <span>{t(currentLanguage.name)}</span>
          </span>
          <ChevronDownIcon aria-hidden="true" className="h-4 w-4 text-white/60" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          modal={false}
          className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl border border-white/10 bg-black/85 shadow-lg backdrop-blur-md focus:outline-none"
        >
          <div className="py-1">
            {languages.map((language) => (
              <Menu.Item key={language.code}>
                {({ active }) => (
                  <button
                    onClick={() => changeLanguage(language.code)}
                    className={`${
                      active 
                        ? 'bg-white/10 text-white' 
                        : 'text-white/80'
                    } ${
                      i18n.language === language.code 
                        ? 'bg-fuchsia-500/10 text-fuchsia-200 font-medium'
                        : ''
                    } cursor-pointer group flex w-full items-center px-4 py-2 text-sm transition-colors duration-150`}
                  >
                    <span className="mr-3 text-lg">{language.flag}</span>
                    <span>{t(language.name)}</span>
                    {i18n.language === language.code && (
                      <span className="ml-auto">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
