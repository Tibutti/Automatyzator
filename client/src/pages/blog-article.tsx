import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Loader2, ArrowLeft, Eye, Clock, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import type { BlogPost } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import Layout from "@/components/layout/layout";

export default function BlogArticle() {
  const { slug } = useParams();
  const [_, setLocation] = useLocation();
  const { t } = useTranslation('common');

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: [`/api/blog-posts/${slug}`],
    queryFn: async () => {
      // Używamy funkcji apiRequest, która jest już przygotowana w projekcie
      const response = await apiRequest("GET", `/api/blog-posts/${slug}`);
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[70vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 pt-28 md:py-24">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-6">{t('blog.articleNotFound')}</h1>
            <p className="mb-8 text-muted-foreground">{t('blog.articleNotFoundDesc')}</p>
            <Button onClick={() => setLocation('/blog')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('blog.backToBlog')}
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 pt-28 md:py-24">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-8" 
            onClick={() => setLocation('/blog')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('blog.backToBlog')}
          </Button>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                {post.category}
              </span>
              {post.featured && (
                <span className="px-3 py-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-sm rounded-full">
                  {t('blog.featured')}
                </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-500 dark:text-gray-400 mb-8">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span className="text-sm">{post.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{post.readTime} {t('blog.minRead')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span className="text-sm">
                  {Math.floor(Math.random() * 1000) + 100} {t('blog.views')}
                </span>
              </div>
            </div>
          </div>

          {post.imageUrl && (
            <div className="mb-8">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-auto rounded-lg shadow-md" 
              />
            </div>
          )}

          <div className="prose dark:prose-invert prose-lg max-w-none">
            {/* Renderujemy zawartość HTML */}
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center">
              {post.authorImage && (
                <img 
                  src={post.authorImage} 
                  alt={post.author} 
                  className="w-12 h-12 rounded-full mr-4" 
                />
              )}
              <div>
                <h3 className="font-semibold">{post.author}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('blog.authorDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}