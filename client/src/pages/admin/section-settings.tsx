import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2, Settings, ArrowUp, ArrowDown, GripVertical } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import AdminLayout from "@/components/admin/admin-layout";
import ProtectedRoute from "@/components/admin/protected-route";

interface SectionSetting {
  id: number;
  sectionKey: string;
  displayName: string;
  isEnabled: boolean;
  showInMenu: boolean;
  order: number;
  updatedAt: Date;
}

export default function SectionSettingsPage() {
  const { toast } = useToast();
  const [sortedSettings, setSortedSettings] = useState<SectionSetting[]>([]);
  const [isSaving, setIsSaving] = useState(false);

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

  // Update sortedSettings when data is loaded
  useEffect(() => {
    if (sectionSettings) {
      // Create a sorted copy of the settings by order
      const sorted = [...sectionSettings].sort((a, b) => a.order - b.order);
      setSortedSettings(sorted);
    }
  }, [sectionSettings]);

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

  const handleToggleMenu = async (setting: SectionSetting) => {
    try {
      const newValue = !setting.showInMenu;
      
      const res = await apiRequest(
        "PUT", 
        `/api/section-settings/${setting.id}`,
        { showInMenu: newValue }
      );
      
      if (!res.ok) {
        throw new Error("Failed to update menu visibility");
      }
      
      // Invalidate the query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/section-settings"] });
      
      toast({
        title: "Menu zaktualizowane",
        description: `Sekcja "${setting.displayName}" będzie ${newValue ? "widoczna" : "ukryta"} w menu.`,
      });
    } catch (error) {
      toast({
        title: "Błąd",
        description: error instanceof Error ? error.message : "Wystąpił błąd podczas aktualizacji widoczności w menu",
        variant: "destructive",
      });
    }
  };

  const moveSection = async (settingId: number, direction: 'up' | 'down') => {
    try {
      const currentIndex = sortedSettings.findIndex(s => s.id === settingId);
      if (currentIndex < 0) return;
      
      // Determine if move is valid
      if (direction === 'up' && currentIndex === 0) return;
      if (direction === 'down' && currentIndex === sortedSettings.length - 1) return;
      
      // Calculate new index
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      // Create a copy of the settings
      const newSortedSettings = [...sortedSettings];
      
      // Swap the elements
      const temp = newSortedSettings[currentIndex];
      newSortedSettings[currentIndex] = newSortedSettings[newIndex];
      newSortedSettings[newIndex] = temp;
      
      // Update order values
      newSortedSettings.forEach((setting, index) => {
        setting.order = index + 1;
      });
      
      setSortedSettings(newSortedSettings);
      
      // Save the changes for the two affected settings
      setIsSaving(true);
      
      // Update the order of the first setting
      const res1 = await apiRequest(
        "PUT",
        `/api/section-settings/${newSortedSettings[currentIndex].id}`,
        { order: newSortedSettings[currentIndex].order }
      );
      
      // Update the order of the second setting
      const res2 = await apiRequest(
        "PUT",
        `/api/section-settings/${newSortedSettings[newIndex].id}`,
        { order: newSortedSettings[newIndex].order }
      );
      
      if (!res1.ok || !res2.ok) {
        throw new Error("Failed to update section order");
      }
      
      setIsSaving(false);
      
      toast({
        title: "Kolejność zaktualizowana",
        description: `Zmieniono kolejność sekcji "${newSortedSettings[newIndex].displayName}".`,
      });
    } catch (error) {
      setIsSaving(false);
      toast({
        title: "Błąd",
        description: error instanceof Error ? error.message : "Wystąpił błąd podczas aktualizacji kolejności",
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
            Zarządzaj widocznością poszczególnych sekcji strony. Możesz kontrolować dwa aspekty:
            <br />1. <b>Widoczność na stronie</b> - czy sekcja jest wyświetlana na stronie głównej.
            <br />2. <b>Widoczność w menu</b> - czy sekcja pojawia się w menu nawigacyjnym (tylko jeśli sekcja jest włączona).
            <br />Użyj strzałek, aby zmienić kolejność sekcji na stronie głównej.
          </p>
          
          <Separator />
          
          {isLoading || isSaving ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="p-4 text-destructive">
              Błąd ładowania ustawień: {error instanceof Error ? error.message : "Nieznany błąd"}
            </div>
          ) : (
            <div className="grid gap-4">
              {sortedSettings.map((setting: SectionSetting) => (
                <Card key={setting.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col space-y-4">
                      {/* Górna część karty z numerem, nazwą i strzałkami do zmiany kolejności */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex flex-col items-center space-y-1">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => moveSection(setting.id, 'up')}
                              disabled={setting.order === 1}
                              className="h-7 w-7"
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => moveSection(setting.id, 'down')}
                              disabled={setting.order === sortedSettings.length}
                              className="h-7 w-7"
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                                {setting.order}
                              </span>
                              <h3 className="font-medium">{setting.displayName}</h3>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Ostatnia aktualizacja: {format(new Date(setting.updatedAt), "dd MMMM yyyy HH:mm", { locale: pl })}
                            </p>
                          </div>
                        </div>
                        
                        {/* Przełącznik widoczności sekcji na stronie */}
                        <div className="flex items-center space-x-2">
                          <Label htmlFor={`section-${setting.id}`} className="mr-2">
                            {setting.isEnabled ? "Widoczna na stronie" : "Ukryta na stronie"}
                          </Label>
                          <Switch
                            id={`section-${setting.id}`}
                            checked={setting.isEnabled}
                            onCheckedChange={() => handleToggleSection(setting)}
                          />
                        </div>
                      </div>
                      
                      {/* Dolna część karty z przełącznikiem widoczności w menu */}
                      <div className="flex items-center justify-end space-x-2 pt-2 border-t">
                        <Label htmlFor={`menu-${setting.id}`} className="mr-2">
                          {setting.showInMenu ? "Widoczna w menu" : "Ukryta w menu"}
                        </Label>
                        <Switch
                          id={`menu-${setting.id}`}
                          checked={setting.showInMenu}
                          onCheckedChange={() => handleToggleMenu(setting)}
                          disabled={!setting.isEnabled}
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