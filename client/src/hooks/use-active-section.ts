import { useState, useEffect } from 'react';

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<string>('/');

  useEffect(() => {
    // Tablica z mapowaniem ID sekcji na URL
    const sectionToUrlMap: Record<string, string> = {
      'services-section': '/services',
      'why-us-section': '/why-us',
      'blog-section': '/blog',
      'templates-section': '/shop',
      'case-studies-section': '/portfolio',
      'contact-section': '/contact',
      'hero-section': '/',
    };

    // Konfiguracja Intersection Observer
    const options = {
      root: null, // viewport
      rootMargin: '-10% 0px -70%', // Pozwala wybrać sekcję, gdy jest w obszarze widoczności 
      threshold: 0.15, // Sekcja jest "widoczna" gdy przynajmniej 15% sekcji jest w obszarze widoczności
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      // Filtrujemy elementy, które są widoczne
      const visibleSections = entries
        .filter(entry => entry.isIntersecting)
        .map(entry => entry.target.id);

      if (visibleSections.length > 0) {
        // Jeśli widoczne jest więcej niż jedna sekcja, wybieramy pierwszą z nich
        const sectionId = visibleSections[0];
        const url = sectionToUrlMap[sectionId];
        
        if (url) {
          console.log(`Aktywna sekcja: ${sectionId} => URL: ${url}`);
          setActiveSection(url);
        }
      }
    };

    // Inicjalizacja obserwatora
    const observer = new IntersectionObserver(handleIntersection, options);

    // Rejestracja wszystkich sekcji
    Object.keys(sectionToUrlMap).forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    // Czyszczenie obserwatora przy odmontowaniu komponentu
    return () => {
      observer.disconnect();
    };
  }, []);

  return activeSection;
}