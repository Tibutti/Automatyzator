import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Clock, GraduationCap, Search, Filter } from "lucide-react";
import { Training } from "@shared/schema";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import HeroSection from "@/components/hero-section";

export default function Trainings() {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [level, setLevel] = useState<string>("all");
  
  const currentLanguage = i18n.language;
  
  const { data: trainings = [], isLoading } = useQuery<Training[]>({
    queryKey: ["/api/trainings", currentLanguage],
    queryFn: async () => {
      const response = await fetch(`/api/trainings?lang=${currentLanguage}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
  });

  // Filtrowanie szkoleń
  const filteredTrainings = trainings.filter((training) => {
    const matchesSearch = training.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         training.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = level === "all" || training.level.toLowerCase() === level.toLowerCase();
    
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen pt-20">
      <HeroSection pageKey="trainings" />
      
      <div className="container mx-auto px-4 py-16">
        {/* Filtry */}
        <div className="my-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder={t("trainings.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger>
                <SelectValue placeholder={t("trainings.filterByLevel")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("trainings.allLevels")}</SelectItem>
                <SelectItem value="beginner">{t("trainings.levels.beginner")}</SelectItem>
                <SelectItem value="intermediate">{t("trainings.levels.intermediate")}</SelectItem>
                <SelectItem value="advanced">{t("trainings.levels.advanced")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      
        {/* Szkolenia */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="w-full h-48">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3 mt-1" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-5 w-1/2 col-span-2 mt-2" />
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredTrainings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrainings.map((training) => (
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
          <div className="text-center py-12">
            <div className="inline-flex justify-center items-center p-8 rounded-full bg-muted mb-4">
              <Filter className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("trainings.noResults")}</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {t("trainings.tryDifferentFilters")}
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm("");
                setLevel("all");
              }}
            >
              {t("trainings.clearFilters")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}