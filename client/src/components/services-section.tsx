import { Cog, Network, Zap, Bot, Brain } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ServicesSection() {
  const { t } = useTranslation('common');
  
  // Teraz mamy usługi z kluczami tłumaczeń
  const services = [
    {
      title: "Make.com",
      description: t('services.service1.description'),
      icon: Cog,
    },
    {
      title: "n8n",
      description: t('services.service2.description'),
      icon: Network,
    },
    {
      title: "Zapier",
      description: t('services.service3.description'),
      icon: Zap,
    },
    {
      title: t('services.service4.title'),
      description: t('services.service4.description'),
      icon: Bot,
    },
    {
      title: t('services.service5.title'),
      description: t('services.service5.description'),
      icon: Brain,
    },
  ];

  return (
    <section id="services" className="py-16 bg-gray-50 dark:bg-gray-900/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-montserrat font-bold text-center mb-12 text-foreground">
          {t('services.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-background dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg p-6 flex flex-col items-center text-center transition-all transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full mb-4">
                <service.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-montserrat font-bold mb-2 text-foreground">
                {service.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
