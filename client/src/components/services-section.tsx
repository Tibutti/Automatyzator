import { Cog, Network, Zap, Bot, Brain } from "lucide-react";

const services = [
  {
    title: "Make.com",
    description: "Integracje i automatyzacje na platformie Make",
    icon: Cog,
  },
  {
    title: "n8n",
    description: "Automatyzacje procesów z open source n8n",
    icon: Network,
  },
  {
    title: "Zapier",
    description: "Szybkie integracje przez Zapier",
    icon: Zap,
  },
  {
    title: "Boty",
    description: "Boty konwersacyjne i procesowe",
    icon: Bot,
  },
  {
    title: "Agenty LLM",
    description: "Inteligentne asystenty oparte o LLM",
    icon: Brain,
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-16 bg-gray-50 dark:bg-gray-900/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-montserrat font-bold text-center mb-12 text-foreground">
          Nasze usługi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-background dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg p-6 flex flex-col items-center text-center transition-all transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full mb-4">
                <service.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-montserrat font-bold mb-2 text-foreground">
                {service.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
