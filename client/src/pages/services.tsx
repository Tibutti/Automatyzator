import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import HeroSection from "@/components/hero-section";
import CtaSection from "@/components/cta-section";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Service } from "@shared/schema";

export default function Services() {
  const { t, i18n } = useTranslation('common');
  
  // Pobierz usługi z API z uwzględnieniem aktualnego języka
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services", i18n.language],
    queryFn: async ({ queryKey }) => {
      const [endpoint, language] = queryKey;
      const currentLanguage = typeof language === 'string' ? language.substring(0, 2) : "pl";
      const response = await fetch(`${endpoint}?lang=${currentLanguage}`);
      if (!response.ok) {
        console.error("Failed to fetch services");
        return [];
      }
      return response.json();
    },
  });
  
  return (
    <div className="pt-20">
      <HeroSection />
      
      {/* Sekcja usług z danymi pobranymi z API */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-foreground mb-4">
              {t('services.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="h-full border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-all">
                  <CardContent className="p-8 h-full flex flex-col">
                    <div className="mb-6">
                      <Skeleton className="h-12 w-12 rounded" />
                    </div>
                    <Skeleton className="h-7 w-3/4 mb-4" />
                    <div className="space-y-2 mb-6 flex-grow">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                  </CardContent>
                </Card>
              ))
            ) : (
              services?.map(service => (
                <Card key={service.id} className="h-full border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-all">
                  <CardContent className="p-8 h-full flex flex-col">
                    <div className="mb-6 text-primary text-5xl" dangerouslySetInnerHTML={{ __html: service.icon }} />
                    <h3 className="text-xl font-montserrat font-bold mb-4 text-foreground">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow">
                      {service.description}
                    </p>
                    <Button variant="default" className="group mt-4">
                      {t('services.learnMore')}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>
      
      <CtaSection />
    </div>
  );
}