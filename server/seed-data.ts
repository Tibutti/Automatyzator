import { db } from "./db";
import { services, whyUsItems, sectionSettings } from "@shared/schema";

/**
 * Seeds the database with sample data for Why Us, Services and Section Settings
 */
async function seedDatabaseWithSampleData() {
  try {
    // Check if we already have data in these tables
    const existingWhyUsItems = await db.select().from(whyUsItems);
    const existingServices = await db.select().from(services);
    
    // Check if section settings exist
    let existingSectionSettings = [];
    try {
      existingSectionSettings = await db.select().from(sectionSettings);
    } catch (error) {
      console.log("Section Settings table does not exist yet - will be created");
    }
    
    // Only seed Why Us items if none exist
    if (existingWhyUsItems.length === 0) {
      console.log("Seeding Why Us items...");
      await db.insert(whyUsItems).values([
        {
          title: "Doświadczenie w branży",
          description: "Ponad 10 lat doświadczenia w tworzeniu rozwiązań automatyzacyjnych dla firm różnej wielkości.",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trophy"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
          order: 1,
          language: "pl",
          updatedAt: new Date()
        },
        {
          title: "Indywidualne podejście",
          description: "Każdy projekt traktujemy indywidualnie, dostosowując rozwiązania do specyficznych potrzeb Twojego biznesu.",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
          order: 2,
          language: "pl",
          updatedAt: new Date()
        },
        {
          title: "Wsparcie techniczne 24/7",
          description: "Zapewniamy całodobowe wsparcie techniczne, by Twoje procesy biznesowe działały nieprzerwanie.",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-headphones"><path d="M3 14h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h2"/></svg>',
          order: 3,
          language: "pl",
          updatedAt: new Date()
        },
        {
          title: "Bezpieczeństwo danych",
          description: "Gwarantujemy najwyższe standardy bezpieczeństwa danych zgodne z RODO i międzynarodowymi normami.",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>',
          order: 4,
          language: "pl",
          updatedAt: new Date()
        },
        {
          title: "Skalowalność rozwiązań",
          description: "Nasze rozwiązania rosną wraz z Twoją firmą, zapewniając płynne skalowanie w miarę rozwoju biznesu.",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
          order: 5,
          language: "pl",
          updatedAt: new Date()
        },
        {
          title: "Innowacyjne technologie",
          description: "Wykorzystujemy najnowsze technologie i narzędzia, by zapewnić naszym klientom przewagę konkurencyjną.",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lightbulb"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>',
          order: 6,
          language: "pl",
          updatedAt: new Date()
        },
        // English translations
        {
          title: "Industry Experience",
          description: "Over 10 years of experience in creating automation solutions for companies of various sizes.",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trophy"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
          order: 1,
          language: "en",
          updatedAt: new Date()
        },
        {
          title: "Individual Approach",
          description: "We treat each project individually, tailoring solutions to the specific needs of your business.",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
          order: 2,
          language: "en",
          updatedAt: new Date()
        }
      ]);
    }
    
    // Only seed section settings if none exist
    if (existingSectionSettings.length === 0) {
      console.log("Seeding Section Settings...");
      try {
        await db.insert(sectionSettings).values([
          {
            sectionKey: "services",
            displayName: "Nasze usługi",
            isEnabled: true,
            order: 1,
            updatedAt: new Date()
          },
          {
            sectionKey: "why-us",
            displayName: "Dlaczego Automatyzator?",
            isEnabled: true,
            order: 2,
            updatedAt: new Date()
          },
          {
            sectionKey: "case-studies",
            displayName: "Nasze wdrożenia",
            isEnabled: true,
            order: 3,
            updatedAt: new Date()
          },
          {
            sectionKey: "templates",
            displayName: "Szablony automatyzacji",
            isEnabled: true,
            order: 4,
            updatedAt: new Date()
          },
          {
            sectionKey: "blog",
            displayName: "Blog",
            isEnabled: true,
            order: 5,
            updatedAt: new Date()
          },
          {
            sectionKey: "shop",
            displayName: "Sklep",
            isEnabled: true,
            order: 6,
            updatedAt: new Date()
          }
        ]);
        console.log("Section Settings seeded successfully");
      } catch (error) {
        console.error("Error seeding section settings:", error);
      }
    }
    
    // Only seed Services if none exist
    if (existingServices.length === 0) {
      console.log("Seeding Services...");
      await db.insert(services).values([
        {
          title: "Automatyzacja procesów biznesowych",
          description: "Zwiększ efektywność swojej firmy poprzez automatyzację powtarzalnych zadań i procesów biznesowych.",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
          order: 1,
          language: "pl",
          updatedAt: new Date()
        },
        {
          title: "Integracja systemów",
          description: "Łączymy różne systemy i aplikacje, by zapewnić płynny przepływ danych w Twojej organizacji.",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-network"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>',
          order: 2,
          language: "pl",
          updatedAt: new Date()
        },
        {
          title: "Rozwój botów i agentów AI",
          description: "Tworzymy inteligentne boty i asystentów AI, które optymalizują obsługę klienta i procesy wewnętrzne.",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bot"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>',
          order: 3,
          language: "pl",
          updatedAt: new Date()
        },
        {
          title: "Analiza danych i raportowanie",
          description: "Przekształcamy surowe dane w wartościowe informacje biznesowe poprzez zaawansowaną analitykę i dashboardy.",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bar-chart"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>',
          order: 4,
          language: "pl",
          updatedAt: new Date()
        },
        {
          title: "Zarządzanie API",
          description: "Projektujemy, wdrażamy i zarządzamy interfejsami API, które umożliwiają bezpieczną wymianę danych.",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-code"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
          order: 5,
          language: "pl",
          updatedAt: new Date()
        },
        {
          title: "Audyt i optymalizacja procesów",
          description: "Analizujemy istniejące procesy biznesowe i identyfikujemy obszary do automatyzacji i optymalizacji.",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-check"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>',
          order: 6,
          language: "pl",
          updatedAt: new Date()
        },
        // English translations
        {
          title: "Business Process Automation",
          description: "Increase your company's efficiency by automating repetitive tasks and business processes.",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
          order: 1,
          language: "en",
          updatedAt: new Date()
        },
        {
          title: "Systems Integration",
          description: "We connect different systems and applications to ensure smooth data flow in your organization.",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-network"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>',
          order: 2,
          language: "en",
          updatedAt: new Date()
        }
      ]);
    }
    
    console.log("Database seeding completed successfully!");
    
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Run the seed function
seedDatabaseWithSampleData();