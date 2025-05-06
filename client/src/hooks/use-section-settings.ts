import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface SectionSetting {
  id: number;
  sectionKey: string;
  displayName: string;
  isEnabled: boolean;
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
    return setting ? setting.isEnabled : true;
  };

  return {
    sectionSettings,
    isLoading,
    isError,
    error,
    isVisible
  };
}