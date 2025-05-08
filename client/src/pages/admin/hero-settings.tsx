import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import type { HeroSetting as HeroSettingType } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import AdminLayout from "@/components/admin/admin-layout";
import ProtectedRoute from "@/components/admin/protected-route";
import { Loader2, Globe, Settings, PenIcon, Check, X, ChevronDown, ChevronRight, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { HeroSetting } from "@shared/schema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mapowanie kluczy stron na nazwy przyjazne dla użytkownika
const PAGE_KEY_TO_NAME: Record<string, string> = {
  "home": "Strona główna",
  "services": "Usługi",
  "why-us": "Dlaczego my",
  "blog": "Blog",
  "trainings": "Szkolenia",
  "templates": "Szablony",
  "case-studies": "Case Studies",
  "shop": "Sklep",
  "contact": "Kontakt",
  "consultation": "Konsultacje"
};

// Schemat formularza
const heroFormSchema = z.object({
  id: z.number().optional(),
  pageKey: z.string(),
  title: z.string().min(1, "Tytuł jest wymagany"),
  subtitle: z.string().min(1, "Podtytuł jest wymagany"),
  description: z.string().min(1, "Opis jest wymagany"),
  primaryButtonText: z.string().nullable(),
  primaryButtonUrl: z.string().nullable(),
  secondaryButtonText: z.string().nullable(),
  secondaryButtonUrl: z.string().nullable(),
  imageUrl: z.string().nullable(),
  isEnabled: z.boolean().default(true)
});

type HeroFormValues = z.infer<typeof heroFormSchema>;

export default function HeroSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Pobierz wszystkie ustawienia hero
  const { data: heroSettings, isLoading, error } = useQuery<HeroSetting[]>({
    queryKey: ["/api/hero-settings"],
  });
  
  // Obsługa błędów
  useEffect(() => {
    if (error) {
      toast({
        title: "Błąd ładowania ustawień Hero",
        description: error instanceof Error ? error.message : "Wystąpił nieznany błąd",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Przygotuj formularz
  const form = useForm<HeroFormValues>({
    resolver: zodResolver(heroFormSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      primaryButtonText: "",
      primaryButtonUrl: "",
      secondaryButtonText: "",
      secondaryButtonUrl: "",
      imageUrl: "",
      isEnabled: true
    }
  });

  // Mutacja do aktualizacji ustawień
  const updateMutation = useMutation({
    mutationFn: async (values: HeroFormValues) => {
      const id = values.id;
      if (id) {
        // Aktualizacja istniejącego
        const response = await apiRequest("PUT", `/api/hero-settings/${id}`, values);
        return response;
      } else {
        // Tworzenie nowego
        const response = await apiRequest("POST", "/api/hero-settings", values);
        return response;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hero-settings"] });
      toast({
        title: "Sukces",
        description: "Ustawienia Hero zostały zapisane",
      });
      setIsDialogOpen(false);
      setEditingId(null);
    },
    onError: (error) => {
      toast({
        title: "Błąd zapisywania",
        description: error instanceof Error ? error.message : "Wystąpił nieznany błąd",
        variant: "destructive",
      });
    },
  });

  // Mutacja do przełączania widoczności
  const toggleVisibilityMutation = useMutation({
    mutationFn: async (heroSetting: HeroSetting) => {
      const updatedSetting = {
        ...heroSetting,
        isEnabled: !heroSetting.isEnabled
      };
      const response = await apiRequest("PUT", `/api/hero-settings/${heroSetting.id}`, updatedSetting);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hero-settings"] });
    },
    onError: (error) => {
      toast({
        title: "Błąd przełączania widoczności",
        description: error instanceof Error ? error.message : "Wystąpił nieznany błąd",
        variant: "destructive",
      });
    },
  });

  // Funkcja obsługująca edycję
  const handleEdit = (heroSetting: HeroSetting) => {
    form.reset({
      id: heroSetting.id,
      pageKey: heroSetting.pageKey,
      title: heroSetting.title,
      subtitle: heroSetting.subtitle,
      description: heroSetting.description,
      primaryButtonText: heroSetting.primaryButtonText,
      primaryButtonUrl: heroSetting.primaryButtonUrl,
      secondaryButtonText: heroSetting.secondaryButtonText,
      secondaryButtonUrl: heroSetting.secondaryButtonUrl,
      imageUrl: heroSetting.imageUrl,
      isEnabled: heroSetting.isEnabled
    });
    setEditingId(heroSetting.id);
    setIsDialogOpen(true);
  };

  // Obsługa przełączania widoczności
  const handleToggleVisibility = (heroSetting: HeroSetting) => {
    toggleVisibilityMutation.mutate(heroSetting);
  };

  // Obsługa wysyłania formularza
  const onSubmit = (values: HeroFormValues) => {
    updateMutation.mutate(values);
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Ustawienia sekcji Hero</h1>
            <Settings className="h-6 w-6" />
          </div>
          
          <p className="text-muted-foreground">
            Zarządzaj ustawieniami sekcji Hero dla różnych stron. Możesz edytować treści, przyciski oraz widoczność.
          </p>
          
          <Separator />
          
          <div className="flex justify-between mb-4">
            <Button 
              onClick={() => {
                form.reset({
                  pageKey: "home",
                  title: "",
                  subtitle: "",
                  description: "",
                  primaryButtonText: "",
                  primaryButtonUrl: "",
                  secondaryButtonText: "",
                  secondaryButtonUrl: "",
                  imageUrl: "",
                  isEnabled: true
                });
                setEditingId(null);
                setIsDialogOpen(true);
              }}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Dodaj nowe ustawienia
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !Array.isArray(heroSettings) || heroSettings.length === 0 ? (
            <div className="text-center p-8 border rounded-lg">
              <h3 className="text-lg font-medium mb-2">Brak ustawień sekcji Hero</h3>
              <p className="text-muted-foreground mb-4">
                Dodaj ustawienia dla sekcji Hero dla różnych stron, aby kontrolować ich wygląd.
              </p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {heroSettings.map((heroSetting) => (
                <AccordionItem key={heroSetting.id} value={heroSetting.id.toString()}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-1 rounded-full ${heroSetting.isEnabled ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {heroSetting.isEnabled ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                        </div>
                        <div>
                          <span className="font-medium">{PAGE_KEY_TO_NAME[heroSetting.pageKey] || heroSetting.pageKey}</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            {format(new Date(heroSetting.updatedAt), "dd.MM.yyyy HH:mm", { locale: pl })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(heroSetting);
                          }}
                        >
                          <PenIcon className="h-4 w-4 mr-1" />
                          Edytuj
                        </Button>
                        <Switch 
                          checked={heroSetting.isEnabled}
                          onCheckedChange={() => {
                            handleToggleVisibility(heroSetting);
                          }}
                          onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card className="border-0 shadow-none">
                      <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold mb-2">Treści</h3>
                          <div className="space-y-2">
                            <div>
                              <Label className="text-xs text-muted-foreground">Tytuł</Label>
                              <p>{heroSetting.title}</p>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Podtytuł</Label>
                              <p>{heroSetting.subtitle}</p>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Opis</Label>
                              <p className="text-sm">{heroSetting.description}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Przyciski i obraz</h3>
                          <div className="space-y-2">
                            <div>
                              <Label className="text-xs text-muted-foreground">Pierwszy przycisk</Label>
                              <p>{heroSetting.primaryButtonText} → {heroSetting.primaryButtonUrl}</p>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Drugi przycisk</Label>
                              <p>{heroSetting.secondaryButtonText ? `${heroSetting.secondaryButtonText} → ${heroSetting.secondaryButtonUrl}` : 'Brak'}</p>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Obraz</Label>
                              <p className="text-sm break-all">{heroSetting.imageUrl}</p>
                              {heroSetting.imageUrl && (
                                <div className="mt-2 relative w-40 h-24 rounded overflow-hidden">
                                  <img 
                                    src={heroSetting.imageUrl} 
                                    alt={heroSetting.title}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        {/* Dialog do edycji */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Edytuj ustawienia Hero" : "Dodaj nowe ustawienia Hero"}
                </DialogTitle>
                <DialogDescription>
                  Wypełnij poniższy formularz, aby dostosować sekcję Hero dla wybranej strony.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="pageKey">Strona</Label>
                  <select 
                    id="pageKey" 
                    {...form.register("pageKey")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    {Object.entries(PAGE_KEY_TO_NAME).map(([key, name]) => (
                      <option key={key} value={key}>{name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="title">Tytuł</Label>
                  <Input 
                    id="title" 
                    {...form.register("title")} 
                    className={form.formState.errors.title ? "border-red-500" : ""}
                  />
                  {form.formState.errors.title && (
                    <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="subtitle">Podtytuł</Label>
                  <Input 
                    id="subtitle" 
                    {...form.register("subtitle")} 
                    className={form.formState.errors.subtitle ? "border-red-500" : ""}
                  />
                  {form.formState.errors.subtitle && (
                    <p className="text-red-500 text-sm">{form.formState.errors.subtitle.message}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Opis</Label>
                  <Textarea 
                    id="description" 
                    {...form.register("description")} 
                    className={form.formState.errors.description ? "border-red-500" : ""}
                    rows={3}
                  />
                  {form.formState.errors.description && (
                    <p className="text-red-500 text-sm">{form.formState.errors.description.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="primaryButtonText">Tekst pierwszego przycisku</Label>
                    <Input id="primaryButtonText" {...form.register("primaryButtonText")} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="primaryButtonUrl">URL pierwszego przycisku</Label>
                    <Input id="primaryButtonUrl" {...form.register("primaryButtonUrl")} />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="secondaryButtonText">Tekst drugiego przycisku</Label>
                    <Input id="secondaryButtonText" {...form.register("secondaryButtonText")} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="secondaryButtonUrl">URL drugiego przycisku</Label>
                    <Input id="secondaryButtonUrl" {...form.register("secondaryButtonUrl")} />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="imageUrl">URL obrazu</Label>
                  <Input id="imageUrl" {...form.register("imageUrl")} />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="isEnabled"
                    checked={form.watch("isEnabled")}
                    onCheckedChange={(checked) => form.setValue("isEnabled", checked)}
                  />
                  <Label htmlFor="isEnabled">Aktywna</Label>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Anuluj
                </Button>
                <Button 
                  type="submit"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Zapisz
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </ProtectedRoute>
  );
}