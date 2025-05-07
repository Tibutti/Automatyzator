import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AdminLayout from "@/components/admin/admin-layout";
import ProtectedRoute from "@/components/admin/protected-route";

const formSchema = z.object({
  calendlyUrl: z.string().url("Wprowadź poprawny adres URL").min(1, "URL jest wymagany"),
});

interface ConsultationSettings {
  calendlyUrl: string;
}

export default function ConsultationSettingsPage() {
  return (
    <ProtectedRoute>
      <ConsultationSettingsContent />
    </ProtectedRoute>
  );
}

function ConsultationSettingsContent() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const { data: sectionSettings, isLoading } = useQuery({
    queryKey: ["/api/section-settings"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/section-settings");
      if (!res.ok) {
        throw new Error("Failed to fetch section settings");
      }
      return res.json();
    },
  });

  const form = useForm<ConsultationSettings>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      calendlyUrl: "https://calendly.com/automatyzator/konsultacja",
    },
  });

  useEffect(() => {
    if (sectionSettings) {
      const consultationSettings = sectionSettings.find(
        (s: any) => s.sectionKey === "consultation"
      );
      if (consultationSettings && consultationSettings.metadata) {
        try {
          const metadata = JSON.parse(consultationSettings.metadata);
          if (metadata.calendlyUrl) {
            form.setValue("calendlyUrl", metadata.calendlyUrl);
          }
        } catch (e) {
          console.error("Błąd parsowania metadanych konsultacji:", e);
        }
      }
    }
  }, [sectionSettings, form]);

  const onSubmit = async (data: ConsultationSettings) => {
    setIsSaving(true);
    try {
      const consultationSettings = sectionSettings.find(
        (s: any) => s.sectionKey === "consultation"
      );
      
      if (!consultationSettings) {
        toast({
          title: "Błąd",
          description: "Nie znaleziono ustawień sekcji konsultacji",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }

      const metadata = JSON.stringify({ calendlyUrl: data.calendlyUrl });
      
      const res = await apiRequest(
        "PUT",
        `/api/section-settings/${consultationSettings.id}`,
        {
          ...consultationSettings,
          metadata,
        }
      );

      if (!res.ok) {
        throw new Error("Nie udało się zapisać ustawień");
      }

      toast({
        title: "Sukces",
        description: "Ustawienia konsultacji zostały zapisane",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/section-settings"] });
    } catch (error) {
      toast({
        title: "Błąd",
        description: error.message || "Wystąpił błąd podczas zapisywania ustawień",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Ustawienia konsultacji">
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Ustawienia konsultacji">
      <Card>
        <CardHeader>
          <CardTitle>Konfiguracja Calendly</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="calendlyUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adres URL Calendly</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://calendly.com/twoj-login/konsultacja"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Zapisz ustawienia
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}