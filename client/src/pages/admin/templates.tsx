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
import { insertTemplateSchema, type Template } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import AdminLayout from "@/components/admin/admin-layout";
import ProtectedRoute from "@/components/admin/protected-route";

// Rozszerzamy schemat o walidację
const formSchema = insertTemplateSchema.extend({
  title: z.string().min(3, { message: "Tytuł musi mieć co najmniej 3 znaki" }),
  description: z.string().min(10, { message: "Opis musi mieć co najmniej 10 znaków" }),
  price: z.number().min(0, { message: "Cena nie może być ujemna" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminTemplatesPage() {
  const { t, i18n } = useTranslation('common');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);

  // Pobieranie danych
  const { data: templates, isLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
    queryFn: async () => {
      const response = await fetch(`/api/templates`);
      if (!response.ok) {
        throw new Error("Nie udało się pobrać szablonów");
      }
      return response.json();
    },
  });

  // Domyślne wartości dla formularza
  const defaultValues: Partial<FormValues> = {
    title: "",
    description: "",
    slug: "",
    price: 0,
    rating: 0,
    reviewCount: 0,
    imageUrl: "",
    featured: false,
    isBestseller: false,
  };

  // Inicjalizacja formularza
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues as FormValues,
  });

  // Mutacje
  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const res = await apiRequest("POST", "/api/templates", values);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Sukces",
        description: "Szablon został dodany",
      });
      form.reset(defaultValues as FormValues);
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Błąd",
        description: `Nie udało się dodać szablonu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, values }: { id: number; values: FormValues }) => {
      const res = await apiRequest("PUT", `/api/templates/${id}`, values);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Sukces",
        description: "Szablon został zaktualizowany",
      });
      setEditingId(null);
      form.reset(defaultValues as FormValues);
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Błąd",
        description: `Nie udało się zaktualizować szablonu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/templates/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Sukces",
        description: "Szablon został usunięty",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Błąd",
        description: `Nie udało się usunąć szablonu: ${error.message}`,
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

  const handleEdit = (template: Template) => {
    setEditingId(template.id);
    form.reset({
      title: template.title,
      description: template.description,
      slug: template.slug,
      price: template.price,
      rating: template.rating,
      reviewCount: template.reviewCount,
      imageUrl: template.imageUrl || "",
      featured: template.featured || false,
      isBestseller: template.isBestseller || false,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    form.reset(defaultValues as FormValues);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten szablon?")) {
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

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Zarządzanie szablonami</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingId !== null ? "Edytuj szablon" : "Dodaj nowy szablon"}</CardTitle>
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
                            placeholder="Wprowadź tytuł szablonu" 
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
                            placeholder="Wprowadź opis szablonu" 
                            {...field} 
                            rows={5}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cena (w groszach)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Wprowadź cenę" 
                              {...field} 
                              value={field.value || 0}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
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
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ocena (0-5)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Wprowadź ocenę" 
                              {...field} 
                              value={field.value || 0}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                              min={0}
                              max={5}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="reviewCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Liczba opinii</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Wprowadź liczbę opinii" 
                              {...field} 
                              value={field.value || 0}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                              min={0}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Wyróżniony</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="isBestseller"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Bestseller</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                    {editingId !== null ? "Zapisz zmiany" : "Dodaj szablon"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
          
          <h2 className="text-xl font-bold mb-4">Istniejące szablony</h2>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : templates && templates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <Card key={template.id} className="overflow-hidden">
                  <CardHeader className="pb-0">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                      <div className="text-sm font-medium text-green-600 dark:text-green-500">
                        {(template.price / 100).toFixed(2)} zł
                      </div>
                    </div>
                    {template.imageUrl && (
                      <div className="mt-2 aspect-video rounded-md overflow-hidden">
                        <img src={template.imageUrl} alt={template.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent className="pt-4">
                    <p className="text-sm line-clamp-3">{template.description}</p>
                    <div className="flex justify-between mt-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <span>⭐ {template.rating}/5</span>
                        <span className="ml-2">({template.reviewCount} opinii)</span>
                      </div>
                      <div className="flex space-x-2">
                        {template.featured && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded-full text-xs">
                            Wyróżniony
                          </span>
                        )}
                        {template.isBestseller && (
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 rounded-full text-xs">
                            Bestseller
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-end space-x-2 bg-muted/50">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(template)}
                      disabled={deleteMutation.isPending}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete(template.id)}
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
              Brak szablonów. Dodaj pierwszy szablon używając formularza powyżej.
            </p>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}