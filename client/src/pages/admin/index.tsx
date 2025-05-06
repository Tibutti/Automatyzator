import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, LogOut, Plus, Trash } from "lucide-react";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { pl } from "date-fns/locale";
import { useAuth } from "@/lib/auth-context";
import AdminLayout from "@/components/admin/admin-layout";
import ProtectedRoute from "@/components/admin/protected-route";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("blog");
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();

  // Fetch blog posts
  const { data: blogPosts, isLoading: isBlogPostsLoading } = useQuery({
    queryKey: ["/api/blog-posts"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/blog-posts");
      if (!res.ok) {
        throw new Error("Failed to fetch blog posts");
      }
      return res.json();
    },
  });

  // Fetch templates
  const { data: templates, isLoading: isTemplatesLoading } = useQuery({
    queryKey: ["/api/templates"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/templates");
      if (!res.ok) {
        throw new Error("Failed to fetch templates");
      }
      return res.json();
    },
  });

  // Fetch case studies
  const { data: caseStudies, isLoading: isCaseStudiesLoading } = useQuery({
    queryKey: ["/api/case-studies"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/case-studies");
      if (!res.ok) {
        throw new Error("Failed to fetch case studies");
      }
      return res.json();
    },
  });

  // Fetch contact messages
  const { data: messages, isLoading: isMessagesLoading } = useQuery({
    queryKey: ["/api/contact-messages"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/contact-messages");
      if (!res.ok) {
        throw new Error("Failed to fetch contact messages");
      }
      return res.json();
    },
  });

  // Fetch newsletter subscribers
  const { data: subscribers, isLoading: isSubscribersLoading } = useQuery({
    queryKey: ["/api/newsletter-subscribers"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/newsletter-subscribers");
      if (!res.ok) {
        throw new Error("Failed to fetch newsletter subscribers");
      }
      return res.json();
    },
  });

  // Delete blog post handler
  const handleDeleteBlogPost = async (id: number) => {
    if (!confirm("Czy na pewno chcesz usunąć ten post?")) {
      return;
    }
    
    try {
      const res = await apiRequest("DELETE", `/api/blog-posts/${id}`);
      if (!res.ok) {
        throw new Error("Failed to delete blog post");
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      toast({
        title: "Sukces",
        description: "Post został usunięty",
      });
    } catch (error) {
      toast({
        title: "Błąd",
        description: error instanceof Error ? error.message : "Wystąpił błąd podczas usuwania postu",
        variant: "destructive",
      });
    }
  };

  // Delete template handler
  const handleDeleteTemplate = async (id: number) => {
    if (!confirm("Czy na pewno chcesz usunąć ten szablon?")) {
      return;
    }
    
    try {
      const res = await apiRequest("DELETE", `/api/templates/${id}`);
      if (!res.ok) {
        throw new Error("Failed to delete template");
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({
        title: "Sukces",
        description: "Szablon został usunięty",
      });
    } catch (error) {
      toast({
        title: "Błąd",
        description: error instanceof Error ? error.message : "Wystąpił błąd podczas usuwania szablonu",
        variant: "destructive",
      });
    }
  };

  // Delete case study handler
  const handleDeleteCaseStudy = async (id: number) => {
    if (!confirm("Czy na pewno chcesz usunąć to case study?")) {
      return;
    }
    
    try {
      const res = await apiRequest("DELETE", `/api/case-studies/${id}`);
      if (!res.ok) {
        throw new Error("Failed to delete case study");
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/case-studies"] });
      toast({
        title: "Sukces",
        description: "Case study zostało usunięte",
      });
    } catch (error) {
      toast({
        title: "Błąd",
        description: error instanceof Error ? error.message : "Wystąpił błąd podczas usuwania case study",
        variant: "destructive",
      });
    }
  };

  // Delete contact message handler
  const handleDeleteMessage = async (id: number) => {
    if (!confirm("Czy na pewno chcesz usunąć tę wiadomość?")) {
      return;
    }
    
    try {
      const res = await apiRequest("DELETE", `/api/contact-messages/${id}`);
      if (!res.ok) {
        throw new Error("Failed to delete message");
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/contact-messages"] });
      toast({
        title: "Sukces",
        description: "Wiadomość została usunięta",
      });
    } catch (error) {
      toast({
        title: "Błąd",
        description: error instanceof Error ? error.message : "Wystąpił błąd podczas usuwania wiadomości",
        variant: "destructive",
      });
    }
  };

  // Delete subscriber handler
  const handleDeleteSubscriber = async (id: number) => {
    if (!confirm("Czy na pewno chcesz usunąć tego subskrybenta?")) {
      return;
    }
    
    try {
      const res = await apiRequest("DELETE", `/api/newsletter-subscribers/${id}`);
      if (!res.ok) {
        throw new Error("Failed to delete subscriber");
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/newsletter-subscribers"] });
      toast({
        title: "Sukces",
        description: "Subskrybent został usunięty",
      });
    } catch (error) {
      toast({
        title: "Błąd",
        description: error instanceof Error ? error.message : "Wystąpił błąd podczas usuwania subskrybenta",
        variant: "destructive",
      });
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Panel administracyjny</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="blog">Blog</TabsTrigger>
              <TabsTrigger value="templates">Szablony</TabsTrigger>
              <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
              <TabsTrigger value="messages">Wiadomości</TabsTrigger>
              <TabsTrigger value="subscribers">Subskrybenci</TabsTrigger>
              <TabsTrigger value="whyUs" onClick={() => setLocation("/admin/why-us")}>Dlaczego my</TabsTrigger>
              <TabsTrigger value="services" onClick={() => setLocation("/admin/services")}>Usługi</TabsTrigger>
            </TabsList>
            
            {/* Blog Posts Tab */}
            <TabsContent value="blog">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Posty na blogu</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Dodaj post
                  </Button>
                </CardHeader>
                <CardContent>
                  {isBlogPostsLoading ? (
                    <div className="flex justify-center p-4">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tytuł</TableHead>
                          <TableHead>Kategoria</TableHead>
                          <TableHead>Autor</TableHead>
                          <TableHead>Data publikacji</TableHead>
                          <TableHead>Wyróżniony</TableHead>
                          <TableHead>Akcje</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {blogPosts?.map((post: any) => (
                          <TableRow key={post.id}>
                            <TableCell className="font-medium">{post.title}</TableCell>
                            <TableCell>{post.category}</TableCell>
                            <TableCell>{post.author}</TableCell>
                            <TableCell>
                              {post.publishedAt ? format(new Date(post.publishedAt), "dd MMM yyyy", { locale: pl }) : "Brak daty"}
                            </TableCell>
                            <TableCell>{post.featured ? "Tak" : "Nie"}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                  Edytuj
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm" 
                                  onClick={() => handleDeleteBlogPost(post.id)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Templates Tab */}
            <TabsContent value="templates">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Szablony</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Dodaj szablon
                  </Button>
                </CardHeader>
                <CardContent>
                  {isTemplatesLoading ? (
                    <div className="flex justify-center p-4">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tytuł</TableHead>
                          <TableHead>Cena</TableHead>
                          <TableHead>Ocena</TableHead>
                          <TableHead>Recenzje</TableHead>
                          <TableHead>Bestseller</TableHead>
                          <TableHead>Akcje</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {templates?.map((template: any) => (
                          <TableRow key={template.id}>
                            <TableCell className="font-medium">{template.title}</TableCell>
                            <TableCell>{(template.price / 100).toFixed(2)} zł</TableCell>
                            <TableCell>{template.rating}/50</TableCell>
                            <TableCell>{template.reviewCount}</TableCell>
                            <TableCell>{template.isBestseller ? "Tak" : "Nie"}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                  Edytuj
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleDeleteTemplate(template.id)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Case Studies Tab */}
            <TabsContent value="case-studies">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Case Studies</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Dodaj case study
                  </Button>
                </CardHeader>
                <CardContent>
                  {isCaseStudiesLoading ? (
                    <div className="flex justify-center p-4">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tytuł</TableHead>
                          <TableHead>Narzędzia</TableHead>
                          <TableHead>Tagi</TableHead>
                          <TableHead>Wyróżniony</TableHead>
                          <TableHead>Akcje</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {caseStudies?.map((study: any) => (
                          <TableRow key={study.id}>
                            <TableCell className="font-medium">{study.title}</TableCell>
                            <TableCell>{study.tools?.join(", ") || "Brak"}</TableCell>
                            <TableCell>{study.tags?.join(", ") || "Brak"}</TableCell>
                            <TableCell>{study.featured ? "Tak" : "Nie"}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                  Edytuj
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleDeleteCaseStudy(study.id)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Messages Tab */}
            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Wiadomości kontaktowe</CardTitle>
                </CardHeader>
                <CardContent>
                  {isMessagesLoading ? (
                    <div className="flex justify-center p-4">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Imię i nazwisko</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Firma</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Wiadomość</TableHead>
                          <TableHead>Akcje</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {messages?.map((message: any) => (
                          <TableRow key={message.id}>
                            <TableCell className="font-medium">{message.name}</TableCell>
                            <TableCell>{message.email}</TableCell>
                            <TableCell>{message.company || "Brak"}</TableCell>
                            <TableCell>
                              {message.createdAt ? format(new Date(message.createdAt), "dd MMM yyyy", { locale: pl }) : "Brak daty"}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{message.message}</TableCell>
                            <TableCell>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteMessage(message.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Subscribers Tab */}
            <TabsContent value="subscribers">
              <Card>
                <CardHeader>
                  <CardTitle>Subskrybenci newslettera</CardTitle>
                </CardHeader>
                <CardContent>
                  {isSubscribersLoading ? (
                    <div className="flex justify-center p-4">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Data zapisu</TableHead>
                          <TableHead>Akcje</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subscribers?.map((subscriber: any) => (
                          <TableRow key={subscriber.id}>
                            <TableCell className="font-medium">{subscriber.email}</TableCell>
                            <TableCell>
                              {subscriber.subscribedAt ? format(new Date(subscriber.subscribedAt), "dd MMM yyyy", { locale: pl }) : "Brak daty"}
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteSubscriber(subscriber.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}