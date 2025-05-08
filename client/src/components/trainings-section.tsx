import { useTranslation } from "react-i18next";
import { Clock, GraduationCap } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Training } from "@shared/schema";
import { VisibilityGuard } from "@/components/visibility-guard";

export function TrainingsSection() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  
  const { data: trainings = [], isLoading } = useQuery<Training[]>({
    queryKey: ["/api/trainings"],
  });

  const filteredTrainings = trainings
    .filter(training => training.language === currentLanguage)
    .sort((a, b) => a.order - b.order);

  const featuredTrainings = filteredTrainings.filter(training => training.featured).slice(0, 3);
  const displayedTrainings = featuredTrainings.length > 0 ? featuredTrainings : filteredTrainings.slice(0, 3);

  return (
    <VisibilityGuard sectionKey="trainings">
      <section id="trainings" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h2 className="text-3xl font-montserrat font-bold text-foreground">{t("trainings.title")}</h2>
            <Link href="/trainings">
              <a className="mt-4 md:mt-0 text-primary font-inter font-semibold hover:underline">
                {t("trainings.viewAll")}
              </a>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <div className="flex justify-between items-center mb-4">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : displayedTrainings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displayedTrainings.map((training) => (
                <Card key={training.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    {training.imageUrl && (
                      <img 
                        src={training.imageUrl} 
                        alt={training.title} 
                        className="w-full h-48 object-cover" 
                      />
                    )}
                    {training.featured && (
                      <div className="absolute top-4 left-4 bg-accent text-black px-3 py-1 rounded-full text-sm font-semibold">
                        {t("trainings.featured")}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-montserrat font-bold mb-2 text-foreground">
                      {training.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {training.description}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-montserrat font-bold text-primary">
                        {new Intl.NumberFormat(i18n.language, { 
                          style: 'currency', 
                          currency: 'PLN' 
                        }).format(training.price / 100)}
                      </span>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>{training.duration}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-4">
                      <Badge variant="outline">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        {t(`trainings.levels.${training.level.toLowerCase()}`)}
                      </Badge>
                    </div>
                    <Link href={`/trainings/${training.id}`}>
                      <Button className="w-full cta-button">
                        {t("trainings.register")}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nie znaleziono żadnych szkoleń</p>
            </div>
          )}
        </div>
      </section>
    </VisibilityGuard>
  );
}