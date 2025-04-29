import { useEffect, useState } from "react";

export default function Logo() {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    // Uruchamiamy animację po załadowaniu komponentu
    setAnimate(true);
    
    // Ustawiamy interwał aby powtarzać animację co 10 sekund
    const interval = setInterval(() => {
      setAnimate(false);
      // Wprowadzamy małe opóźnienie przed ponownym włączeniem animacji
      setTimeout(() => setAnimate(true), 200);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-10 h-10 md:w-12 md:h-12 relative flex items-center justify-center">
      {/* Pierścień automatyzacji z gradientem */}
      <div className={`absolute inset-0 rounded-full 
        bg-gradient-to-r from-primary to-accent overflow-hidden
        ${animate ? 'animate-glow' : ''}
      `}>
        <div className="absolute inset-[2px] bg-card rounded-full"></div>
      </div>
      
      {/* Wewnętrzny mechanizm */}
      <div className="relative w-full h-full flex items-center justify-center">
        <svg 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5"
        >
          {/* Trzy zębatki symbolizujące automatyzację */}
          <g className={`transition-transform duration-1000 ${animate ? 'rotate-180' : 'rotate-0'}`}>
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M20 11C17.2386 11 15 8.76142 15 6C15 5.59387 15.0487 5.19815 15.1409 4.81935C15.0489 4.79279 14.9562 4.76699 14.8627 4.74197C14.151 4.54513 13.4008 4.44444 12.6316 4.44444C9.52814 4.44444 7 6.97258 7 10.0761C7 13.1796 9.52814 15.7077 12.6316 15.7077C13.4008 15.7077 14.151 15.607 14.8627 15.4102C14.9562 15.3852 15.0489 15.3594 15.1409 15.3328C15.0487 14.954 15 14.5583 15 14.1522C15 11.3908 17.2386 9.15217 20 9.15217C22.7614 9.15217 25 11.3908 25 14.1522C25 14.5583 24.9513 14.954 24.8591 15.3328C24.9511 15.3594 25.0438 15.3852 25.1373 15.4102C25.849 15.607 26.5992 15.7077 27.3684 15.7077C30.4719 15.7077 33 13.1796 33 10.0761C33 6.97258 30.4719 4.44444 27.3684 4.44444C26.5992 4.44444 25.849 4.54513 25.1373 4.74197C25.0438 4.76699 24.9511 4.79279 24.8591 4.81935C24.9513 5.19815 25 5.59387 25 6C25 8.76142 22.7614 11 20 11Z" 
              className="fill-primary"
            />
          </g>
          
          {/* Centralna zębatka */}
          <g className={`transition-transform duration-1000 ease-in-out ${animate ? '-rotate-360' : 'rotate-0'}`}>
            <circle cx="20" cy="20" r="8" className="fill-accent" />
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M20 25C22.7614 25 25 22.7614 25 20C25 19.5939 24.9513 19.1981 24.8591 18.8194C24.9511 18.7928 25.0438 18.767 25.1373 18.742C25.849 18.5451 26.5992 18.4444 27.3684 18.4444C30.4719 18.4444 33 20.9726 33 24.0761C33 27.1795 30.4719 29.7077 27.3684 29.7077C26.5992 29.7077 25.849 29.607 25.1373 29.4102C25.0438 29.3852 24.9511 29.3594 24.8591 29.3328C24.9513 28.954 25 28.5583 25 28.1522C25 25.3908 22.7614 23.1522 20 23.1522C17.2386 23.1522 15 25.3908 15 28.1522C15 28.5583 15.0487 28.954 15.1409 29.3328C15.0489 29.3594 14.9562 29.3852 14.8627 29.4102C14.151 29.607 13.4008 29.7077 12.6316 29.7077C9.52814 29.7077 7 27.1795 7 24.0761C7 20.9726 9.52814 18.4444 12.6316 18.4444C13.4008 18.4444 14.151 18.5451 14.8627 18.742C14.9562 18.767 15.0489 18.7928 15.1409 18.8194C15.0487 19.1981 15 19.5939 15 20C15 22.7614 17.2386 25 20 25Z" 
              className="fill-primary"
            />
          </g>
          
          {/* A jako symbol Automatyzatora, umieszczone w środku */}
          <text 
            x="20" 
            y="24" 
            fontSize="12" 
            fontWeight="bold" 
            fill="currentColor" 
            className="text-card-foreground"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            A
          </text>
        </svg>
      </div>
      
      {/* Pulsująca kropka symbolizująca aktywność */}
      <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-gradient-to-br from-accent to-accent/80 rounded-full animate-pulse"></div>
    </div>
  );
}
