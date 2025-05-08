import { db } from "./db";
import { services, whyUsItems, sectionSettings, trainings } from "@shared/schema";

/**
 * Seeds the database with sample data for Why Us, Services, Trainings and Section Settings
 */
async function seedDatabaseWithSampleData() {
  try {
    // Check if we already have data in these tables
    const existingWhyUsItems = await db.select().from(whyUsItems);
    const existingServices = await db.select().from(services);
    const existingTrainings = await db.select().from(trainings);
    
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
            showInMenu: true,
            order: 1,
            updatedAt: new Date()
          },
          {
            sectionKey: "why-us",
            displayName: "Dlaczego Automatyzator?",
            isEnabled: true,
            showInMenu: true,
            order: 2,
            updatedAt: new Date()
          },
          {
            sectionKey: "case-studies",
            displayName: "Nasze wdrożenia",
            isEnabled: true,
            showInMenu: true,
            order: 3,
            updatedAt: new Date()
          },
          {
            sectionKey: "templates",
            displayName: "Szablony automatyzacji",
            isEnabled: true,
            showInMenu: true,
            order: 4,
            updatedAt: new Date()
          },
          {
            sectionKey: "trainings",
            displayName: "Szkolenia",
            isEnabled: true,
            showInMenu: true,
            order: 5,
            updatedAt: new Date()
          },
          {
            sectionKey: "blog",
            displayName: "Blog",
            isEnabled: true,
            showInMenu: true,
            order: 6,
            updatedAt: new Date()
          },
          {
            sectionKey: "shop",
            displayName: "Sklep",
            isEnabled: true,
            showInMenu: true,
            order: 7,
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
    
    // Only seed Trainings if none exist
    if (existingTrainings.length === 0) {
      console.log("Seeding Trainings...");
      await db.insert(trainings).values([
        // Polish trainings
        {
          title: "Automatyzacja procesów biznesowych bez kodu",
          description: "Intensywne szkolenie praktyczne z wykorzystania narzędzi no-code do automatyzacji procesów biznesowych. Poznaj platformy takie jak Make.com, Zapier i Airtable.",
          price: 149900, // 1499 PLN
          duration: "2 dni (16h)",
          level: "Podstawowy/Średniozaawansowany",
          imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          featured: true,
          order: 1,
          language: "pl",
          updatedAt: new Date()
        },
        {
          title: "Tworzenie botów i asystentów AI",
          description: "Praktyczne warsztaty z budowania inteligentnych chatbotów i asystentów z wykorzystaniem najnowszych modeli językowych OpenAI i Anthropic dla biznesu.",
          price: 199900, // 1999 PLN
          duration: "3 dni (24h)",
          level: "Średniozaawansowany",
          imageUrl: "https://images.unsplash.com/photo-1677695016583-14c18821a95e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          featured: true,
          order: 2,
          language: "pl",
          updatedAt: new Date()
        },
        {
          title: "Integracja systemów biznesowych",
          description: "Szkolenie dla działów IT i specjalistów od procesów na temat integracji różnych systemów w firmie: CRM, ERP, marketing, księgowość, logistyka.",
          price: 249900, // 2499 PLN
          duration: "4 dni (32h)",
          level: "Zaawansowany",
          imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          featured: false,
          order: 3,
          language: "pl",
          updatedAt: new Date()
        },
        {
          title: "Microsoft Power Automate dla biznesu",
          description: "Kompleksowe szkolenie z wykorzystania platformy Microsoft Power Automate (dawniej Flow) do automatyzacji procesów w organizacji wykorzystującej rozwiązania Microsoft 365.",
          price: 129900, // 1299 PLN
          duration: "2 dni (16h)",
          level: "Podstawowy",
          imageUrl: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          featured: false,
          order: 4,
          language: "pl",
          updatedAt: new Date()
        },
        
        // English trainings
        {
          title: "No-code Business Process Automation",
          description: "Intensive practical training on using no-code tools for business process automation. Learn platforms such as Make.com, Zapier, and Airtable.",
          price: 149900, // 1499 PLN
          duration: "2 days (16h)",
          level: "Basic/Intermediate",
          imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          featured: true,
          order: 1,
          language: "en",
          updatedAt: new Date()
        },
        {
          title: "Building AI Bots and Assistants",
          description: "Practical workshop on creating intelligent chatbots and assistants using the latest language models from OpenAI and Anthropic for businesses.",
          price: 199900, // 1999 PLN
          duration: "3 days (24h)",
          level: "Intermediate",
          imageUrl: "https://images.unsplash.com/photo-1677695016583-14c18821a95e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          featured: true,
          order: 2,
          language: "en",
          updatedAt: new Date()
        },
        {
          title: "Business Systems Integration",
          description: "Training for IT departments and process specialists on integrating various business systems in the company: CRM, ERP, marketing, accounting, logistics.",
          price: 249900, // 2499 PLN
          duration: "4 days (32h)",
          level: "Advanced",
          imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          featured: false,
          order: 3,
          language: "en",
          updatedAt: new Date()
        },
        {
          title: "Microsoft Power Automate for Business",
          description: "Comprehensive training on using the Microsoft Power Automate platform (formerly Flow) to automate processes in an organization using Microsoft 365 solutions.",
          price: 129900, // 1299 PLN
          duration: "2 days (16h)",
          level: "Basic",
          imageUrl: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          featured: false,
          order: 4,
          language: "en",
          updatedAt: new Date()
        },
        
        // German trainings
        {
          title: "No-Code-Automatisierung von Geschäftsprozessen",
          description: "Intensives praktisches Training zur Verwendung von No-Code-Tools für die Automatisierung von Geschäftsprozessen. Lernen Sie Plattformen wie Make.com, Zapier und Airtable kennen.",
          price: 149900, // 1499 PLN
          duration: "2 Tage (16h)",
          level: "Grundlegend/Mittel",
          imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          featured: true,
          order: 1,
          language: "de",
          updatedAt: new Date()
        },
        {
          title: "Entwicklung von KI-Bots und -Assistenten",
          description: "Praktischer Workshop zur Erstellung intelligenter Chatbots und Assistenten mit den neuesten Sprachmodellen von OpenAI und Anthropic für Unternehmen.",
          price: 199900, // 1999 PLN
          duration: "3 Tage (24h)",
          level: "Mittel",
          imageUrl: "https://images.unsplash.com/photo-1677695016583-14c18821a95e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          featured: true,
          order: 2,
          language: "de",
          updatedAt: new Date()
        },
        {
          title: "Integration von Geschäftssystemen",
          description: "Schulung für IT-Abteilungen und Prozessspezialisten zur Integration verschiedener Systeme im Unternehmen: CRM, ERP, Marketing, Buchhaltung, Logistik.",
          price: 249900, // 2499 PLN
          duration: "4 Tage (32h)",
          level: "Fortgeschritten",
          imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          featured: false,
          order: 3,
          language: "de",
          updatedAt: new Date()
        },
        {
          title: "Microsoft Power Automate für Unternehmen",
          description: "Umfassende Schulung zur Nutzung der Microsoft Power Automate-Plattform (früher Flow) zur Automatisierung von Prozessen in einer Organisation, die Microsoft 365-Lösungen verwendet.",
          price: 129900, // 1299 PLN
          duration: "2 Tage (16h)",
          level: "Grundlegend",
          imageUrl: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          featured: false,
          order: 4,
          language: "de",
          updatedAt: new Date()
        },
        
        // Korean trainings
        {
          title: "노코드 비즈니스 프로세스 자동화",
          description: "비즈니스 프로세스 자동화를 위한 노코드 도구 사용에 관한 집중적인 실습 교육. Make.com, Zapier, Airtable과 같은 플랫폼을 배우세요.",
          price: 149900, // 1499 PLN
          duration: "2일 (16시간)",
          level: "기본/중급",
          imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          featured: true,
          order: 1,
          language: "ko",
          updatedAt: new Date()
        },
        {
          title: "AI 봇 및 어시스턴트 구축",
          description: "비즈니스를 위해 OpenAI 및 Anthropic의 최신 언어 모델을 사용하여 지능형 챗봇 및 어시스턴트를 만드는 실용적인 워크숍.",
          price: 199900, // 1999 PLN
          duration: "3일 (24시간)",
          level: "중급",
          imageUrl: "https://images.unsplash.com/photo-1677695016583-14c18821a95e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          featured: true,
          order: 2,
          language: "ko",
          updatedAt: new Date()
        },
        {
          title: "비즈니스 시스템 통합",
          description: "IT 부서 및 프로세스 전문가를 위한 기업 내 다양한 시스템 통합 교육: CRM, ERP, 마케팅, 회계, 물류.",
          price: 249900, // 2499 PLN
          duration: "4일 (32시간)",
          level: "고급",
          imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          featured: false,
          order: 3,
          language: "ko",
          updatedAt: new Date()
        },
        {
          title: "비즈니스를 위한 Microsoft Power Automate",
          description: "Microsoft 365 솔루션을 사용하는 조직에서 프로세스를 자동화하기 위한 Microsoft Power Automate 플랫폼(이전의 Flow) 사용에 관한 종합적인 교육.",
          price: 129900, // 1299 PLN
          duration: "2일 (16시간)",
          level: "기본",
          imageUrl: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          featured: false,
          order: 4,
          language: "ko",
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