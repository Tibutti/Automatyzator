import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const COOKIE_CONSENT_KEY = "automatyzator-cookie-consent";

export interface CookieSettings {
  necessary: boolean;
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
}

export default function CookieConsent() {
  const { t } = useTranslation("common");
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<CookieSettings>({
    necessary: true, // Zawsze włączone
    preferences: false,
    statistics: false,
    marketing: false,
  });

  useEffect(() => {
    // Sprawdzamy, czy użytkownik już dokonał wyboru
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    
    if (!savedConsent) {
      // Jeśli nie ma zapisu w localStorage, pokażmy dialog
      setOpen(true);
    } else {
      // Jeśli jest zapis, wczytaj ustawienia
      setSettings(JSON.parse(savedConsent));
    }
  }, []);

  const saveSettings = (accept: boolean) => {
    // Jeśli użytkownik akceptuje wszystkie, ustawiamy wszystkie na true
    const newSettings = accept
      ? {
          necessary: true,
          preferences: true,
          statistics: true,
          marketing: true,
        }
      : settings;

    // Zapisujemy wybór w localStorage
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newSettings));
    setSettings(newSettings);
    setOpen(false);
  };

  const handleSettingChange = (key: keyof CookieSettings) => {
    if (key === "necessary") return; // Nie możemy zmienić niezbędnych
    
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const openSettings = () => {
    setOpen(true);
  };

  return (
    <>
      {/* Przycisk ustawień plików cookie w stopce */}
      <button
        onClick={openSettings}
        className="text-gray-400 hover:text-white text-sm transition-colors"
        id="cookie-settings-button"
      >
        {t("cookieConsent.settingsButton")}
      </button>

      {/* Dialog z ustawieniami plików cookie */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("cookieConsent.title")}</DialogTitle>
            <DialogDescription>
              {t("cookieConsent.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="necessary">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <span>{t("cookies.essentialTitle")}</span>
                    <div className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full">
                      {t("cookieConsent.alwaysOn")}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    {t("cookies.essentialText")}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Switch id="necessary" checked disabled />
                    <Label htmlFor="necessary">{t("cookieConsent.enabled")}</Label>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="preferences">
                <AccordionTrigger>{t("cookies.preferencesTitle")}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    {t("cookies.preferencesText")}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Switch
                      id="preferences"
                      checked={settings.preferences}
                      onCheckedChange={() => handleSettingChange("preferences")}
                    />
                    <Label htmlFor="preferences">
                      {settings.preferences
                        ? t("cookieConsent.enabled")
                        : t("cookieConsent.disabled")}
                    </Label>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="statistics">
                <AccordionTrigger>{t("cookies.statisticsTitle")}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    {t("cookies.statisticsText")}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Switch
                      id="statistics"
                      checked={settings.statistics}
                      onCheckedChange={() => handleSettingChange("statistics")}
                    />
                    <Label htmlFor="statistics">
                      {settings.statistics
                        ? t("cookieConsent.enabled")
                        : t("cookieConsent.disabled")}
                    </Label>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="marketing">
                <AccordionTrigger>{t("cookies.marketingTitle")}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    {t("cookies.marketingText")}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Switch
                      id="marketing"
                      checked={settings.marketing}
                      onCheckedChange={() => handleSettingChange("marketing")}
                    />
                    <Label htmlFor="marketing">
                      {settings.marketing
                        ? t("cookieConsent.enabled")
                        : t("cookieConsent.disabled")}
                    </Label>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="text-xs text-muted-foreground">
            {t("cookieConsent.learnMore")}{" "}
            <Link href="/cookies" className="text-primary hover:underline">
              {t("cookieConsent.cookiePolicy")}
            </Link>
          </div>

          <DialogFooter className="sm:justify-between flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => saveSettings(false)}>
              {t("cookieConsent.savePreferences")}
            </Button>
            <Button onClick={() => saveSettings(true)}>
              {t("cookieConsent.acceptAll")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Baner na dole ekranu (dla prostszej wersji) */}
      {open && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-border p-4 shadow-lg z-50 md:hidden">
          <div className="container flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold">{t("cookieConsent.bannerTitle")}</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("cookieConsent.bannerText")}
            </p>
            <div className="flex flex-col xs:flex-row gap-2">
              <Button size="sm" onClick={() => saveSettings(true)} className="flex-1">
                {t("cookieConsent.acceptAll")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => saveSettings(false)}
                className="flex-1"
              >
                {t("cookieConsent.essentialOnly")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}