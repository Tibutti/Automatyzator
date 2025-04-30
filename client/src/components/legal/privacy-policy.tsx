import { useTranslation } from "react-i18next";

export default function PrivacyPolicy() {
  const { t } = useTranslation('common');
  
  return (
    <div className="prose max-w-none dark:prose-invert">
      <p className="mb-4">{t('privacy.lastUpdated')}: 25.04.2025</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">{t('privacy.introTitle')}</h2>
      <p>{t('privacy.introText')}</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">{t('privacy.dataCollectionTitle')}</h2>
      <p>{t('privacy.dataCollectionText')}</p>
      
      <h3 className="text-lg font-semibold mt-4 mb-2">{t('privacy.personalDataTitle')}</h3>
      <p>{t('privacy.personalDataText')}</p>
      <ul className="list-disc pl-6 mb-4">
        <li>{t('privacy.personalData.name')}</li>
        <li>{t('privacy.personalData.email')}</li>
        <li>{t('privacy.personalData.phone')}</li>
        <li>{t('privacy.personalData.company')}</li>
      </ul>
      
      <h3 className="text-lg font-semibold mt-4 mb-2">{t('privacy.usageDataTitle')}</h3>
      <p>{t('privacy.usageDataText')}</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">{t('privacy.cookiesTitle')}</h2>
      <p>{t('privacy.cookiesText')}</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">{t('privacy.dataUseTitle')}</h2>
      <p>{t('privacy.dataUseText')}</p>
      <ul className="list-disc pl-6 mb-4">
        <li>{t('privacy.dataUse.provide')}</li>
        <li>{t('privacy.dataUse.improve')}</li>
        <li>{t('privacy.dataUse.communicate')}</li>
        <li>{t('privacy.dataUse.legal')}</li>
      </ul>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">{t('privacy.dataSharingTitle')}</h2>
      <p>{t('privacy.dataSharingText')}</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">{t('privacy.dataSecurityTitle')}</h2>
      <p>{t('privacy.dataSecurityText')}</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">{t('privacy.userRightsTitle')}</h2>
      <p>{t('privacy.userRightsText')}</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">{t('privacy.contactTitle')}</h2>
      <p>{t('privacy.contactText')}</p>
      <p className="mt-2">Email: privacy@automatyzator.com</p>
    </div>
  );
}