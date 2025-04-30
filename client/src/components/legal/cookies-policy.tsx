import { useTranslation } from "react-i18next";

export default function CookiesPolicy() {
  const { t } = useTranslation('common');

  return (
    <div className="prose max-w-none dark:prose-invert">
      <p className="mb-4">{t('cookies.lastUpdated')}: 25.04.2025</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">{t('cookies.introTitle')}</h2>
      <p>{t('cookies.introText')}</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">{t('cookies.whatTitle')}</h2>
      <p>{t('cookies.whatText')}</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">{t('cookies.typeTitle')}</h2>
      <p>{t('cookies.typeText')}</p>
      
      <h3 className="text-lg font-semibold mt-4 mb-2">{t('cookies.essentialTitle')}</h3>
      <p>{t('cookies.essentialText')}</p>
      
      <h3 className="text-lg font-semibold mt-4 mb-2">{t('cookies.preferencesTitle')}</h3>
      <p>{t('cookies.preferencesText')}</p>
      
      <h3 className="text-lg font-semibold mt-4 mb-2">{t('cookies.statisticsTitle')}</h3>
      <p>{t('cookies.statisticsText')}</p>
      
      <h3 className="text-lg font-semibold mt-4 mb-2">{t('cookies.marketingTitle')}</h3>
      <p>{t('cookies.marketingText')}</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">{t('cookies.controlTitle')}</h2>
      <p>{t('cookies.controlText')}</p>
      
      <h3 className="text-lg font-semibold mt-4 mb-2">{t('cookies.browserTitle')}</h3>
      <p>{t('cookies.browserText')}</p>
      
      <h3 className="text-lg font-semibold mt-4 mb-2">{t('cookies.settingsTitle')}</h3>
      <p>{t('cookies.settingsText')}</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">{t('cookies.thirdPartyTitle')}</h2>
      <p>{t('cookies.thirdPartyText')}</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">{t('cookies.moreInfoTitle')}</h2>
      <p>{t('cookies.moreInfoText')}</p>
      <p className="mt-2">Email: privacy@automatyzator.com</p>
    </div>
  );
}