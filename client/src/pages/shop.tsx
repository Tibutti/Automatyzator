import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, StarHalf } from "lucide-react";
import { formatPrice, generateStarRating } from "@/lib/utils";
import type { Template } from "@shared/schema";
import { useTranslation } from "react-i18next";
import HeroSection from "@/components/hero-section";

export default function Shop() {
  const { t } = useTranslation('common');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  
  const { data: templates, isLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });
  
  return (
    <div className="min-h-screen pt-20">
      <HeroSection pageKey="shop" />
      
      <div className="container mx-auto px-4 py-16">
      
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="pt-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-24 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates?.map(template => {
              const stars = generateStarRating(template.rating);
              
              return (
                <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    {template.imageUrl && (
                      <img 
                        src={template.imageUrl} 
                        alt={template.title} 
                        className="w-full h-48 object-cover"
                      />
                    )}
                    {template.isBestseller && (
                      <div className="absolute top-4 left-4 bg-accent text-dark px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                        {t('templates.bestseller')}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <CardTitle className="text-xl mb-2">{template.title}</CardTitle>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {template.description}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(template.price)}
                      </span>
                      <div className="flex items-center">
                        {[...Array(stars.full)].map((_, i) => (
                          <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        ))}
                        {stars.half > 0 && <StarHalf className="h-4 w-4 fill-yellow-500 text-yellow-500" />}
                        {[...Array(stars.empty)].map((_, i) => (
                          <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
                        ))}
                        <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">
                          ({template.reviewCount})
                        </span>
                      </div>
                    </div>
                    <Button 
                      className="w-full cta-button whitespace-nowrap" 
                      onClick={() => setSelectedTemplate(template)}
                    >
                      {t('templates.buyNow')}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        
        {/* Template Detail Dialog */}
        <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
          {selectedTemplate && (
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedTemplate.title}</DialogTitle>
                <DialogDescription>
                  {t('templates.details') || "Szczegóły szablonu"}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {selectedTemplate.imageUrl && (
                    <img 
                      src={selectedTemplate.imageUrl} 
                      alt={selectedTemplate.title} 
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{t('templates.description')}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {selectedTemplate.description}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="font-bold mb-1">{t('templates.includes')}</h4>
                    <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300">
                      <li>{t('templates.includeWorkflow')}</li>
                      <li>{t('templates.includeDocumentation')}</li>
                      <li>{t('templates.includeSupport')}</li>
                      <li>{t('templates.includeUpdates')}</li>
                    </ul>
                  </div>
                  
                  <div className="flex items-center mb-6">
                    <div className="flex mr-2">
                      {generateStarRating(selectedTemplate.rating).full > 0 && 
                        [...Array(generateStarRating(selectedTemplate.rating).full)].map((_, i) => (
                          <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        ))
                      }
                      {generateStarRating(selectedTemplate.rating).half > 0 && 
                        <StarHalf className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      }
                      {generateStarRating(selectedTemplate.rating).empty > 0 && 
                        [...Array(generateStarRating(selectedTemplate.rating).empty)].map((_, i) => (
                          <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
                        ))
                      }
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {selectedTemplate.reviewCount} {t('templates.reviews')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-bold text-primary">
                      {formatPrice(selectedTemplate.price)}
                    </span>
                    {selectedTemplate.isBestseller && (
                      <span className="bg-accent text-dark px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                        {t('templates.bestseller')}
                      </span>
                    )}
                  </div>
                  
                  <Button className="w-full py-6 text-lg cta-button whitespace-nowrap">
                    {t('templates.buyNow')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </div>
  );
}