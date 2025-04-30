import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section id="hero" className="relative bg-background py-20 md:py-28 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold mb-4 leading-tight">
              <span className="text-primary">Automatyzuj.</span>{" "}
              <div className="mt-4">
                <span className="text-foreground">Integruj.</span>{" "}
                <span className="text-accent">Skaluj.</span>
              </div>
            </h1>
            <p className="text-lg md:text-xl mb-8 font-inter text-gray-700 dark:text-gray-300 max-w-xl">
              Zbuduj przewagę rynkową dzięki botom i zautomatyzowanym przepływom pracy.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact">
                <Button className="px-6 py-3 h-auto cta-button shadow-lg hover:shadow-xl">
                  Rozpocznij projekt
                </Button>
              </Link>
              <Button
                variant="outline"
                className="px-6 py-3 h-auto border-2 border-accent text-foreground hover:bg-accent hover:text-black cta-button"
              >
                Zobacz demo Chatbota
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0 relative">
            <div className="w-full h-full rounded-xl overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80" 
                alt="Automatyzacja procesów" 
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
