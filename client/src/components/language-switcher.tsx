import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation('common');
  const [open, setOpen] = useState(false);
  
  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    
    // Odśwież wszystkie zapytania API, aby uwzględnić nowy język
    import("@/lib/queryClient").then(module => {
      module.invalidateQueriesOnLanguageChange();
    });
    
    setOpen(false);
  };

  // Określ bieżący język
  const currentLanguage = i18n.language?.substring(0, 2) || "en";
  
  // Mapuj kody języków na pełne nazwy
  const languageNames: Record<string, string> = {
    pl: t('language.pl'),
    en: t('language.en'),
    de: t('language.de'),
    ko: t('language.ko'),
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Zmień język</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => changeLanguage("pl")}
          className={currentLanguage === "pl" ? "bg-accent" : ""}
        >
          🇵🇱 {languageNames.pl}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLanguage("en")}
          className={currentLanguage === "en" ? "bg-accent" : ""}
        >
          🇬🇧 {languageNames.en}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLanguage("de")}
          className={currentLanguage === "de" ? "bg-accent" : ""}
        >
          🇩🇪 {languageNames.de}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLanguage("ko")}
          className={currentLanguage === "ko" ? "bg-accent" : ""}
        >
          🇰🇷 {languageNames.ko || "한국어"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}