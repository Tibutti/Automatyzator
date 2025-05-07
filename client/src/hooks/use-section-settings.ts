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
      return res.json();
    },
  });

  const isVisible = (key: string): boolean => {
    if (isLoading || isError || !sectionSettings) {
      // Jeśli dane są ładowane lub wystąpił błąd, domyślnie pokazujemy sekcję
      return true;
    }

    const setting = sectionSettings.find(
      (s: SectionSetting) => s.sectionKey === key
    );
    
    // Jeśli nie znaleziono ustawienia, domyślnie pokazujemy sekcję
    return setting ? setting.isEnabled === true : true;
  };
  
  const isVisibleInMenu = (key: string): boolean => {
    if (isLoading || isError || !sectionSettings) {
      // Jeśli dane są ładowane lub wystąpił błąd, domyślnie pokazujemy w menu
      return true;
    }

    const setting = sectionSettings.find(
      (s: SectionSetting) => s.sectionKey === key
    );
    
    // Jeśli nie znaleziono ustawienia lub sekcja nie jest włączona, nie pokazujemy w menu
    if (!setting || !setting.isEnabled) {
      return false;
    }
    
    // Zwracamy wartość showInMenu
    return setting.showInMenu;
  };
  
  const getSortedVisibleSections = (): SectionSetting[] => {
    if (isLoading || isError || !sectionSettings) {
      return [];
    }
    
    // Zwróć tylko widoczne sekcje, posortowane według pola order
    return [...sectionSettings]
      .filter(section => section.isEnabled === true)  // Jawnie sprawdzamy, czy isEnabled jest true
      .sort((a, b) => a.order - b.order);
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