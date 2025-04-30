import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@shared/schema";
import { useTranslation } from "react-i18next";

export default function BlogSection() {
  const { t } = useTranslation('common');
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts/featured"],
  });
  
  return (
    <section id="blog" className="py-16 bg-gray-50 dark:bg-gray-900/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2 className="text-3xl font-montserrat font-bold text-foreground">{t('blog.title')}</h2>
          <Link href="/blog">
            <a className="mt-4 md:mt-0 text-primary font-inter font-semibold hover:underline">
              {t('blog.viewAll')}
            </a>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Skeleton className="h-8 w-8 rounded-full mr-2" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            posts?.map(post => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {post.imageUrl && (
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-48 object-cover" 
                  />
                )}
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {post.readTime} {t('blog.minRead')}
                    </span>
                  </div>
                  <h3 className="text-xl font-montserrat font-bold mb-2 text-foreground">
                    {post.title}
                  </h3>
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
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {post.author}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(post.publishedAt)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
