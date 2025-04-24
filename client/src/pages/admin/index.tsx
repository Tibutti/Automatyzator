import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/admin-layout";
import ProtectedRoute from "@/components/admin/protected-route";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  FileText,
  ShoppingBag,
  Briefcase,
  Users,
  Mail,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function AdminDashboard() {
  const { user } = useAuth();
  
  // Fetch data for dashboard
  const { data: blogPosts = [], isLoading: isBlogLoading } = useQuery({
    queryKey: ["/api/blog-posts"],
    retry: false,
    staleTime: 60 * 1000, // 1 minute
  });
  
  const { data: templates = [], isLoading: isTemplatesLoading } = useQuery({
    queryKey: ["/api/templates"],
    retry: false,
    staleTime: 60 * 1000,
  });
  
  const { data: caseStudies = [], isLoading: isCaseStudiesLoading } = useQuery({
    queryKey: ["/api/case-studies"],
    retry: false,
    staleTime: 60 * 1000,
  });
  
  const isLoading = isBlogLoading || isTemplatesLoading || isCaseStudiesLoading;

  const recentContent = [
    ...blogPosts.map((post: any) => ({
      type: "blog",
      id: post.id,
      title: post.title, 
      date: new Date(post.publishedAt),
      category: post.category,
      href: `/admin/blog?edit=${post.id}`
    })),
    ...templates.map((template: any) => ({
      type: "template",
      id: template.id,
      title: template.title,
      date: new Date(), // Assuming no date field in template
      category: "Szablon",
      href: `/admin/templates?edit=${template.id}`
    })),
    ...caseStudies.map((caseStudy: any) => ({
      type: "case-study",
      id: caseStudy.id,
      title: caseStudy.title,
      date: new Date(), // Assuming no date field in case study
      category: "Case study",
      href: `/admin/case-studies?edit=${caseStudy.id}`
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime())
   .slice(0, 5);

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Panel główny</h1>
            <p className="text-muted-foreground mt-2">
              Witaj, <span className="font-semibold">{user?.username}</span>. Zarządzaj swoją witryną z jednego miejsca.
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Artykuły na blogu</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <p className="text-2xl font-bold">{blogPosts.length}</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Szablony automatyzacji</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <p className="text-2xl font-bold">{templates.length}</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Case studies</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <p className="text-2xl font-bold">{caseStudies.length}</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Subskrybenci</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">0</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Content & Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Ostatnio dodane treści</CardTitle>
                <CardDescription>Ostatnio dodane lub zaktualizowane treści na stronie</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : recentContent.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Brak treści do wyświetlenia
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentContent.map((item) => (
                      <div key={`${item.type}-${item.id}`} className="flex items-center">
                        <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                          {item.type === "blog" && <FileText className="h-5 w-5 text-primary" />}
                          {item.type === "template" && <ShoppingBag className="h-5 w-5 text-primary" />}
                          {item.type === "case-study" && <Briefcase className="h-5 w-5 text-primary" />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{item.title}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span>{item.category}</span>
                            <span className="mx-2">•</span>
                            <span>{item.date.toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={item.href}>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Zobacz wszystkie treści
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Szybkie akcje</CardTitle>
                <CardDescription>Najpopularniejsze operacje administracyjne</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" asChild>
                  <Link href="/admin/blog?new=true">
                    <FileText className="mr-2 h-4 w-4" />
                    Dodaj nowy artykuł
                  </Link>
                </Button>
                <Button className="w-full justify-start" asChild>
                  <Link href="/admin/templates?new=true">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Dodaj nowy szablon
                  </Link>
                </Button>
                <Button className="w-full justify-start" asChild>
                  <Link href="/admin/case-studies?new=true">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Dodaj case study
                  </Link>
                </Button>
                <Button className="w-full justify-start" asChild>
                  <Link href="/admin/messages">
                    <Users className="mr-2 h-4 w-4" />
                    Wiadomości kontaktowe
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}