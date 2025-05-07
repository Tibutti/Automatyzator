import { useEffect } from "react";
import { useLocation } from "wouter";
import { useSectionSettings, type SectionSetting } from "@/hooks/use-section-settings";

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
    console.log(`SectionGuard efectt running for path: ${location}`);
    
    // Jeśli dane są ładowane, nie podejmuj żadnych działań
    if (isLoading) {
      console.log(`SectionGuard: Dane ładowane, wstrzymuję przekierowanie`);
      return;
    }

    // Sprawdź, czy bieżąca ścieżka odpowiada sekcji
    const sectionKey = pathToSectionKeyMap[location];

    // Jeśli nie znaleziono powiązanej sekcji, pozwól na renderowanie
    if (!sectionKey) {
      console.log(`SectionGuard: Brak mapowania sekcji dla ścieżki ${location}, pozwalam na renderowanie`);
      return;
    }

    // Uzyskaj ustawienie sekcji
    const sectionSetting = sectionSettings?.find(
      (s: SectionSetting) => s.sectionKey === sectionKey
    );

    // Sprawdź, czy sekcja jest widoczna
    const sectionVisible = isVisible(sectionKey);

    // Dodajemy logowanie, aby zobaczyć co się dzieje
    console.log(`SectionGuard check - Path: ${location}, Section key: ${sectionKey}, Visible: ${sectionVisible}`, sectionSetting);

    // Jeśli sekcja jest ukryta (isEnabled === false), przekieruj na stronę główną
    if (!sectionVisible) {
      console.log(`SectionGuard: Redirecting from ${location} to / because section ${sectionKey} is not visible`);
      setLocation("/");
    } else {
      console.log(`SectionGuard: Sekcja ${sectionKey} jest widoczna, pozwalam na renderowanie`);
    }
  }, [location, isVisible, isLoading, setLocation, sectionSettings]);

  return <>{children}</>;
}