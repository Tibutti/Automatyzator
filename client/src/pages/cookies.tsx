import { useTranslation } from "react-i18next";

export default function Cookies() {
  const { t } = useTranslation('common');

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">{t('cookies.title')}</h1>
      
      <div className="prose max-w-none dark:prose-invert prose-lg">
        <p className="mb-4">{t('cookies.lastUpdated')}: 25.04.2025</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('cookies.introTitle')}</h2>
        <p>{t('cookies.introText')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('cookies.whatTitle')}</h2>
        <p>{t('cookies.whatText')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('cookies.typeTitle')}</h2>
        <p>{t('cookies.typeText')}</p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">{t('cookies.essentialTitle')}</h3>
        <p>{t('cookies.essentialText')}</p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">{t('cookies.preferencesTitle')}</h3>
        <p>{t('cookies.preferencesText')}</p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">{t('cookies.statisticsTitle')}</h3>
        <p>{t('cookies.statisticsText')}</p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">{t('cookies.marketingTitle')}</h3>
        <p>{t('cookies.marketingText')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('cookies.controlTitle')}</h2>
        <p>{t('cookies.controlText')}</p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">{t('cookies.browserTitle')}</h3>
        <p>{t('cookies.browserText')}</p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">{t('cookies.settingsTitle')}</h3>
        <p>{t('cookies.settingsText')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('cookies.thirdPartyTitle')}</h2>
        <p>{t('cookies.thirdPartyText')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('cookies.moreInfoTitle')}</h2>
        <p>{t('cookies.moreInfoText')}</p>
        <p className="mt-2">Email: privacy@automatyzator.com</p>
      </div>
    </div>
  );
}