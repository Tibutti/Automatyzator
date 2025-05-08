import { useTranslation } from "react-i18next";

export default function TermsOfService() {
  const { t } = useTranslation('common');

  return (
    <div className="container mx-auto pt-28 pb-12 px-4">
      <h1 className="text-3xl font-bold mb-8">{t('terms.title')}</h1>
      
      <div className="prose max-w-none dark:prose-invert prose-lg">
        <p className="mb-4">{t('terms.lastUpdated')}: 25.04.2025</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.introTitle')}</h2>
        <p>{t('terms.introText')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.definitionsTitle')}</h2>
        <p>{t('terms.definitionsText')}</p>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>{t('terms.definitions.company')}</strong>: {t('terms.definitions.companyDef')}</li>
          <li><strong>{t('terms.definitions.service')}</strong>: {t('terms.definitions.serviceDef')}</li>
          <li><strong>{t('terms.definitions.user')}</strong>: {t('terms.definitions.userDef')}</li>
          <li><strong>{t('terms.definitions.content')}</strong>: {t('terms.definitions.contentDef')}</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.accountTitle')}</h2>
        <p>{t('terms.accountText')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.intellectualPropertyTitle')}</h2>
        <p>{t('terms.intellectualPropertyText')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.userContentTitle')}</h2>
        <p>{t('terms.userContentText')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.prohibitedTitle')}</h2>
        <p>{t('terms.prohibitedText')}</p>
        <ul className="list-disc pl-6 mb-4">
          <li>{t('terms.prohibited.illegal')}</li>
          <li>{t('terms.prohibited.harm')}</li>
          <li>{t('terms.prohibited.impersonate')}</li>
          <li>{t('terms.prohibited.unauthorized')}</li>
          <li>{t('terms.prohibited.interfere')}</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.terminationTitle')}</h2>
        <p>{t('terms.terminationText')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.disclaimerTitle')}</h2>
        <p>{t('terms.disclaimerText')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.limitationTitle')}</h2>
        <p>{t('terms.limitationText')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.contactTitle')}</h2>
        <p>{t('terms.contactText')}</p>
        <p className="mt-2">Email: legal@automatyzator.com</p>
      </div>
    </div>
  );
}