import { useTranslation } from "react-i18next";
import { Calendar, Clock, GraduationCap, Users } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Training } from "@shared/schema";

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
    <Section id="trainings" className="py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {t("trainings.title")}
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            {t("trainings.subtitle")}
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-40 bg-muted"></CardHeader>
                <CardContent className="mt-4">
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </div>
                </CardContent>
                <CardFooter className="h-12 bg-muted mt-4"></CardFooter>
              </Card>
            ))}
          </div>
        ) : displayedTrainings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedTrainings.map((training) => (
              <Card key={training.id} className="overflow-hidden transition-all hover:shadow-lg border border-border/40">
                {training.imageUrl && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <img 
                      src={training.imageUrl} 
                      alt={training.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                    {training.featured && (
                      <Badge className="absolute top-2 right-2 bg-primary">
                        {t("trainings.featured")}
                      </Badge>
                    )}
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{training.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {training.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{t("trainings.duration")}: {training.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      <span>
                        {t("trainings.level")}: {t(`trainings.levels.${training.level.toLowerCase()}`)}
                      </span>
                    </div>
                    <div className="flex items-center col-span-2 mt-2">
                      <span className="font-medium text-base">
                        {t("trainings.price")}: {new Intl.NumberFormat(i18n.language, { 
                          style: 'currency', 
                          currency: 'PLN' 
                        }).format(training.price / 100)}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="gap-2 pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    {t("trainings.readMore")}
                  </Button>
                  <Button size="sm" className="w-full">
                    {t("trainings.register")}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nie znaleziono żadnych szkoleń</p>
          </div>
        )}
        
        {trainings.length > 3 && (
          <div className="flex justify-center mt-10">
            <Link href="/trainings">
              <Button variant="outline">
                {t("trainings.viewAll")}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Section>
  );
}