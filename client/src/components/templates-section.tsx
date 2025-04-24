import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, StarHalf } from "lucide-react";
import { formatPrice, generateStarRating } from "@/lib/utils";
import type { Template } from "@shared/schema";

export default function TemplatesSection() {
  const { data: templates, isLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates/featured"],
  });
  
  return (
    <section id="shop" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2 className="text-3xl font-montserrat font-bold text-foreground">Szablony</h2>
          <Link href="/shop">
            <a className="mt-4 md:mt-0 text-primary font-inter font-semibold hover:underline">
              Zobacz wszystkie szablony
            </a>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
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
            ))
          ) : (
            templates?.map(template => {
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
                      <div className="absolute top-4 left-4 bg-accent text-black px-3 py-1 rounded-full text-sm font-semibold">
                        Bestseller
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-montserrat font-bold mb-2 text-foreground">
                      {template.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {template.description}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-montserrat font-bold text-primary">
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
                    <Link href={`/shop/${template.slug}`}>
                      <Button className="w-full cta-button">
                        Kup teraz
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
