import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@shared/schema";
import { useTranslation } from "react-i18next";
import HeroSection from "@/components/hero-section";

export default function Blog() {
  const { t } = useTranslation('common');
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });
  
  // Filter posts by search term and category
  const filteredPosts = posts?.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || post.category.toLowerCase() === activeCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });
  
  // Extract unique categories
  const categories = posts ? ["all", ...(new Set(posts.map(post => post.category)) as any)] : ["all"];
  
  return (
    <div className="min-h-screen pt-20">
      <HeroSection pageKey="blog" />
      
      <div className="container mx-auto px-4 py-16">
        <div className="mb-10">
          <Input
            type="search"
            placeholder="Szukaj artykułów..."
            className="max-w-md mx-auto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-12">
          <TabsList className="flex flex-wrap justify-center max-w-3xl mx-auto mb-6">
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {t(`blog.categories.${category.toLowerCase()}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="pt-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-24 w-full mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          filteredPosts && filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                    {post.imageUrl && (
                      <div className="relative h-48 w-full overflow-hidden">
                        <img 
                          src={post.imageUrl} 
                          alt={post.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {post.category}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {post.readTime} min czytania
                        </span>
                      </div>
                      <CardTitle className="text-xl mb-2 hover:text-primary transition-colors">{post.title}</CardTitle>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {post.authorImage && (
                            <img 
                              src={post.authorImage} 
                              alt={post.author} 
                              className="w-8 h-8 rounded-full mr-2"
                            />
                          )}
                          <span className="text-sm text-gray-600 dark:text-gray-300">{post.author}</span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(post.publishedAt)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">Brak artykułów spełniających kryteria</h3>
              <p>Spróbuj zmienić kryteria wyszukiwania lub kategorię.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}