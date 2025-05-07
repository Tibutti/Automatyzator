import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface SectionSetting {
  id: number;
  sectionKey: string;
  displayName: string;
  isEnabled: boolean;
  showInMenu: boolean;
  order: number;
  updatedAt: Date;
}

export function useSectionSettings() {
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
      const data = await res.json();
      console.log("Loaded section settings from API:", data);
      return data;
    },
    // Dodajemy refetchInterval, aby periodycznie odświeżać dane
    refetchInterval: 5000,
  });

  const isVisible = (key: string): boolean => {
    if (isLoading || isError || !sectionSettings) {
      // Jeśli dane są ładowane lub wystąpił błąd, domyślnie pokazujemy sekcję
      console.log(`isVisible (dane niedostępne) dla ${key} - zwracam domyślnie true`);
      return true;
    }

    const setting = sectionSettings.find(
      (s: SectionSetting) => s.sectionKey === key
    );
    
    // Jeśli nie znaleziono ustawienia, domyślnie pokazujemy sekcję
    if (!setting) {
      console.log(`isVisible: Nie znaleziono ustawienia dla ${key} - zwracam domyślnie true`);
      return true;
    }
    
    // Sprawdzamy jawnie, czy wartość isEnabled to true
    const isEnabled = setting.isEnabled === true;
    console.log(`isVisible check for ${key}: isEnabled=${isEnabled}, raw value=${setting.isEnabled}`, setting);
    
    return isEnabled;
  };
  
  const isVisibleInMenu = (key: string): boolean => {
    if (isLoading || isError || !sectionSettings) {
      // Jeśli dane są ładowane lub wystąpił błąd, domyślnie pokazujemy w menu
      console.log(`isVisibleInMenu (dane niedostępne) dla ${key} - zwracam domyślnie true`);
      return true;
    }

    const setting = sectionSettings.find(
      (s: SectionSetting) => s.sectionKey === key
    );
    
    // Jeśli nie znaleziono ustawienia, domyślnie pokazujemy w menu
    if (!setting) {
      console.log(`isVisibleInMenu: Nie znaleziono ustawienia dla ${key} - zwracam domyślnie true`);
      return true;
    }
    
    // Sprawdzamy jawnie, czy wartość isEnabled to true
    const isEnabled = setting.isEnabled === true;
    // Sprawdzamy jawnie, czy wartość showInMenu to true
    const showInMenu = setting.showInMenu === true;
    
    console.log(`isVisibleInMenu check for ${key}: isEnabled=${isEnabled}, showInMenu=${showInMenu}, raw values=[${setting.isEnabled},${setting.showInMenu}]`, setting);
    
    // Sekcja musi być włączona i mieć ustawioną widoczność w menu
    return isEnabled && showInMenu;
  };
  
  const getSortedVisibleSections = (): SectionSetting[] => {
    if (isLoading || isError || !sectionSettings) {
      console.log("getSortedVisibleSections: Brak danych, zwracam pustą tablicę");
      return [];
    }
    
    console.log("All section settings:", sectionSettings);
    
    // Zwróć tylko widoczne sekcje, posortowane według pola order
    const visibleSections = [...sectionSettings]
      .filter(section => section.isEnabled === true)  // Sprawdzamy jawnie, czy wartość to true
      .sort((a, b) => a.order - b.order);
      
    console.log("Visible sorted sections:", visibleSections);
    return visibleSections;
  };

  return {
    sectionSettings,
    isLoading,
    isError,
    error,
    isVisible,
    isVisibleInMenu,
    getSortedVisibleSections
  };
}