import { useSectionSettings } from "@/hooks/use-section-settings";

interface VisibilityGuardProps {
  sectionKey: string;
  children: React.ReactNode;
}

/**
 * Komponent VisibilityGuard renderuje dzieci tylko gdy sekcja jest włączona
 */
export function VisibilityGuard({ sectionKey, children }: VisibilityGuardProps) {
  const { isVisible } = useSectionSettings();
  
  if (!isVisible(sectionKey)) {
    return null;
  }
  
  return <>{children}</>;
}