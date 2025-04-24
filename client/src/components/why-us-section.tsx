import { Rocket, Headphones, Package, Code } from "lucide-react";

const features = [
  {
    title: "Szybkie wdrożenia",
    description: "Nawet w 48h uruchamiamy pierwszy automatyczny przepływ pracy",
    icon: Rocket,
    accentColor: "accent",
  },
  {
    title: "Wsparcie 24/7",
    description: "Całodobowa pomoc techniczna i wsparcie przy problemach",
    icon: Headphones,
    accentColor: "primary",
  },
  {
    title: "Gotowe szablony",
    description: "Biblioteka gotowych rozwiązań dla popularnych przypadków",
    icon: Package,
    accentColor: "accent",
  },
  {
    title: "Bez kodu",
    description: "Większość rozwiązań implementujemy bez potrzeby pisania kodu",
    icon: Code,
    accentColor: "primary",
  },
];

export default function WhyUsSection() {
  return (
    <section id="why-us" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-montserrat font-bold text-center mb-12 text-foreground">
          Dlaczego my?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-background dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 bg-${feature.accentColor}/10 rounded-full flex items-center justify-center mb-4`}>
                <feature.icon className={`text-${feature.accentColor} text-xl`} />
              </div>
              <h3 className="text-xl font-montserrat font-bold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
