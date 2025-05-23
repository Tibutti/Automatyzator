import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import Logo from "@/components/logo";
import LanguageSwitcher from "@/components/language-switcher";
import { useTranslation } from "react-i18next";
import { useSectionSettings } from "@/hooks/use-section-settings";
import { useActiveSection } from "@/hooks/use-active-section";

// Definiowanie typów dla nawigacji
interface NavLink {
  title: string;
  href: string;
  sectionKey?: string; // Klucz sekcji do sprawdzenia widoczności
}

// Definiujemy mapowanie między kluczami sekcji a adresami URL
const getSectionKeyForUrl = (url: string): string | undefined => {
  const urlToSectionMap: Record<string, string> = {
    "/services": "services",
    "/why-us": "why-us",
    "/blog": "blog",
    "/shop": "templates",
    "/portfolio": "case-studies",
    "/trainings": "trainings",
  };
  
  return urlToSectionMap[url];
};

// Bazowa konfiguracja nawigacji - kolejność zostanie określona przez ustawienia sekcji
const getNavLinks = (t: (key: string) => string): NavLink[] => [
  { title: t('header.home'), href: "/" }, // Strona główna nie ma klucza sekcji - zawsze będzie pierwsza
  { title: t('header.services'), href: "/services", sectionKey: "services" },
  { title: t('header.whyUs'), href: "/why-us", sectionKey: "why-us" },
  { title: t('header.blog'), href: "/blog", sectionKey: "blog" },
  { title: t('header.shop'), href: "/shop", sectionKey: "templates" },
  { title: t('header.trainings'), href: "/trainings", sectionKey: "trainings" },
  { title: t('header.caseStudy'), href: "/portfolio", sectionKey: "case-studies" },
  { title: t('header.contact'), href: "/contact" }, // Kontakt nie ma klucza sekcji - zawsze będzie ostatni
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const activeSection = useActiveSection(); // Dodajemy hook, który śledzi aktywną sekcję podczas przewijania
  const { t } = useTranslation('common');
  const { isVisibleInMenu, getSectionOrder, isLoading, isError, sectionSettings } = useSectionSettings();
  
  // Pobierz wszystkie linki nawigacyjne
  const allNavLinks = getNavLinks(t);
  
  console.log("Navbar rendering, all links:", allNavLinks);
  
  // Filtruj linki na podstawie widoczności sekcji w menu
  const filteredLinks = allNavLinks.filter(link => {
    // Jeśli link nie ma powiązanej sekcji (np. strona główna, kontakt), 
    // zawsze go pokazuj
    if (!link.sectionKey) {
      console.log(`Menu link always visible - ${link.title} (no section key)`);
      return true;
    }
    
    // W przeciwnym razie sprawdź, czy sekcja jest widoczna w menu
    const visible = isVisibleInMenu(link.sectionKey);
    console.log(`Menu link visibility check - ${link.title} (${link.sectionKey}):`, visible);
    
    return visible;
  });
  
  // Sortuj linki na podstawie pola order z konfiguracji sekcji
  const navLinks = [...filteredLinks].sort((a, b) => {
    // Strona główna zawsze pierwsza
    if (a.href === "/") return -1;
    if (b.href === "/") return 1;
    
    // Kontakt zawsze ostatni
    if (a.href === "/contact") return 1;
    if (b.href === "/contact") return -1;
    
    // Sortowanie na podstawie pola order
    const orderA = a.sectionKey ? getSectionOrder(a.sectionKey) : 0;
    const orderB = b.sectionKey ? getSectionOrder(b.sectionKey) : 0;
    
    return orderA - orderB;
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? "bg-background shadow-md py-4" : "py-5"
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="pt-1">
          {location === '/' ? (
            // Na stronie głównej - dodajemy ręczne odświeżenie
            <a 
              href="/" 
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/';
              }}
              className="flex items-center cursor-pointer"
            >
              <div className="flex-shrink-0 mr-1">
                <Logo />
              </div>
              <span className="text-xl font-bold ml-0">Automatyzator</span>
            </a>
          ) : (
            // Na innych stronach - standardowy link powrotu do strony głównej
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <div className="flex-shrink-0 mr-1">
                  <Logo />
                </div>
                <span className="text-xl font-bold ml-0">Automatyzator</span>
              </div>
            </Link>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 pt-1">
          {navLinks.map((link) => {
            // Specjalny przypadek dla linku "Główna" - jest aktywny tylko gdy
            // jesteśmy na górze strony (activeSection === '/')
            if (link.href === '/') {
              // Link "Główna" jest aktywny tylko wtedy, gdy jesteśmy na stronie głównej
              // I NIE przeglądamy innej sekcji
              return (
                <Link key={link.href} href={link.href}>
                  <div 
                    className={`font-inter hover:text-primary transition-colors cursor-pointer ${
                      location === '/' && activeSection === '/' 
                        ? "text-primary font-semibold border-b-2 border-primary pb-1" 
                        : ""
                    }`}
                    data-active={location === '/' && activeSection === '/'}
                  >
                    {link.title}
                  </div>
                </Link>
              );
            }
            
            // Dla pozostałych linków, standardowa logika:
            // - URL dokładnie odpowiada lokalizacji (dla podstron)
            // - ALBO jesteśmy na stronie głównej (/) i aktywna sekcja odpowiada linkowi
            const isActive = location === link.href || 
                            (location === '/' && activeSection === link.href);
            
            return (
              <Link key={link.href} href={link.href}>
                <div 
                  className={`font-inter hover:text-primary transition-colors cursor-pointer ${
                    isActive ? "text-primary font-semibold border-b-2 border-primary pb-1" : ""
                  }`}
                  data-active={isActive}
                >
                  {link.title}
                </div>
              </Link>
            );
          })}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-1">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-6 mt-10">
                {navLinks.map((link) => {
                  // Specjalny przypadek dla linku "Główna" - jest aktywny tylko gdy
                  // jesteśmy na górze strony (activeSection === '/')
                  if (link.href === '/') {
                    // Link "Główna" jest aktywny tylko wtedy, gdy jesteśmy na stronie głównej
                    // I NIE przeglądamy innej sekcji
                    return (
                      <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                        <div 
                          className={`text-lg font-inter hover:text-primary transition-colors cursor-pointer ${
                            location === '/' && activeSection === '/' 
                              ? "text-primary font-bold" 
                              : ""
                          }`}
                          data-active={location === '/' && activeSection === '/'}
                        >
                          {link.title}
                        </div>
                      </Link>
                    );
                  }
                  
                  // Dla pozostałych linków, standardowa logika:
                  // - URL dokładnie odpowiada lokalizacji (dla podstron)
                  // - ALBO jesteśmy na stronie głównej (/) i aktywna sekcja odpowiada linkowi
                  const isActive = location === link.href || 
                                  (location === '/' && activeSection === link.href);
                  
                  return (
                    <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                      <div 
                        className={`text-lg font-inter hover:text-primary transition-colors cursor-pointer ${
                          isActive ? "text-primary font-bold" : ""
                        }`}
                        data-active={isActive}
                      >
                        {link.title}
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
