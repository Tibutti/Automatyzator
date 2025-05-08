import { useState, useEffect } from 'react';

/**
 * Hook do śledzenia aktywnej sekcji podczas przewijania strony
 */
export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<string>('/');

  useEffect(() => {
    // Resetujemy aktywną sekcję przy montowaniu komponentu
    console.log("useActiveSection - inicjalizacja");
    
    // Mapowanie ID sekcji na odpowiadające ścieżki URL
    const sectionMap = [
      { id: 'hero-section', url: '/' },
      { id: 'services-section', url: '/services' },
      { id: 'why-us-section', url: '/why-us' },
      { id: 'blog-section', url: '/blog' },
      { id: 'templates-section', url: '/shop' },
      { id: 'case-studies-section', url: '/portfolio' },
      { id: 'contact-section', url: '/contact' }
    ];
    
    // Funkcja sprawdzająca, która sekcja jest aktualnie widoczna
    const checkVisibleSections = () => {
      const viewportHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      
      // Określamy pozycję widoku - 20% od góry ekranu
      const triggerPosition = scrollPosition + viewportHeight * 0.2;
      
      // Sprawdzamy wszystkie zdefiniowane sekcje
      for (const section of sectionMap) {
        const element = document.getElementById(section.id);
        
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const absoluteTop = scrollPosition + top;
          const absoluteBottom = scrollPosition + bottom;
          
          // Sprawdzamy, czy pozycja wyzwolenia znajduje się w obszarze elementu
          if (triggerPosition >= absoluteTop && triggerPosition <= absoluteBottom) {
            console.log(`Aktywna sekcja: ${section.id} => ${section.url}`);
            setActiveSection(section.url);
            return; // Znaleziono aktywną sekcję, można zakończyć pętle
          }
        }
      }
    };
    
    // Sprawdzamy widoczne sekcje na początku
    setTimeout(() => {
      console.log("Sprawdzanie początkowych sekcji");
      
      // Sprawdzamy, czy elementy sekcji istnieją w DOM
      const missingElements = sectionMap.filter(section => !document.getElementById(section.id));
      if (missingElements.length > 0) {
        console.warn("Brakujące elementy sekcji:", missingElements.map(s => s.id));
      }
      
      checkVisibleSections();
    }, 500);
    
    // Nasłuchujemy zdarzenia przewijania
    window.addEventListener('scroll', checkVisibleSections, { passive: true });
    
    // Czyszczenie przy odmontowaniu komponentu
    return () => {
      console.log("useActiveSection - czyszczenie");
      window.removeEventListener('scroll', checkVisibleSections);
    };
  }, []);

  return activeSection;
}