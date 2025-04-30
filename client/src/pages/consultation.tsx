import { useEffect } from "react";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Consultation() {
  // Załaduj skrypt Calendly po wyrenderowaniu komponentu
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanupł skryptu przy odmontowaniu komponentu
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Powrót do strony głównej
            </Button>
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Bezpłatna konsultacja</h1>
          
          <div className="bg-card p-6 rounded-xl shadow-sm mb-8">
            <p className="text-lg mb-4">
              Umów się na bezpłatną 30-minutową konsultację z naszym ekspertem od automatyzacji.
              Podczas spotkania:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6">
              <li>Omówimy Twoje potrzeby biznesowe</li>
              <li>Doradzimy optymalne rozwiązania automatyzacyjne</li>
              <li>Przygotujemy wstępną ocenę możliwości integracji systemów</li>
              <li>Odpowiemy na Twoje pytania związane z automatyzacją</li>
            </ul>
            <p>Wybierz dogodny termin w kalendarzu poniżej i daj nam się poznać!</p>
          </div>
          
          {/* Calendly inline widget */}
          <div 
            className="calendly-inline-widget" 
            data-url="https://calendly.com/automatyzator/konsultacja"
            style={{ minWidth: '320px', height: '700px' }}
          ></div>
        </div>
      </div>
    </Layout>
  );
}