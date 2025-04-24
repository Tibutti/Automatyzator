import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import AdminLayout from "@/components/admin/admin-layout";
import ProtectedRoute from "@/components/admin/protected-route";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, ShoppingBag, Briefcase, Mail, Users } from "lucide-react";

export default function AdminDashboard() {
  const { data: blogPosts = [] } = useQuery({
    queryKey: ["/api/blog-posts"],
    retry: false,
  });

  const { data: templates = [] } = useQuery({
    queryKey: ["/api/templates"],
    retry: false,
  });

  const { data: caseStudies = [] } = useQuery({
    queryKey: ["/api/case-studies"],
    retry: false,
  });

  // Przykładowe dane dla wykresu
  const chartData = [
    { name: "Styczeń", visits: 4000, unique: 2400 },
    { name: "Luty", visits: 3000, unique: 1398 },
    { name: "Marzec", visits: 2000, unique: 980 },
    { name: "Kwiecień", visits: 2780, unique: 1908 },
    { name: "Maj", visits: 1890, unique: 1800 },
    { name: "Czerwiec", visits: 2390, unique: 1500 },
    { name: "Lipiec", visits: 3490, unique: 2300 },
  ];

  const stats = [
    {
      title: "Artykuły na blogu",
      value: blogPosts.length,
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      color: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Szablony",
      value: templates.length,
      icon: <ShoppingBag className="h-5 w-5 text-green-500" />,
      color: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Case Studies",
      value: caseStudies.length,
      icon: <Briefcase className="h-5 w-5 text-purple-500" />,
      color: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "Wiadomości",
      value: 12,
      icon: <Mail className="h-5 w-5 text-orange-500" />,
      color: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      title: "Subskrybenci",
      value: 254,
      icon: <Users className="h-5 w-5 text-teal-500" />,
      color: "bg-teal-50 dark:bg-teal-900/20",
    },
  ];

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-full ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">{stat.title}</p>
                      <h3 className="font-bold text-2xl">{stat.value}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Ruch na stronie</CardTitle>
                <CardDescription>
                  Liczba odwiedzin i unikalnych użytkowników w ostatnich miesiącach
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="visits" fill="#3b82f6" name="Odwiedziny" />
                      <Bar dataKey="unique" fill="#10b981" name="Unikalni użytkownicy" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="recent-blog" className="space-y-4">
            <TabsList>
              <TabsTrigger value="recent-blog">Najnowsze artykuły</TabsTrigger>
              <TabsTrigger value="recent-templates">Najnowsze szablony</TabsTrigger>
              <TabsTrigger value="recent-case-studies">Najnowsze case studies</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recent-blog" className="space-y-4">
              <div className="grid gap-4">
                {blogPosts.slice(0, 5).map((post: any) => (
                  <Card key={post.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{post.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(post.publishedAt).toLocaleDateString()} | {post.category}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {post.featured && (
                            <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 text-xs px-2 py-1 rounded">
                              Wyróżniony
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="recent-templates" className="space-y-4">
              <div className="grid gap-4">
                {templates.slice(0, 5).map((template: any) => (
                  <Card key={template.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{template.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {(template.price / 100).toLocaleString('pl-PL', {
                              style: 'currency',
                              currency: 'PLN'
                            })} | Ocena: {template.rating / 10}/5
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {template.featured && (
                            <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 text-xs px-2 py-1 rounded">
                              Wyróżniony
                            </span>
                          )}
                          {template.isBestseller && (
                            <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 text-xs px-2 py-1 rounded">
                              Bestseller
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="recent-case-studies" className="space-y-4">
              <div className="grid gap-4">
                {caseStudies.slice(0, 5).map((study: any) => (
                  <Card key={study.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{study.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-1">
                            {study.tools?.map((tool: string, i: number) => (
                              <span key={i} className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs">
                                {tool}
                              </span>
                            ))}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {study.featured && (
                            <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 text-xs px-2 py-1 rounded">
                              Wyróżniony
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}