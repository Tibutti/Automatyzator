import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { CaseStudy } from "@shared/schema";
import { useTranslation } from "react-i18next";

export default function Portfolio() {
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation('common');
  
  const { data: caseStudies, isLoading } = useQuery<CaseStudy[]>({
    queryKey: ["/api/case-studies"],
  });
  
  const handleRequestOffer = () => {
    toast({
      title: "Dziękujemy za zainteresowanie",
      description: "Przejdź do formularza kontaktowego, aby zamówić podobne rozwiązanie.",
      duration: 5000,
    });
    setSelectedCase(null);
  };
  
  return (
    <div className="container mx-auto px-4 py-16 pt-28 md:py-24">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center whitespace-nowrap">{t('portfolio.title')}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-2xl">
          {t('portfolio.description')}
        </p>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="pt-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-24 w-full mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies?.map(caseStudy => (
            <Card 
              key={caseStudy.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedCase(caseStudy)}
            >
              {caseStudy.imageUrl && (
                <img 
                  src={caseStudy.imageUrl} 
                  alt={caseStudy.title} 
                  className="w-full h-48 object-cover"
                />
              )}
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{caseStudy.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {caseStudy.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {caseStudy.tools?.map((tool, index) => (
                    <Badge key={index} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                      {tool}
                    </Badge>
                  ))}
                </div>
                <Button variant="link" className="p-0 text-primary whitespace-nowrap">
                  {t('portfolio.readMore')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Case Study Detail Dialog */}
      <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
        {selectedCase && (
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedCase.title}</DialogTitle>
              <DialogDescription>
                {t('portfolio.caseStudy')}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {selectedCase.imageUrl && (
                  <img 
                    src={selectedCase.imageUrl} 
                    alt={selectedCase.title} 
                    className="w-full h-auto object-cover rounded-lg"
                  />
                )}
                
                <h3 className="text-xl font-bold mt-6 mb-2 whitespace-nowrap">{t('portfolio.tools')}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedCase.tools?.map((tool, index) => (
                    <Badge key={index} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                      {tool}
                    </Badge>
                  ))}
                </div>
                
                <h3 className="text-xl font-bold mt-6 mb-2 whitespace-nowrap">{t('portfolio.tags')}</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCase.tags?.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-2 whitespace-nowrap">{t('portfolio.solution')}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {selectedCase.description}
                </p>
                
                <div className="mb-6">
                  <h4 className="font-bold mb-2 whitespace-nowrap">{t('portfolio.challenge')}</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Klient potrzebował rozwiązania, które zautomatyzuje proces obsługi zamówień i integracji
                    z dostawcami. Wcześniej wszystko było robione ręcznie, co prowadziło do opóźnień i błędów.
                  </p>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-bold mb-2 whitespace-nowrap">{t('portfolio.approach')}</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Wdrożyliśmy zautomatyzowany przepływ pracy, który integruje system e-commerce z systemem zarządzania
                    magazynem i dostawcami. Teraz cały proces działa automatycznie, bez potrzeby ręcznej interwencji.
                  </p>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-bold mb-2 whitespace-nowrap">{t('portfolio.results')}</h4>
                  <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300">
                    <li>Redukcja czasu obsługi zamówienia o 75%</li>
                    <li>Eliminacja błędów przy wprowadzaniu danych</li>
                    <li>Zwiększenie satysfakcji klientów dzięki szybszej realizacji</li>
                    <li>Oszczędność 20 godzin tygodniowo na ręcznych procesach</li>
                  </ul>
                </div>
                
                <Button 
                  className="w-full py-6 text-lg cta-button whitespace-nowrap"
                  onClick={handleRequestOffer}
                >
                  {t('portfolio.requestOffer')}
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
