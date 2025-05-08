import { useState, useEffect } from 'react';

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<string>('/');

  useEffect(() => {
    console.log("useActiveSection mounted");
    
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

    // Konfiguracja Intersection Observer z mniejszymi marginami, aby łatwiej wykrywać sekcje
    const options = {
      root: null, // viewport
      rootMargin: '0px 0px -30% 0px', // Pozwala wybrać sekcję, gdy jest w górnej części widoku
      threshold: 0.1, // Obniżamy próg wykrycia widoczności
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      // Sortujemy wejścia, aby sekcje wyżej na stronie miały priorytet
      const visibleEntries = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => {
          // Niższy boundingClientRect.top = wyżej na stronie
          return a.boundingClientRect.top - b.boundingClientRect.top;
        });

      console.log("Widoczne sekcje:", visibleEntries.map(entry => entry.target.id));

      if (visibleEntries.length > 0) {
        // Bierzemy najwyższą widoczną sekcję
        const sectionId = visibleEntries[0].target.id;
        const url = sectionToUrlMap[sectionId];
        
        if (url) {
          console.log(`Aktywna sekcja: ${sectionId} => URL: ${url}`);
          setActiveSection(url);
        }
      }
    };

    // Inicjalizacja obserwatora z opóźnieniem, aby dać czas na renderowanie DOM
    setTimeout(() => {
      // Najpierw szukamy wszystkich elementów sekcji w DOM
      const sectionsInDOM = Object.keys(sectionToUrlMap)
        .map(id => document.getElementById(id))
        .filter(el => el !== null); // Filtrujemy nieistniejące elementy
      
      console.log("Znalezione sekcje w DOM:", sectionsInDOM.map(el => el?.id));
      
      if (sectionsInDOM.length === 0) {
        console.warn("Nie znaleziono żadnych elementów sekcji w DOM!");
        return;
      }
      
      // Tworzymy obserwator po znalezieniu sekcji
      const observer = new IntersectionObserver(handleIntersection, options);
      
      // Rejestracja wszystkich sekcji
      sectionsInDOM.forEach(element => {
        if (element) {
          observer.observe(element);
          console.log(`Obserwuję sekcję: ${element.id}`);
        }
      });
      
      // Czyszczenie obserwatora przy odmontowaniu komponentu
      return () => {
        console.log("Odłączanie obserwatora");
        observer.disconnect();
      };
    }, 500); // 500ms powinno wystarczyć na renderowanie DOM
    
    // Czyszczenie dla głównego useEffect
    return () => {
      console.log("useActiveSection unmounted");
    };
  }, []);

  return activeSection;
}