import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useChat } from "../contexts/chat-context";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { HeroSetting } from "@shared/schema";
import { useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

// Mapowanie ścieżek URL do kluczy stron dla ustawień hero
const URL_TO_PAGE_KEY: Record<string, string> = {
  "/": "home",
  "/services": "services",
  "/why-us": "why-us",
  "/blog": "blog",
  "/trainings": "trainings",
  "/templates": "templates",
  "/case-studies": "case-studies",
  "/shop": "shop"
};

// Domyślne ustawienia hero dla różnych podstron
const DEFAULT_HERO_SETTINGS: Record<string, HeroSetting> = {
  "home": {
    id: 1,
    pageKey: "home",
    title: "Automatyzator",
    subtitle: "Automatyzuj. Integruj. Skaluj",
    description: "Dostarczamy rozwiązania B2B, które automatyzują procesy, oszczędzają czas i zwiększają efektywność Twojego biznesu. Skorzystaj z naszego doświadczenia w AI, automatyzacji i integracji.",
    primaryButtonText: "Rozpocznij projekt",
    primaryButtonUrl: "/contact",
    secondaryButtonText: "Zobacz demo Chatbota",
    secondaryButtonUrl: "",
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    isEnabled: true,
    updatedAt: new Date()
  },
  "services": {
    id: 2,
    pageKey: "services",
    title: "Nasze Usługi",
    subtitle: "Automatyzacja. Integracja. Skalowalność.",
    description: "Profesjonalne usługi automatyzacji procesów biznesowych dla Twojej firmy. Skorzystaj z naszej wiedzy i doświadczenia, aby przyspieszyć rozwój swojego biznesu.",
    primaryButtonText: "Skontaktuj się",
    primaryButtonUrl: "/contact",
    secondaryButtonText: "Zobacz ofertę",
    secondaryButtonUrl: "#services-list",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    isEnabled: true,
    updatedAt: new Date()
  },
  "why-us": {
    id: 3,
    pageKey: "why-us",
    title: "Dlaczego Automatyzator?",
    subtitle: "Doświadczenie. Jakość. Rezultaty.",
    description: "Wybierając nas, wybierasz lata doświadczenia, terminowość i sprawdzone rozwiązania. Poznaj zalety współpracy z naszym zespołem ekspertów.",
    primaryButtonText: "Poznaj nasz zespół",
    primaryButtonUrl: "#team",
    secondaryButtonText: "Zobacz przypadki użycia",
    secondaryButtonUrl: "/case-studies",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    isEnabled: true,
    updatedAt: new Date()
  },
  "blog": {
    id: 4,
    pageKey: "blog",
    title: "Blog Automatyzatora",
    subtitle: "Wiedza. Inspiracje. Trendy.",
    description: "Dzielimy się wiedzą i doświadczeniem z zakresu automatyzacji, AI i najnowszych trendów technologicznych. Poznaj najnowsze artykuły z naszego bloga.",
    primaryButtonText: "Najnowsze artykuły",
    primaryButtonUrl: "#articles",
    secondaryButtonText: "",
    secondaryButtonUrl: "",
    imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    isEnabled: true,
    updatedAt: new Date()
  },
  "trainings": {
    id: 5,
    pageKey: "trainings",
    title: "Szkolenia",
    subtitle: "Wiedza. Praktyka. Rozwój.",
    description: "Profesjonalne szkolenia z zakresu automatyzacji procesów biznesowych, programowania i nowych technologii. Rozwijaj kompetencje swoje i swojego zespołu.",
    primaryButtonText: "Zobacz ofertę szkoleń",
    primaryButtonUrl: "#trainings-list",
    secondaryButtonText: "Szkolenie indywidualne",
    secondaryButtonUrl: "/contact?subject=Szkolenie%20indywidualne",
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    isEnabled: true,
    updatedAt: new Date()
  },
  "templates": {
    id: 6,
    pageKey: "templates",
    title: "Gotowe Szablony",
    subtitle: "Natychmiastowe. Konfigurowalne. Efektywne.",
    description: "Skorzystaj z gotowych rozwiązań, które możesz wdrożyć od razu. Szablony automatyzacji procesów biznesowych dla różnych branż i zastosowań.",
    primaryButtonText: "Przeglądaj szablony",
    primaryButtonUrl: "#templates-list",
    secondaryButtonText: "Szablon na zamówienie",
    secondaryButtonUrl: "/contact?subject=Szablon%20na%20zamówienie",
    imageUrl: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    isEnabled: true,
    updatedAt: new Date()
  },
  "case-studies": {
    id: 7,
    pageKey: "case-studies",
    title: "Case Studies",
    subtitle: "Wdrożenia. Efekty. Referencje.",
    description: "Zobacz, jak nasze rozwiązania pomogły innym firmom osiągnąć sukces. Rzeczywiste przykłady automatyzacji procesów biznesowych i ich rezultaty.",
    primaryButtonText: "Wszystkie wdrożenia",
    primaryButtonUrl: "#case-studies-list",
    secondaryButtonText: "",
    secondaryButtonUrl: "",
    imageUrl: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    isEnabled: true,
    updatedAt: new Date()
  },
  "shop": {
    id: 8,
    pageKey: "shop",
    title: "Sklep Automatyzatora",
    subtitle: "Łatwo. Szybko. Bezpiecznie.",
    description: "Kup gotowe rozwiązania automatyzacji procesów biznesowych online. Natychmiastowy dostęp do profesjonalnych narzędzi dla Twojej firmy.",
    primaryButtonText: "Promocje",
    primaryButtonUrl: "#promotions",
    secondaryButtonText: "Wszystkie produkty",
    secondaryButtonUrl: "#all-products",
    imageUrl: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    isEnabled: true,
    updatedAt: new Date()
  }
};

interface HeroSectionProps {
  pageKey?: string; // opcjonalny klucz strony (jeśli nie podano, zostanie odczytany z URL)
}

export default function HeroSection({ pageKey }: HeroSectionProps) {
  const { t } = useTranslation('common');
  const { toggleChat } = useChat();
  const [location] = useLocation();
  
  // Jeśli nie podano pageKey, odczytaj z URL
  const currentPageKey = pageKey || URL_TO_PAGE_KEY[location] || "home";
  
  // Pobierz ustawienia hero dla bieżącej strony
  const { data: heroSetting, isLoading, isError } = useQuery({
    queryKey: [`/api/hero-settings/page/${currentPageKey}`],
    queryFn: async () => {
      try {
        const response = await apiRequest<HeroSetting>("GET", `/api/hero-settings/page/${currentPageKey}`);
        return response;
      } catch (err) {
        console.error(`Error fetching hero settings for ${currentPageKey}:`, err);
        // W przypadku błędu nie pokazujemy domyślnych ustawień
        return null;
      }
    },
    // Nie używamy initialData, żeby zawsze sprawdzać aktualny stan z bazy danych
    staleTime: 0,
    refetchOnMount: true
  });
  
  // Jeśli sekcja jest wyłączona, dane są null lub isEnabled jest false, nie renderuj jej
  if (!heroSetting || heroSetting.isEnabled === false) {
    console.log(`Hero section for ${currentPageKey} is disabled or not found`);
    return null;
  }
  
  // Obsługa ładowania danych
  if (isLoading) {
    return (
      <section className="relative bg-background pt-36 md:pt-44 pb-20 md:pb-28 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 z-10">
              <Skeleton className="h-20 w-4/5 mb-4" />
              <Skeleton className="h-32 w-full mb-8" />
              <div className="flex space-x-4">
                <Skeleton className="h-12 w-36" />
                <Skeleton className="h-12 w-48" />
              </div>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0">
              <Skeleton className="h-80 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  // Obsługa błędu - w tym przypadku również ukrywamy sekcję
  if (isError) {
    return null;
  }
  
  // Rozdzielenie podtytułu na części (podział po kropce i spacji)
  const subtitleParts = heroSetting.subtitle.split('. ');
  
  return (
    <section id="hero" className="relative bg-background pt-36 md:pt-44 pb-20 md:pb-28 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold mb-4 leading-tight">
              <span className="text-primary">{heroSetting.title}</span>{" "}
              <div className="mt-4">
                {subtitleParts.length > 1 ? (
                  <>
                    <span className="text-foreground">{subtitleParts[0]}.</span>{" "}
                    {subtitleParts.slice(1, -1).map((part, index) => (
                      <span key={index} className="text-foreground">{part}.</span>
                    ))}
                    {" "}
                    <span className="text-accent">{subtitleParts[subtitleParts.length - 1]}</span>
                  </>
                ) : (
                  <span className="text-accent">{heroSetting.subtitle}</span>
                )}
              </div>
            </h1>
            <p className="text-lg md:text-xl mb-8 font-inter text-gray-700 dark:text-gray-300 max-w-xl">
              {heroSetting.description}
            </p>
            <div className="flex flex-wrap gap-4">
              {heroSetting.primaryButtonText && (
                <Link href={heroSetting.primaryButtonUrl || "/contact"}>
                  <Button className="px-6 py-3 h-auto cta-button shadow-lg hover:shadow-xl whitespace-nowrap">
                    {heroSetting.primaryButtonText}
                  </Button>
                </Link>
              )}
              {heroSetting.secondaryButtonText ? (
                <Link href={heroSetting.secondaryButtonUrl || "#"}>
                  <Button
                    variant="outline"
                    className="px-6 py-3 h-auto border-2 border-accent text-foreground hover:bg-accent hover:text-black cta-button whitespace-nowrap"
                  >
                    {heroSetting.secondaryButtonText}
                  </Button>
                </Link>
              ) : currentPageKey === "home" && (
                <Button
                  variant="outline"
                  className="px-6 py-3 h-auto border-2 border-accent text-foreground hover:bg-accent hover:text-black cta-button whitespace-nowrap"
                  onClick={toggleChat}
                >
                  Zobacz demo Chatbota
                </Button>
              )}
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0 relative">
            <div className="w-full h-full rounded-xl overflow-hidden relative">
              <img 
                src={heroSetting.imageUrl || "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
                alt={`${heroSetting.title} - ${heroSetting.subtitle}`}
                className="w-full h-auto object-cover rounded-xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl"></div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl z-0"></div>
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl z-0"></div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
    </section>
  );
}
