import { Rocket, Headphones, Package, Code } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function WhyUsSection() {
  const { t } = useTranslation('common');
  
  const features = [
    {
      title: t('whyUs.reason1.title'),
      description: t('whyUs.reason1.description'),
      icon: Rocket,
      accentColor: "accent",
    },
    {
      title: t('whyUs.reason2.title'),
      description: t('whyUs.reason2.description'),
      icon: Headphones,
      accentColor: "primary",
    },
    {
      title: t('whyUs.reason3.title'),
      description: t('whyUs.reason3.description'),
      icon: Package,
      accentColor: "accent",
    },
    {
      title: t('whyUs.title'),
      description: t('cta.description'),
      icon: Code,
      accentColor: "primary",
    },
  ];

  return (
    <section id="why-us" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-montserrat font-bold text-center mb-12 text-foreground whitespace-nowrap">
          {t('whyUs.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-background dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 bg-${feature.accentColor}/10 rounded-full flex items-center justify-center mb-4`}>
                <feature.icon className={`text-${feature.accentColor} text-xl`} />
              </div>
              <h3 className="text-xl font-montserrat font-bold mb-2 text-foreground whitespace-nowrap">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
