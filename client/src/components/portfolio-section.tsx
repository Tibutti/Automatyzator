import { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { CaseStudy } from "@shared/schema";
import { useTranslation } from "react-i18next";

export default function PortfolioSection() {
  const { t } = useTranslation('common');
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(false);
  
  const { data: caseStudies, isLoading } = useQuery<CaseStudy[]>({
    queryKey: ["/api/case-studies/featured"],
  });
  
  useEffect(() => {
    const handleResize = () => {
      setShowControls(window.innerWidth >= 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    
    const { current } = carouselRef;
    const scrollAmount = direction === 'left' ? -350 : 350;
    current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };
  
  return (
    <section id="portfolio" className="py-16 bg-gray-50 dark:bg-gray-900/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2 className="text-3xl font-montserrat font-bold text-foreground">{t('portfolio.title')}</h2>
          <Link href="/portfolio">
            <a className="mt-4 md:mt-0 text-primary font-inter font-semibold hover:underline">
              {t('portfolio.viewAll')}
            </a>
          </Link>
        </div>
        
        <div className="relative overflow-hidden">
          <div 
            ref={carouselRef}
            className="flex space-x-6 overflow-x-auto pb-6 snap-x scrollbar-hide"
          >
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div 
                  key={i}
                  className="min-w-[300px] md:min-w-[350px] snap-center flex-shrink-0"
                >
                  <Card className="h-full">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <div className="flex gap-2 mb-4">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                      <Skeleton className="h-4 w-24" />
                    </CardContent>
                  </Card>
                </div>
              ))
            ) : (
              caseStudies?.map(study => (
                <div 
                  key={study.id}
                  className="min-w-[300px] md:min-w-[350px] snap-center flex-shrink-0"
                >
                  <Card className="h-full overflow-hidden">
                    {study.imageUrl && (
                      <img 
                        src={study.imageUrl} 
                        alt={study.title} 
                        className="w-full h-48 object-cover" 
                      />
                    )}
                    <CardContent className="p-6">
                      <h3 className="text-xl font-montserrat font-bold mb-2 text-foreground">
                        {study.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {study.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {study.tools?.map((tool, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary"
                            className={index === 0 ? "bg-primary/10 text-primary" : ""}
                          >
                            {tool}
                          </Badge>
                        ))}
                      </div>
                      <Link href={`/portfolio/${study.slug}`}>
                        <Button variant="link" className="p-0 text-primary">
                          {t('portfolio.readMore')}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              ))
            )}
          </div>
          
          {showControls && (
            <>
              <Button
                onClick={() => scroll('left')}
                className="absolute top-1/2 -translate-y-1/2 left-0 w-10 h-10 rounded-full shadow-md p-0"
                variant="secondary"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => scroll('right')}
                className="absolute top-1/2 -translate-y-1/2 right-0 w-10 h-10 rounded-full shadow-md p-0"
                variant="secondary"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
