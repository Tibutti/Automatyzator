import { useTranslation } from "react-i18next";

export default function TermsOfService() {
  const { t } = useTranslation('common');

  return (
    <div className="prose max-w-none dark:prose-invert">
      <p className="mb-4">{t('terms.lastUpdated')}: 25.04.2025</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">{t('terms.introTitle')}</h2>
      <p>{t('terms.introText')}</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">{t('terms.definitionsTitle')}</h2>
      <p>{t('terms.definitionsText')}</p>
      <ul className="list-disc pl-6 mb-4">
        <li><strong>{t('terms.definitions.company')}</strong>: {t('terms.definitions.companyDef')}</li>
        <li><strong>{t('terms.definitions.service')}</strong>: {t('terms.definitions.serviceDef')}</li>
        <li><strong>{t('terms.definitions.user')}</strong>: {t('terms.definitions.userDef')}</li>
        <li><strong>{t('terms.definitions.content')}</strong>: {t('terms.definitions.contentDef')}</li>
      </ul>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">{t('terms.accountTitle')}</h2>
      <p>{t('terms.accountText')}</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">{t('terms.intellectualPropertyTitle')}</h2>
      <p>{t('terms.intellectualPropertyText')}</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">{t('terms.userContentTitle')}</h2>
      <p>{t('terms.userContentText')}</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">{t('terms.prohibitedTitle')}</h2>
      <p>{t('terms.prohibitedText')}</p>
      <ul className="list-disc pl-6 mb-4">
        <li>{t('terms.prohibited.illegal')}</li>
        <li>{t('terms.prohibited.harm')}</li>
        <li>{t('terms.prohibited.impersonate')}</li>
        <li>{t('terms.prohibited.unauthorized')}</li>
        <li>{t('terms.prohibited.interfere')}</li>
      </ul>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">{t('terms.terminationTitle')}</h2>
      <p>{t('terms.terminationText')}</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">{t('terms.disclaimerTitle')}</h2>
      <p>{t('terms.disclaimerText')}</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">{t('terms.limitationTitle')}</h2>
      <p>{t('terms.limitationText')}</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">{t('terms.contactTitle')}</h2>
      <p>{t('terms.contactText')}</p>
      <p className="mt-2">Email: legal@automatyzator.com</p>
    </div>
  );
}