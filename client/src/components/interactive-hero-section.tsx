import React, { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Cpu, Database, Search, Zap, Layers, Code } from "lucide-react";
import { useTranslation } from "react-i18next";

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

interface FlowParticle {
  x: number;
  y: number;
  progress: number;   // Postęp od 0 do 1 na linii
  speed: number;      // Prędkość poruszania się po linii
  line: {             // Linia po której porusza się cząstka
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: string;    // Kolor linii/cząstki
  };
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
  const { t } = useTranslation('common');
  const [activePoint, setActivePoint] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const flowParticlesRef = useRef<FlowParticle[]>([]);
  const animationRef = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Punkty połączeń w animacji - ustawione w kształt litery "A"
  const connectionPoints: ConnectionPoint[] = [
    {
      x: 0.3,
      y: 0.8,
      label: t('features.businessData'),
      icon: <Database className="h-6 w-6 text-cyan-500" />,
      connections: [1, 2, 3, 4, 5],
      pulse: true,
      active: true,
      description: t('services.service1.description')
    },
    {
      x: 0.5,
      y: 0.15,
      label: t('features.aiAnalysis'),
      icon: <Cpu className="h-6 w-6 text-red-600" />,
      connections: [0, 2, 3, 4, 5],
      pulse: true,
      active: true,
      description: t('services.service6.description')
    },
    {
      x: 0.4,
      y: 0.5,
      label: t('features.automation'),
      icon: <Zap className="h-6 w-6 text-amber-500" />,
      connections: [0, 1, 3, 4, 5],
      pulse: true,
      active: true,
      description: t('services.service3.description')
    },
    {
      x: 0.7,
      y: 0.8,
      label: t('features.integration'),
      icon: <Layers className="h-6 w-6 text-yellow-500" />,
      connections: [0, 1, 2, 4, 5],
      pulse: true,
      active: true,
      description: t('services.service4.description')
    },
    {
      x: 0.6,
      y: 0.5,
      label: t('features.cloud'),
      icon: <Search className="h-6 w-6 text-sky-500" />,
      connections: [0, 1, 2, 3, 5],
      pulse: true,
      active: true,
      description: t('services.service2.description')
    },
    {
      x: 0.5,
      y: 0.65,
      label: t('features.api'),
      icon: <Code className="h-6 w-6 text-fuchsia-500" />,
      connections: [0, 1, 2, 3, 4],
      pulse: true,
      active: true,
      description: t('services.service5.description')
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
    
    // Funckja tworząca cząstkę płynącą po linii
    function createFlowParticle(x1: number, y1: number, x2: number, y2: number, color: string) {
      // Tworzymy cząstkę na początku linii
      const flowParticle: FlowParticle = {
        x: x1,
        y: y1,
        progress: 0,
        speed: 0.005 + Math.random() * 0.015, // Różne prędkości dla lepszego efektu
        line: {
          x1,
          y1,
          x2,
          y2,
          color
        }
      };
      flowParticlesRef.current.push(flowParticle);
    }

    // Funkcja do tworzenia nowych cząstek tła
    function createParticle() {
      if (!canvas) return;
      
      const size = Math.random() * 3.5 + 1;
      // Dostosowano kolory do naszej zaktualizowanej palety
      const colors = [
        'rgba(14, 165, 233, 0.3)',  // sky-500 (Chmura)
        'rgba(220, 38, 38, 0.3)',   // red-600 (Analiza AI)
        'rgba(234, 179, 8, 0.3)',   // yellow-500 (Integracja) - zmieniony na jasny żółty
        'rgba(245, 158, 11, 0.3)',  // amber-500 (Automatyzacja Procesów)
        'rgba(6, 182, 212, 0.3)',   // cyan-500 (Dane Biznesowe)
        'rgba(217, 70, 239, 0.3)',  // fuchsia-500 (API i Integracje)
      ];
      const particle: Particle = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5, // Zwiększono prędkość dla bardziej dynamicznego efektu
        vy: (Math.random() - 0.5) * 1.5,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        lifetime: 0,
        maxLifetime: Math.random() * 400 + 400, // Zmniejszono czas życia dla szybszych zmian
      };
      particlesRef.current.push(particle);
    }
    
    // Obliczanie optymalnej liczby cząstek na podstawie rozmiaru obszaru
    // Zwiększona gęstość dla większej ilości cząstek
    const calculateParticleCount = () => {
      const density = 1 / 1500; // Zwiększona gęstość (mniejszy dzielnik = więcej cząstek)
      const area = canvas.width * canvas.height;
      return Math.max(40, Math.min(120, Math.floor(area * density))); // Zwiększone wartości min/max
    };
    
    // Funkcja dostosowująca wielkość canvasa
    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        
        // Resetowanie cząstek przy zmianie rozmiaru
        particlesRef.current = [];
        const newParticleCount = calculateParticleCount();
        for (let i = 0; i < newParticleCount; i++) {
          createParticle();
        }
      }
    };

    // Nasłuchiwanie na zmiany rozmiaru okna
    window.addEventListener('resize', handleResize);
    handleResize(); // Inicjalizacja rozmiaru i cząstek

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

          let currentLineColor = 'rgba(148, 163, 184, 0.15)';

          // Aktywne połączenie jest jaśniejsze i w kolorze odpowiadającym ikonie
          if (activePoint === index || activePoint === connIndex) {
            // Wybieramy kolor linii na podstawie aktywnego punktu
            switch (activePoint) {
              case 0: // Dane Biznesowe - cyan
                currentLineColor = 'rgba(6, 182, 212, 0.5)'; 
                break;
              case 1: // Analiza AI - red-600
                currentLineColor = 'rgba(220, 38, 38, 0.5)'; 
                break;
              case 2: // Automatyzacja Procesów - amber
                currentLineColor = 'rgba(245, 158, 11, 0.5)'; 
                break;
              case 3: // Integracja - yellow-500
                currentLineColor = 'rgba(234, 179, 8, 0.5)'; 
                break;
              case 4: // Chmura - sky-500
                currentLineColor = 'rgba(14, 165, 233, 0.5)'; 
                break;
              case 5: // API i Integracje - fuchsia
                currentLineColor = 'rgba(217, 70, 239, 0.5)';
                break;
              default:
                currentLineColor = 'rgba(147, 51, 234, 0.5)'; // Domyślny kolor
            }
            ctx.strokeStyle = currentLineColor;
            ctx.lineWidth = 2;
            
            // Tworzymy cząstki płynące po linii, jeśli punkt jest aktywny i jest mało cząstek
            if (Math.random() < 0.1 && flowParticlesRef.current.length < 50) {
              // Losowo określamy kierunek przepływu (od punktu aktywnego do połączonego lub odwrotnie)
              const fromX = activePoint === index ? x1 : x2;
              const fromY = activePoint === index ? y1 : y2;
              const toX = activePoint === index ? x2 : x1;
              const toY = activePoint === index ? y2 : y1;
              
              createFlowParticle(fromX, fromY, toX, toY, currentLineColor);
            }
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

      // Aktualizacja i renderowanie cząstek płynących po liniach
      for (let i = 0; i < flowParticlesRef.current.length; i++) {
        const p = flowParticlesRef.current[i];
        p.progress += p.speed;
        
        // Obliczanie pozycji cząstki na linii na podstawie postępu
        p.x = p.line.x1 + (p.line.x2 - p.line.x1) * p.progress;
        p.y = p.line.y1 + (p.line.y2 - p.line.y1) * p.progress;
        
        // Usunięcie cząstki, gdy dotrze do końca linii lub jeśli nie ma aktywnego punktu
        if (p.progress >= 1 || activePoint === null) {
          flowParticlesRef.current.splice(i, 1);
          i--;
          continue;
        }
        
        // Renderowanie cząstki płynącej po linii (jako jaśniejszy, mniejszy punkt)
        ctx.fillStyle = p.line.color.replace('0.5', '0.8'); // Zwiększamy jasność
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Dodajemy "ogon" cząstki dla lepszego efektu płynięcia
        ctx.fillStyle = p.line.color.replace('0.5', '0.4');
        ctx.beginPath();
        ctx.arc(p.x - (p.line.x2 - p.line.x1) * 0.01, p.y - (p.line.y2 - p.line.y1) * 0.01, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Aktualizacja i renderowanie zwykłych cząstek tła
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

        // Sprawdzenie czy istnieje aktywny punkt, do którego cząstki powinny być przyciągane
        if (activePoint !== null) {
          const point = connectionPoints[activePoint];
          const attractX = point.x * (canvas?.width || 0);
          const attractY = point.y * (canvas?.height || 0);

          // Obliczenie wektora przyciągania
          const dx = attractX - p.x;
          const dy = attractY - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Siła przyciągania maleje wraz z odległością
          if (distance < 150) {
            const force = 0.02; // Siła przyciągania
            p.vx += (dx / distance) * force;
            p.vy += (dy / distance) * force;
          }
        }

        // Ruch cząstek
        p.x += p.vx;
        p.y += p.vy;

        // Ograniczenie maksymalnej prędkości cząstek
        const maxSpeed = 2;
        const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (currentSpeed > maxSpeed) {
          p.vx = (p.vx / currentSpeed) * maxSpeed;
          p.vy = (p.vy / currentSpeed) * maxSpeed;
        }

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
                <span className="gradient-text translate-y-6 inline-block">{t('hero.title')}</span> 
                <span className="block mt-1 translate-y-5 inline-block">
                  {t('hero.subtitle').split('.')[0]}.{' '}
                  <span className="text-accent">{t('hero.subtitle').split('.')[1]}.</span>
                </span>
              </h1>
            </div>
            <div className={`max-w-xl opacity-0 ${isVisible ? 'animate-slide-up' : ''}`} style={{animationDelay: '0.2s'}}>
              <p className="text-base md:text-lg text-muted-foreground">
                {t('hero.description')}
              </p>
            </div>
            <div className={`flex flex-wrap gap-3 md:gap-4 opacity-0 ${isVisible ? 'animate-slide-up' : ''}`} style={{animationDelay: '0.4s'}}>
              <Link href="/why-us">
                <Button 
                  size="lg" 
                  className="button-3d group text-sm md:text-base whitespace-nowrap"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <span className="whitespace-nowrap">{t('whyUs.title')}</span>
                  <ArrowRight className={`ml-1 md:ml-2 h-4 w-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                </Button>
              </Link>
              <Link href="/consultation">
                <Button size="lg" variant="outline" className="gradient-border text-sm md:text-base">
                  {t('hero.cta')}
                </Button>
              </Link>
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
                    rounded-full p-3 mb-2 border-2 border-slate-400 dark:border-slate-500
                    ${activePoint === index 
                      ? 'bg-primary shadow-lg shadow-primary/20' 
                      : 'bg-card shadow-md'}
                    transition-all duration-300
                  `}>
                    <div className={`transition-transform duration-700 ${activePoint === index ? 'animate-spin-slow' : ''}`}>
                      {point.icon}
                    </div>
                  </div>
                  <div className={`
                    absolute w-max max-w-[180px]
                    ${activePoint === index ? 'opacity-100' : 'opacity-0'} 
                    transition-opacity duration-300
                    ${index === 2 ? 'right-full mr-4 top-0' : // Automatyzacja Procesów - po lewej
                     index === 4 ? 'left-full ml-4 top-0' : // Chmura - po prawej
                     'left-1/2 -translate-x-1/2 top-16'} // pozostałe - pod elementem
                  `}>
                    <div className="glass-card p-3 text-center shadow-xl">
                      <div className="font-semibold text-sm">{point.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">{point.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Responsywna wersja dla urządzeń mobilnych - dokładnie ten sam układ w kształt litery "A" */}
            <div className="md:hidden absolute inset-0 z-10">
              {connectionPoints.map((point, index) => (
                <div 
                  key={index}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                    activePoint === index ? 'scale-110' : ''
                  } z-20`}
                  style={{ 
                    left: `${point.x * 100}%`, 
                    top: `${point.y * 100}%`,
                    transition: 'all 0.3s ease-out'
                  }}
                  onClick={() => setActivePoint(activePoint === index ? null : index)}
                >
                  <div className={`
                    rounded-full p-1.5 mb-1 border-2 border-slate-400 dark:border-slate-500
                    ${activePoint === index 
                      ? 'bg-primary shadow-lg shadow-primary/20' 
                      : 'bg-card shadow-md'}
                    transition-all duration-300
                  `}>
                    {/* Zmniejszamy odrobinę ikonki na mobile dla lepszej czytelności */}
                    <div className={`h-4 w-4 transition-transform duration-700 ${activePoint === index ? 'animate-spin-slow' : ''}`}>
                      {point.icon}
                    </div>
                  </div>
                  <div className="text-[10px] font-medium w-16 text-center -ml-[12px]">{point.label}</div>
                </div>
              ))}
              
              {/* Modal z pełnym opisem po kliknięciu */}
              {activePoint !== null && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" 
                     onClick={() => setActivePoint(null)}>
                  <div className="glass-card p-4 rounded-lg shadow-2xl max-w-[90vw] text-center"
                       onClick={(e) => e.stopPropagation()}>
                    <div className="font-semibold mb-2">{connectionPoints[activePoint].label}</div>
                    <div className="text-sm text-muted-foreground">{connectionPoints[activePoint].description}</div>
                    <Link href="/why-us">
                      <Button className="mt-4 whitespace-nowrap" size="sm" onClick={() => setActivePoint(null)}>
                        <span className="whitespace-nowrap">{t('blog.readMore')}</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Element dekoracyjny na dole */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
}