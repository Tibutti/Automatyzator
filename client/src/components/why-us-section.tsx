import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { WhyUsItem } from "@shared/schema";
import { useTranslation } from "react-i18next";

export default function WhyUsSection() {
  const { t, i18n } = useTranslation('common');
  const { data: items, isLoading } = useQuery<WhyUsItem[]>({
    queryKey: ["/api/why-us", i18n.language],
    queryFn: async ({ queryKey }) => {
      const [endpoint, language] = queryKey;
      const currentLanguage = typeof language === 'string' ? language.substring(0, 2) : "pl";
      const response = await fetch(`${endpoint}?lang=${currentLanguage}`);
      if (!response.ok) {
        console.error("Failed to fetch Why Us items");
        return [];
      }
      return response.json();
    },
  });
  
  return (
    <section id="why-us" className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-montserrat font-bold text-foreground mb-4">
            {t('whyUs.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('whyUs.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-6">
                    <Skeleton className="h-16 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-2/3 mx-auto mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            items?.map(item => (
              <Card key={item.id} className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="text-4xl text-primary" dangerouslySetInnerHTML={{ __html: item.icon }} />
                  </div>
                  <h3 className="text-xl font-montserrat font-bold mb-4 text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}