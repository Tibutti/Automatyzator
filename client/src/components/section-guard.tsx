import { useEffect } from "react";
import { useLocation } from "wouter";
import { useSectionSettings } from "@/hooks/use-section-settings";

// Mapowanie ścieżek URL do kluczy sekcji
const pathToSectionKeyMap: Record<string, string> = {
  "/services": "services",
  "/why-us": "why-us",
  "/blog": "blog",
  "/shop": "shop",
  "/portfolio": "case-studies",
};

interface SectionGuardProps {
  children: React.ReactNode;
}

/**
 * Komponent SectionGuard sprawdza, czy bieżąca ścieżka odpowiada sekcji,
 * która jest ukryta. Jeśli tak, przekierowuje użytkownika na stronę główną.
 */
export default function SectionGuard({ children }: SectionGuardProps) {
  const [location, setLocation] = useLocation();
  const { isVisible, isLoading, sectionSettings } = useSectionSettings();

  useEffect(() => {
    // Jeśli dane są ładowane, nie podejmuj żadnych działań
    if (isLoading) return;

    // Sprawdź, czy bieżąca ścieżka odpowiada sekcji
    const sectionKey = pathToSectionKeyMap[location];

    // Jeśli nie znaleziono powiązanej sekcji, pozwól na renderowanie
    if (!sectionKey) return;

    // Sprawdź, czy sekcja jest widoczna
    const sectionVisible = isVisible(sectionKey);

    // Dodajemy logowanie, aby zobaczyć co się dzieje
    console.log(`Path: ${location}, Section key: ${sectionKey}, Visible: ${sectionVisible}`, 
      sectionSettings?.find(s => s.sectionKey === sectionKey));

    // Jeśli sekcja jest ukryta, przekieruj na stronę główną
    if (!sectionVisible) {
      console.log(`Redirecting from ${location} to / because section ${sectionKey} is not visible`);
      setLocation("/");
    }
  }, [location, isVisible, isLoading, setLocation, sectionSettings]);

  return <>{children}</>;
}