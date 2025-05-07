import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface SectionSetting {
  id: number;
  sectionKey: string;
  displayName: string;
  isEnabled: boolean;
  showInMenu: boolean;
  order: number;
  metadata?: string | null;
  updatedAt: string | Date;
}

// Dane sekcji bezpośrednio zaszyte w kodzie, jako rozwiązanie fallbackowe gdy API nie działa
const DEFAULT_SECTION_SETTINGS: SectionSetting[] = [
  {
    "id": 1,
    "sectionKey": "services",
    "displayName": "Nasze usługi",
    "isEnabled": true,
    "showInMenu": true,
    "order": 1,
    "metadata": null,
    "updatedAt": new Date().toISOString()
  },
  {
    "id": 2,
    "sectionKey": "why-us",
    "displayName": "Dlaczego Automatyzator?",
    "isEnabled": true,
    "showInMenu": true,
    "order": 2,
    "metadata": null,
    "updatedAt": new Date().toISOString()
  },
  {
    "id": 3,
    "sectionKey": "case-studies",
    "displayName": "Nasze wdrożenia",
    "isEnabled": true,
    "showInMenu": true,
    "order": 3,
    "metadata": null,
    "updatedAt": new Date().toISOString()
  },
  {
    "id": 4,
    "sectionKey": "templates",
    "displayName": "Szablony automatyzacji",
    "isEnabled": true,
    "showInMenu": true,
    "order": 4,
    "metadata": null,
    "updatedAt": new Date().toISOString()
  },
  {
    "id": 5,
    "sectionKey": "blog",
    "displayName": "Blog",
    "isEnabled": true,
    "showInMenu": true,
    "order": 5,
    "metadata": null,
    "updatedAt": new Date().toISOString()
  },
  {
    "id": 6,
    "sectionKey": "shop",
    "displayName": "Sklep",
    "isEnabled": true,
    "showInMenu": true,
    "order": 6,
    "metadata": null,
    "updatedAt": new Date().toISOString()
  },
  {
    "id": 7,
    "sectionKey": "consultation",
    "displayName": "Bezpłatna konsultacja",
    "isEnabled": true,
    "showInMenu": true,
    "order": 7,
    "metadata": "{\"calendlyUrl\": \"https://calendly.com/automatyzator/konsultacja\"}",
    "updatedAt": new Date().toISOString()
  }
];

export function useSectionSettings() {
  const {
    data: apiSectionSettings,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["/api/section-settings"],
    queryFn: async () => {
      try {
        const response = await apiRequest<SectionSetting[]>("GET", "/api/section-settings");
        console.log("Raw API response for section settings:", response);
        
        if (!response || response.length === 0) {
          console.error("Failed to fetch section settings from API or received empty array");
          return null;
        }
        
        // Konwertujemy wartości z bazy danych na prawidłowe wartości boolean
        // Używamy ścisłego porównania z true
        const mappedSettings = response.map(setting => {
          // Logowanie przed konwersją
          console.log(`Before conversion - ID: ${setting.id}, Key: ${setting.sectionKey}, isEnabled: ${setting.isEnabled} (${typeof setting.isEnabled}), showInMenu: ${setting.showInMenu} (${typeof setting.showInMenu})`);
          
          // Metoda konwersji - ścisłe porównanie do true
          const convertedSetting = {
            ...setting,
            isEnabled: setting.isEnabled === true,
            showInMenu: setting.showInMenu === true
          };
          
          // Logowanie po konwersji
          console.log(`After conversion - ID: ${setting.id}, Key: ${setting.sectionKey}, isEnabled: ${convertedSetting.isEnabled} (${typeof convertedSetting.isEnabled}), showInMenu: ${convertedSetting.showInMenu} (${typeof convertedSetting.showInMenu})`);
          
          return convertedSetting;
        });
        
        console.log("Transformed section settings:", mappedSettings);
        return mappedSettings;
      } catch (err) {
        console.error("Error fetching section settings:", err);
        return null;
      }
    },
    // Dodajemy ustawienia, które pomogą w szybszym ładowaniu danych
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    staleTime: 1000,
  });
  
  // Fallback do domyślnych ustawień jeśli API zwróci null
  const sectionSettings = apiSectionSettings || DEFAULT_SECTION_SETTINGS;
  
  console.log("Używamy sectionSettings:", sectionSettings ? "z API" : "domyślne", 
    "Ilość elementów:", sectionSettings?.length || 0, 
    "Przykładowe wartości isEnabled:", sectionSettings?.map((s: SectionSetting) => s.isEnabled).join(", "));

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