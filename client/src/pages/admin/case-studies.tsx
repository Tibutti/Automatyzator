import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { insertCaseStudySchema, type CaseStudy } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import AdminLayout from "@/components/admin/admin-layout";
import ProtectedRoute from "@/components/admin/protected-route";

// Rozszerzamy schemat o walidację
const formSchema = insertCaseStudySchema.extend({
  title: z.string().min(3, { message: "Tytuł musi mieć co najmniej 3 znaki" }),
  description: z.string().min(10, { message: "Opis musi mieć co najmniej 10 znaków" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminCaseStudiesPage() {
  const { t, i18n } = useTranslation('common');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);

  // Pobieranie danych
  const { data: caseStudies, isLoading } = useQuery<CaseStudy[]>({
    queryKey: ["/api/case-studies"],
    queryFn: async () => {
      const response = await fetch("/api/case-studies");
      if (!response.ok) {
        throw new Error("Nie udało się pobrać case studies");
      }
      return response.json();
    },
  });

  // Domyślne wartości dla formularza
  const defaultValues: Partial<FormValues> = {
    title: "",
    description: "",
    slug: "",
    imageUrl: "",
    featured: false,
    tools: [],
    tags: [],
  };

  // Inicjalizacja formularza
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues as FormValues,
  });

  // Mutacje
  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      return apiRequest<CaseStudy>("POST", "/api/case-studies", values);
    },
    onSuccess: () => {
      toast({
        title: "Sukces",
        description: "Case study zostało dodane",
      });
      form.reset(defaultValues as FormValues);
      queryClient.invalidateQueries({ queryKey: ["/api/case-studies"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Błąd",
        description: `Nie udało się dodać case study: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, values }: { id: number; values: FormValues }) => {
      return apiRequest<CaseStudy>("PUT", `/api/case-studies/${id}`, values);
    },
    onSuccess: () => {
      toast({
        title: "Sukces",
        description: "Case study zostało zaktualizowane",
      });
      setEditingId(null);
      form.reset(defaultValues as FormValues);
      queryClient.invalidateQueries({ queryKey: ["/api/case-studies"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Błąd",
        description: `Nie udało się zaktualizować case study: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/case-studies/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Sukces",
        description: "Case study zostało usunięte",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/case-studies"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Błąd",
        description: `Nie udało się usunąć case study: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Obsługa formularza
  const onSubmit = (values: FormValues) => {
    if (editingId !== null) {
      updateMutation.mutate({ id: editingId, values });
    } else {
      createMutation.mutate(values);
    }
  };

  const handleEdit = (caseStudy: CaseStudy) => {
    setEditingId(caseStudy.id);
    form.reset({
      title: caseStudy.title,
      description: caseStudy.description,
      slug: caseStudy.slug,
      imageUrl: caseStudy.imageUrl || "",
      featured: caseStudy.featured || false,
      tools: caseStudy.tools || [],
      tags: caseStudy.tags || [],
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    form.reset(defaultValues as FormValues);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Czy na pewno chcesz usunąć to case study?")) {
      deleteMutation.mutate(id);
    }
  };

  const generateSlug = () => {
    const title = form.getValues("title");
    if (!title) return;
    const slug = title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
    form.setValue("slug", slug);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Obsługa narzędzi i tagów
  const [newTool, setNewTool] = useState("");
  const [newTag, setNewTag] = useState("");

  const handleAddTool = () => {
    if (!newTool.trim()) return;
    const currentTools = form.getValues("tools") || [];
    form.setValue("tools", [...currentTools, newTool.trim()]);
    setNewTool("");
  };

  const handleRemoveTool = (index: number) => {
    const currentTools = form.getValues("tools") || [];
    form.setValue("tools", currentTools.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    const currentTags = form.getValues("tags") || [];
    form.setValue("tags", [...currentTags, newTag.trim()]);
    setNewTag("");
  };

  const handleRemoveTag = (index: number) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue("tags", currentTags.filter((_, i) => i !== index));
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Zarządzanie case studies</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingId !== null ? "Edytuj case study" : "Dodaj nowe case study"}</CardTitle>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tytuł</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Wprowadź tytuł case study" 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e);
                              if (!editingId) {
                                generateSlug();
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug (URL)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="automatycznie-generowany-slug" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opis</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Wprowadź opis case study" 
                            {...field} 
                            rows={5}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL obrazka</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://..." 
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={Boolean(field.value)}
                            onCheckedChange={(checked) => field.onChange(checked || false)}
                          />
                        </FormControl>
                        <FormLabel>Wyróżnione</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <FormLabel>Narzędzia użyte w projekcie</FormLabel>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {form.watch("tools")?.map((tool, index) => (
                        <div key={index} className="flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded-full text-sm">
                          {tool}
                          <button
                            type="button"
                            className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                            onClick={() => handleRemoveTool(index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        value={newTool}
                        onChange={(e) => setNewTool(e.target.value)}
                        placeholder="Dodaj narzędzie"
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTool();
                          }
                        }}
                      />
                      <Button type="button" variant="outline" onClick={handleAddTool}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <FormLabel>Tagi</FormLabel>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {form.watch("tags")?.map((tag, index) => (
                        <div key={index} className="flex items-center bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-sm">
                          {tag}
                          <button
                            type="button"
                            className="ml-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                            onClick={() => handleRemoveTag(index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Dodaj tag"
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                      />
                      <Button type="button" variant="outline" onClick={handleAddTag}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  {editingId !== null && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCancelEdit}
                      disabled={isSubmitting}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Anuluj
                    </Button>
                  )}
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={editingId === null ? "ml-auto" : ""}
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : editingId !== null ? (
                      <Save className="mr-2 h-4 w-4" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    {editingId !== null ? "Zapisz zmiany" : "Dodaj case study"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
          
          <h2 className="text-xl font-bold mb-4">Istniejące case studies</h2>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : caseStudies && caseStudies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {caseStudies.map((caseStudy) => (
                <Card key={caseStudy.id} className="overflow-hidden">
                  <CardHeader className="pb-0">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{caseStudy.title}</CardTitle>
                      {caseStudy.featured && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded-full text-xs">
                          Wyróżnione
                        </span>
                      )}
                    </div>
                    {caseStudy.imageUrl && (
                      <div className="mt-2 aspect-video rounded-md overflow-hidden">
                        <img src={caseStudy.imageUrl} alt={caseStudy.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent className="pt-4">
                    <p className="text-sm line-clamp-3">{caseStudy.description}</p>
                    
                    {(caseStudy.tools && caseStudy.tools.length > 0) && (
                      <div className="mt-3">
                        <h4 className="text-xs font-medium text-muted-foreground mb-1">Narzędzia:</h4>
                        <div className="flex flex-wrap gap-1">
                          {caseStudy.tools.map((tool, index) => (
                            <span key={index} className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded-full text-xs">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {(caseStudy.tags && caseStudy.tags.length > 0) && (
                      <div className="mt-3">
                        <h4 className="text-xs font-medium text-muted-foreground mb-1">Tagi:</h4>
                        <div className="flex flex-wrap gap-1">
                          {caseStudy.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="flex justify-end space-x-2 bg-muted/50">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(caseStudy)}
                      disabled={deleteMutation.isPending}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete(caseStudy.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              Brak case studies. Dodaj pierwsze case study używając formularza powyżej.
            </p>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}