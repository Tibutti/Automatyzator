import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Cpu, Database, Cloud, Zap, Layers } from "lucide-react";

// Typ pojedynczej cząstki w animacji
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  lifetime: number;
  maxLifetime: number;
}

// Typ punktu w sieci połączeń
interface ConnectionPoint {
  x: number;
  y: number;
  label: string;
  icon: React.ReactNode;
  connections: number[];
  pulse: boolean;
  active: boolean;
  description: string;
}

export default function InteractiveHeroSection() {
  const [activePoint, setActivePoint] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Punkty połączeń w animacji
  const connectionPoints: ConnectionPoint[] = [
    {
      x: 0.15,
      y: 0.3,
      label: "Dane Biznesowe",
      icon: <Database className="h-6 w-6 text-blue-500" />,
      connections: [1, 2, 3],
      pulse: true,
      active: true,
      description: "Zintegruj dane z różnych systemów biznesowych"
    },
    {
      x: 0.35,
      y: 0.15,
      label: "Analiza AI",
      icon: <Cpu className="h-6 w-6 text-purple-500" />,
      connections: [0, 2, 4],
      pulse: true,
      active: true,
      description: "Inteligentna analiza danych i przewidywanie potrzeb"
    },
    {
      x: 0.5,
      y: 0.4,
      label: "Automatyzacja Procesów",
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      connections: [0, 1, 3, 4],
      pulse: true,
      active: true,
      description: "Zautomatyzuj powtarzalne zadania i procesy biznesowe"
    },
    {
      x: 0.7,
      y: 0.6,
      label: "Integracja",
      icon: <Layers className="h-6 w-6 text-green-500" />,
      connections: [0, 2, 4],
      pulse: true,
      active: true,
      description: "Bezproblemowa integracja z istniejącymi systemami"
    },
    {
      x: 0.85,
      y: 0.35,
      label: "Chmura",
      icon: <Cloud className="h-6 w-6 text-blue-400" />,
      connections: [1, 2, 3],
      pulse: true,
      active: true,
      description: "Wszystko dostępne w chmurze, z dowolnego miejsca"
    }
  ];

  useEffect(() => {
    // Pokazuje sekcję z opóźnieniem dla efektu
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Funkcja dostosowująca wielkość canvasa
    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };

    // Nasłuchiwanie na zmiany rozmiaru okna
    window.addEventListener('resize', handleResize);
    handleResize();

    // Inicjalizacja cząstek
    for (let i = 0; i < 50; i++) {
      createParticle();
    }

    // Funkcja do tworzenia nowych cząstek
    function createParticle() {
      if (!canvas) return;
      
      const size = Math.random() * 3 + 1;
      const colors = ['rgba(147, 51, 234, 0.3)', 'rgba(59, 130, 246, 0.3)', 'rgba(16, 185, 129, 0.3)'];
      const particle: Particle = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        lifetime: 0,
        maxLifetime: Math.random() * 500 + 500,
      };
      particlesRef.current.push(particle);
    }

    // Główna funkcja animacji
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Rysowanie połączeń między punktami
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      connectionPoints.forEach((point, index) => {
        const x1 = point.x * (canvas?.width || 0);
        const y1 = point.y * (canvas?.height || 0);

        point.connections.forEach(connIndex => {
          const connPoint = connectionPoints[connIndex];
          const x2 = connPoint.x * (canvas?.width || 0);
          const y2 = connPoint.y * (canvas?.height || 0);

          // Aktywne połączenie jest jaśniejsze
          if (activePoint === index || activePoint === connIndex) {
            ctx.strokeStyle = 'rgba(147, 51, 234, 0.5)';
            ctx.lineWidth = 2;
          } else {
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
            ctx.lineWidth = 1;
          }

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        });
      });

      // Aktualizacja i renderowanie cząstek
      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.lifetime += 1;

        // Usunięcie cząstek po zakończeniu ich cyklu życia
        if (p.lifetime >= p.maxLifetime) {
          particlesRef.current.splice(i, 1);
          i--;
          createParticle();
          continue;
        }

        // Ruch cząstek
        p.x += p.vx;
        p.y += p.vy;

        // Zawracanie po dotarciu do krawędzi
        if (p.x < 0 || p.x > (canvas?.width || 0)) p.vx *= -1;
        if (p.y < 0 || p.y > (canvas?.height || 0)) p.vy *= -1;

        // Obliczanie przezroczystości na podstawie cyklu życia
        const alpha = 1 - p.lifetime / p.maxLifetime;
        
        // Rysowanie cząstek
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, alpha + ')');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activePoint]);

  return (
    <section className="relative py-10 md:py-20 overflow-hidden bg-gradient-to-br from-background to-secondary dark:from-background dark:to-secondary/20">
      {/* Animowany gradient w tle */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -inset-[100px] bg-[radial-gradient(60%_60%_at_50%_50%,hsl(var(--gradient-purple))_0%,transparent_70%)] opacity-20 animate-pulse"></div>
        <div className="absolute -inset-[100px] bg-[radial-gradient(40%_40%_at_70%_30%,hsl(var(--gradient-blue))_0%,transparent_70%)] opacity-20 animate-pulse" style={{animationDelay: '-2s'}}></div>
        <div className="absolute -inset-[100px] bg-[radial-gradient(40%_40%_at_30%_70%,hsl(var(--gradient-teal))_0%,transparent_70%)] opacity-10 animate-pulse" style={{animationDelay: '-4s'}}></div>
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          {/* Lewa kolumna z tekstem */}
          <div className="w-full md:w-1/2 space-y-6 mb-16 md:mb-0 stagger-children">
            <div className={`opacity-0 ${isVisible ? 'animate-fade-in' : ''}`}>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="gradient-text translate-y-6 inline-block">Automatyzuj.</span> <span className="block mt-1 translate-y-5 inline-block">Integruj. Skaluj.</span>
              </h1>
            </div>
            <div className={`max-w-xl opacity-0 ${isVisible ? 'animate-slide-up' : ''}`} style={{animationDelay: '0.2s'}}>
              <p className="text-base md:text-lg text-muted-foreground">
                Kompleksowe rozwiązania automatyzacji, które transformują Twój biznes. Wykorzystaj sztuczną inteligencję i zaawansowane algorytmy do optymalizacji procesów biznesowych.
              </p>
            </div>
            <div className={`flex flex-wrap gap-3 md:gap-4 opacity-0 ${isVisible ? 'animate-slide-up' : ''}`} style={{animationDelay: '0.4s'}}>
              <Button 
                size="lg" 
                className="button-3d group text-sm md:text-base"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <span>Rozpocznij transformację</span>
                <ArrowRight className={`ml-1 md:ml-2 h-4 w-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
              </Button>
              <Button size="lg" variant="outline" className="gradient-border text-sm md:text-base">
                Poznaj nasze szablony
              </Button>
            </div>
          </div>

          {/* Prawa kolumna z interaktywną wizualizacją - na mobilnych tylko canvas bez punktów */}
          <div className="w-full md:w-1/2 h-[300px] md:h-[450px] relative">
            <div className="absolute inset-0 z-0">
              <canvas ref={canvasRef} className="w-full h-full" />
            </div>

            {/* Punkty połączeń na canvasie - widoczne tylko powyżej breakpointa md */}
            <div className="absolute inset-0 z-10 hidden md:block">
              {connectionPoints.map((point, index) => (
                <div 
                  key={index}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                    point.pulse 
                      ? 'animate-pulse' 
                      : activePoint === index 
                        ? 'scale-110 transition-transform' 
                        : ''
                  } ${point.active ? 'z-20' : 'z-10'}`}
                  style={{ 
                    left: `${point.x * 100}%`, 
                    top: `${point.y * 100}%`,
                    transition: 'all 0.3s ease-out'
                  }}
                  onMouseEnter={() => setActivePoint(index)}
                  onMouseLeave={() => setActivePoint(null)}
                >
                  <div className={`
                    rounded-full p-3 mb-2
                    ${activePoint === index 
                      ? 'bg-primary shadow-lg shadow-primary/20' 
                      : 'bg-card shadow-md'}
                    transition-all duration-300
                  `}>
                    {point.icon}
                  </div>
                  <div className={`
                    absolute left-1/2 -translate-x-1/2 top-16 w-max max-w-[180px]
                    ${activePoint === index ? 'opacity-100' : 'opacity-0'} 
                    transition-opacity duration-300
                  `}>
                    <div className="glass-card p-3 text-center shadow-xl">
                      <div className="font-semibold text-sm">{point.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">{point.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Uproszczona wersja dla urządzeń mobilnych */}
            <div className="md:hidden absolute inset-x-0 bottom-4 flex justify-center gap-4 z-10">
              {connectionPoints.map((point, index) => (
                <div 
                  key={index}
                  className={`
                    rounded-full p-2 
                    ${'bg-primary shadow-lg shadow-primary/20'}
                    transition-all duration-300
                  `}
                >
                  {point.icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Element dekoracyjny na dole */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
}