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
    "/shop": "shop",
    "/portfolio": "case-studies",
  };
  
  return urlToSectionMap[url];
};

// Nawigacja będzie korzystać z tłumaczeń
const getNavLinks = (t: (key: string) => string): NavLink[] => [
  { title: t('header.home'), href: "/" },
  { title: t('header.services'), href: "/services", sectionKey: "services" },
  { title: t('header.whyUs'), href: "/why-us", sectionKey: "why-us" },
  { title: t('header.blog'), href: "/blog", sectionKey: "blog" },
  { title: t('header.shop'), href: "/shop", sectionKey: "shop" },
  { title: t('header.caseStudy'), href: "/portfolio", sectionKey: "case-studies" },
  { title: t('header.contact'), href: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const { t } = useTranslation('common');
  const { isVisibleInMenu, isLoading, isError } = useSectionSettings();
  
  // Pobierz wszystkie linki nawigacyjne
  const allNavLinks = getNavLinks(t);
  
  console.log("Navbar rendering, all links:", allNavLinks);
  
  // Filtruj linki na podstawie widoczności sekcji w menu
  const navLinks = allNavLinks.filter(link => {
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? "bg-background shadow-md py-3" : "py-4"
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div>
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <div className="flex-shrink-0 mr-1">
                <Logo />
              </div>
              <span className="text-xl font-bold ml-0">Automatyzator</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <div className={`font-inter hover:text-primary transition-colors cursor-pointer ${
                location === link.href ? "text-primary" : ""
              }`}>
                {link.title}
              </div>
            </Link>
          ))}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-1">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-6 mt-10">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <div className={`text-lg font-inter hover:text-primary transition-colors cursor-pointer ${
                      location === link.href ? "text-primary" : ""
                    }`}>
                      {link.title}
                    </div>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
