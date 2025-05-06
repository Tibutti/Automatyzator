import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, Settings } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import AdminLayout from "@/components/admin/admin-layout";
import ProtectedRoute from "@/components/admin/protected-route";

interface SectionSetting {
  id: number;
  sectionKey: string;
  displayName: string;
  isEnabled: boolean;
  order: number;
  updatedAt: Date;
}

export default function SectionSettingsPage() {
  const { toast } = useToast();

  // Fetch section settings
  const {
    data: sectionSettings,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["/api/section-settings"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/section-settings");
      if (!res.ok) {
        throw new Error("Failed to fetch section settings");
      }
      return res.json();
    },
  });

  const handleToggleSection = async (setting: SectionSetting) => {
    try {
      const newValue = !setting.isEnabled;
      
      const res = await apiRequest(
        "PUT", 
        `/api/section-settings/${setting.id}`,
        { isEnabled: newValue }
      );
      
      if (!res.ok) {
        throw new Error("Failed to update section setting");
      }
      
      // Invalidate the query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/section-settings"] });
      
      toast({
        title: "Ustawienie zaktualizowane",
        description: `Sekcja "${setting.displayName}" została ${newValue ? "włączona" : "wyłączona"}.`,
      });
    } catch (error) {
      toast({
        title: "Błąd",
        description: error instanceof Error ? error.message : "Wystąpił błąd podczas aktualizacji ustawienia",
        variant: "destructive",
      });
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Ustawienia widoczności sekcji</h1>
            <Settings className="h-6 w-6" />
          </div>
          
          <p className="text-muted-foreground">
            Zarządzaj widocznością poszczególnych sekcji strony. Włącz lub wyłącz sekcje za pomocą przełączników.
          </p>
          
          <Separator />
          
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="p-4 text-destructive">
              Błąd ładowania ustawień: {error instanceof Error ? error.message : "Nieznany błąd"}
            </div>
          ) : (
            <div className="grid gap-4">
              {sectionSettings?.map((setting: SectionSetting) => (
                <Card key={setting.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium">{setting.displayName}</h3>
                        <p className="text-xs text-muted-foreground">
                          Ostatnia aktualizacja: {format(new Date(setting.updatedAt), "dd MMMM yyyy HH:mm", { locale: pl })}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`section-${setting.id}`} className="mr-2">
                          {setting.isEnabled ? "Widoczna" : "Ukryta"}
                        </Label>
                        <Switch
                          id={`section-${setting.id}`}
                          checked={setting.isEnabled}
                          onCheckedChange={() => handleToggleSection(setting)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}