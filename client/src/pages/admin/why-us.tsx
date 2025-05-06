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
import { insertWhyUsItemSchema, type WhyUsItem } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminLayout from "@/components/admin/admin-layout";
import ProtectedRoute from "@/components/admin/protected-route";

// Rozszerzamy schemat o walidację
const formSchema = insertWhyUsItemSchema.extend({
  icon: z.string().min(1, { message: "Ikona jest wymagana" }),
  title: z.string().min(3, { message: "Tytuł musi mieć co najmniej 3 znaki" }),
  description: z.string().min(10, { message: "Opis musi mieć co najmniej 10 znaków" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminWhyUsPage() {
  const { t, i18n } = useTranslation('common');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language.substring(0, 2));

  // Pobieranie danych
  const { data: items, isLoading } = useQuery<WhyUsItem[]>({
    queryKey: ["/api/why-us", selectedLanguage],
    queryFn: async ({ queryKey }) => {
      const [endpoint, language] = queryKey;
      const response = await fetch(`${endpoint}?lang=${language}`);
      if (!response.ok) {
        throw new Error("Nie udało się pobrać elementów");
      }
      return response.json();
    },
  });

  // Domyślne wartości dla formularza
  const defaultValues: FormValues = {
    title: "",
    description: "",
    icon: "",
    order: 0,
    language: selectedLanguage,
  };

  // Inicjalizacja formularza
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Mutacje
  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const res = await apiRequest("POST", "/api/why-us", values);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Sukces",
        description: "Element został dodany",
      });
      form.reset(defaultValues);
      queryClient.invalidateQueries({ queryKey: ["/api/why-us", selectedLanguage] });
    },
    onError: (error: Error) => {
      toast({
        title: "Błąd",
        description: `Nie udało się dodać elementu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, values }: { id: number; values: FormValues }) => {
      const res = await apiRequest("PUT", `/api/why-us/${id}`, values);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Sukces",
        description: "Element został zaktualizowany",
      });
      setEditingId(null);
      form.reset(defaultValues);
      queryClient.invalidateQueries({ queryKey: ["/api/why-us", selectedLanguage] });
    },
    onError: (error: Error) => {
      toast({
        title: "Błąd",
        description: `Nie udało się zaktualizować elementu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/why-us/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Sukces",
        description: "Element został usunięty",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/why-us", selectedLanguage] });
    },
    onError: (error: Error) => {
      toast({
        title: "Błąd",
        description: `Nie udało się usunąć elementu: ${error.message}`,
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

  const handleEdit = (item: WhyUsItem) => {
    setEditingId(item.id);
    form.reset({
      title: item.title,
      description: item.description,
      icon: item.icon,
      order: item.order,
      language: item.language,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    form.reset(defaultValues);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten element?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    if (editingId === null) {
      form.setValue("language", language);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Zarządzanie sekcją "Dlaczego my"</h1>
          
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">Język:</label>
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Wybierz język" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pl">Polski</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="ko">한국어</SelectItem>
              </SelectContent>
            </Select>
          </div>
      
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingId !== null ? "Edytuj element" : "Dodaj nowy element"}</CardTitle>
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
                          <Input placeholder="Wprowadź tytuł" {...field} />
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
                          <Textarea placeholder="Wprowadź opis" {...field} rows={5} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ikona (SVG)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Wprowadź kod SVG ikony" 
                            {...field} 
                            rows={5} 
                            className="font-mono text-xs"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kolejność</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Wprowadź kolejność" 
                            {...field} 
                            value={field.value}
                            onChange={(e) => field.onChange(parseInt(e.target.value))} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <input type="hidden" {...form.register("language")} />
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
                    {editingId !== null ? "Zapisz zmiany" : "Dodaj element"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
          
          <h2 className="text-xl font-bold mb-4">Istniejące elementy</h2>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : items && items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-primary text-3xl" dangerouslySetInnerHTML={{ __html: item.icon }} />
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                      </div>
                      <div className="text-sm text-muted-foreground">#{item.order}</div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm">{item.description}</p>
                  </CardContent>
                  
                  <CardFooter className="flex justify-end space-x-2 bg-muted/50">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(item)}
                      disabled={deleteMutation.isPending}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete(item.id)}
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
              Brak elementów. Dodaj pierwszy element używając formularza powyżej.
            </p>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}