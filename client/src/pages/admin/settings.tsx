import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import AdminLayout from "@/components/admin/admin-layout";
import ProtectedRoute from "@/components/admin/protected-route";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Settings,
  Globe,
  Key,
  FileText,
  Languages,
  BarChart3,
  Save,
  Mail,
  HardDrive,
  Palette,
  Database,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const siteSettingsSchema = z.object({
  siteName: z.string().min(2, "Nazwa strony musi mieć co najmniej 2 znaki"),
  siteDescription: z.string().min(10, "Opis strony musi mieć co najmniej 10 znaków"),
  contactEmail: z.string().email("Podaj prawidłowy adres email"),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  facebookUrl: z.string().url("Podaj prawidłowy URL").optional().or(z.literal("")),
  twitterUrl: z.string().url("Podaj prawidłowy URL").optional().or(z.literal("")),
  instagramUrl: z.string().url("Podaj prawidłowy URL").optional().or(z.literal("")),
  linkedinUrl: z.string().url("Podaj prawidłowy URL").optional().or(z.literal("")),
  youtubeUrl: z.string().url("Podaj prawidłowy URL").optional().or(z.literal("")),
  footerText: z.string().optional(),
});

const accountSettingsSchema = z.object({
  username: z.string().min(3, "Nazwa użytkownika musi mieć co najmniej 3 znaki"),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków").optional(),
  confirmPassword: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email("Podaj prawidłowy adres email"),
  profileImage: z.string().url("Podaj prawidłowy URL obrazu").optional().or(z.literal("")),
}).refine(data => !data.newPassword || data.newPassword === data.confirmPassword, {
  message: "Hasła nie pasują do siebie",
  path: ["confirmPassword"],
}).refine(data => !data.newPassword || data.currentPassword, {
  message: "Aktualne hasło jest wymagane do zmiany hasła",
  path: ["currentPassword"],
});

const apiSettingsSchema = z.object({
  openaiApiKey: z.string().min(1, "Klucz API jest wymagany"),
  stripePublicKey: z.string().min(1, "Klucz publiczny Stripe jest wymagany"),
  stripeSecretKey: z.string().min(1, "Klucz prywatny Stripe jest wymagany"),
  chatbotEnabled: z.boolean(),
  chatbotName: z.string().min(1, "Nazwa chatbota jest wymagana"),
  paymentEnabled: z.boolean(),
  supportedCurrencies: z.string(),
});

const interfaceSettingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  accentColor: z.enum(["blue", "green", "purple", "orange", "pink"]),
  sidebarCompact: z.boolean(),
  itemsPerPage: z.number().min(5).max(100),
  tableLayout: z.enum(["compact", "default", "spacious"]),
  animations: z.boolean(),
  showWelcomeMessage: z.boolean(),
  customizeAdminHome: z.boolean(),
  dashboardLayout: z.enum(["grid", "list", "cards"]),
  useSystemFont: z.boolean(),
});

const languageSettingsSchema = z.object({
  defaultLanguage: z.enum(["pl", "en", "de", "ko"]),
  enableEnglish: z.boolean(),
  enablePolish: z.boolean(),
  enableGerman: z.boolean(),
  enableKorean: z.boolean(),
  autoDetectLanguage: z.boolean(),
});

const analyticsSettingsSchema = z.object({
  googleAnalyticsId: z.string().optional(),
  facebookPixelId: z.string().optional(),
  enableAnalytics: z.boolean(),
  anonymizeIp: z.boolean(),
  sendDailyReports: z.boolean(),
  sendWeeklyReports: z.boolean(),
  reportEmail: z.string().email("Podaj prawidłowy adres email"),
});

const backupSettingsSchema = z.object({
  autoBackup: z.boolean(),
  backupFrequency: z.enum(["daily", "weekly", "monthly"]),
  maxBackups: z.number().min(1, "Minimalna liczba kopii zapasowych to 1"),
  includeMedia: z.boolean(),
  backupLocation: z.enum(["local", "cloud"]),
});

type SettingsSection = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  active?: boolean;
};

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("account");

  const settingsSections: SettingsSection[] = [
    {
      id: "account",
      title: "Konto",
      description: "Zarządzaj swoim kontem administratora",
      icon: <User className="h-5 w-5" />,
      active: true,
    },
    {
      id: "site",
      title: "Strona",
      description: "Informacje i ustawienia strony",
      icon: <Globe className="h-5 w-5" />,
    },
    {
      id: "api",
      title: "API i integracje",
      description: "Ustawienia kluczy API i integracji",
      icon: <Key className="h-5 w-5" />,
    },
    {
      id: "content",
      title: "Zawartość",
      description: "Zarządzanie kategoriami i tagami",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      id: "language",
      title: "Język",
      description: "Ustawienia języków strony",
      icon: <Languages className="h-5 w-5" />,
    },
    {
      id: "analytics",
      title: "Analityka",
      description: "Integracja z narzędziami analitycznymi",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      id: "backup",
      title: "Kopie zapasowe",
      description: "Zarządzanie kopiami zapasowymi",
      icon: <Database className="h-5 w-5" />,
    },
    {
      id: "communications",
      title: "Komunikacja",
      description: "Szablony wiadomości email",
      icon: <Mail className="h-5 w-5" />,
    },
    {
      id: "media",
      title: "Pliki",
      description: "Zarządzanie plikami multimedialnymi",
      icon: <HardDrive className="h-5 w-5" />,
    },
    {
      id: "interface",
      title: "Interfejs",
      description: "Dostosowanie wyglądu panelu",
      icon: <Palette className="h-5 w-5" />,
    },
  ];

  const accountForm = useForm<z.infer<typeof accountSettingsSchema>>({
    resolver: zodResolver(accountSettingsSchema),
    defaultValues: {
      username: user?.username || "",
      name: "",
      email: "",
      profileImage: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const siteForm = useForm<z.infer<typeof siteSettingsSchema>>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteName: "Automatyzator",
      siteDescription: "Automatyzuj. Integruj. Skaluj.",
      contactEmail: "kontakt@automatyzator.com",
      contactPhone: "+48 123 456 789",
      address: "ul. Przykładowa 123, 00-000 Warszawa",
      facebookUrl: "https://facebook.com/automatyzator",
      twitterUrl: "",
      instagramUrl: "",
      linkedinUrl: "",
      youtubeUrl: "",
      footerText: "© 2025 Automatyzator. Wszelkie prawa zastrzeżone.",
    },
  });

  const apiForm = useForm<z.infer<typeof apiSettingsSchema>>({
    resolver: zodResolver(apiSettingsSchema),
    defaultValues: {
      openaiApiKey: "",
      stripePublicKey: "",
      stripeSecretKey: "",
      chatbotEnabled: true,
      chatbotName: "AutomatyBot",
      paymentEnabled: true,
      supportedCurrencies: "PLN,EUR,USD",
    },
  });

  const languageForm = useForm<z.infer<typeof languageSettingsSchema>>({
    resolver: zodResolver(languageSettingsSchema),
    defaultValues: {
      defaultLanguage: "pl",
      enableEnglish: true,
      enablePolish: true,
      enableGerman: true,
      enableKorean: true,
      autoDetectLanguage: true,
    },
  });

  const analyticsForm = useForm<z.infer<typeof analyticsSettingsSchema>>({
    resolver: zodResolver(analyticsSettingsSchema),
    defaultValues: {
      googleAnalyticsId: "",
      facebookPixelId: "",
      enableAnalytics: true,
      anonymizeIp: true,
      sendDailyReports: false,
      sendWeeklyReports: true,
      reportEmail: "",
    },
  });

  const backupForm = useForm<z.infer<typeof backupSettingsSchema>>({
    resolver: zodResolver(backupSettingsSchema),
    defaultValues: {
      autoBackup: true,
      backupFrequency: "weekly",
      maxBackups: 5,
      includeMedia: true,
      backupLocation: "local",
    },
  });

  const interfaceForm = useForm<z.infer<typeof interfaceSettingsSchema>>({
    resolver: zodResolver(interfaceSettingsSchema),
    defaultValues: {
      theme: "system",
      accentColor: "blue",
      sidebarCompact: false,
      itemsPerPage: 20,
      tableLayout: "default",
      animations: true,
      showWelcomeMessage: true,
      customizeAdminHome: false,
      dashboardLayout: "grid",
      useSystemFont: false,
    },
  });

  const onAccountSubmit = (data: z.infer<typeof accountSettingsSchema>) => {
    toast({
      title: "Zaktualizowano ustawienia konta",
      description: "Zmiany zostały zapisane.",
    });
  };

  const onSiteSubmit = (data: z.infer<typeof siteSettingsSchema>) => {
    toast({
      title: "Zaktualizowano ustawienia strony",
      description: "Zmiany zostały zapisane.",
    });
  };

  const onApiSubmit = (data: z.infer<typeof apiSettingsSchema>) => {
    toast({
      title: "Zaktualizowano ustawienia API",
      description: "Zmiany zostały zapisane.",
    });
  };

  const onLanguageSubmit = (data: z.infer<typeof languageSettingsSchema>) => {
    toast({
      title: "Zaktualizowano ustawienia językowe",
      description: "Zmiany zostały zapisane.",
    });
  };

  const onAnalyticsSubmit = (data: z.infer<typeof analyticsSettingsSchema>) => {
    toast({
      title: "Zaktualizowano ustawienia analityki",
      description: "Zmiany zostały zapisane.",
    });
  };

  const onBackupSubmit = (data: z.infer<typeof backupSettingsSchema>) => {
    toast({
      title: "Zaktualizowano ustawienia kopii zapasowej",
      description: "Zmiany zostały zapisane.",
    });
  };

  const onInterfaceSubmit = (data: z.infer<typeof interfaceSettingsSchema>) => {
    toast({
      title: "Zaktualizowano ustawienia interfejsu",
      description: "Zmiany zostały zapisane.",
    });
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Ustawienia</h1>
            <p className="text-muted-foreground mt-2">
              Zarządzaj ustawieniami swojej strony i panelu administratora.
            </p>
          </div>

          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5">
              <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 overflow-auto pb-4 lg:pb-0">
                {settingsSections.map((section) => (
                  <Button
                    key={section.id}
                    variant={activeTab === section.id ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => setActiveTab(section.id)}
                  >
                    {section.icon}
                    <span className="ml-2">{section.title}</span>
                  </Button>
                ))}
              </nav>
            </aside>
            <div className="flex-1 lg:max-w-3xl">
              {activeTab === "account" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Ustawienia konta</CardTitle>
                    <CardDescription>
                      Zarządzaj swoim kontem administratora i danymi osobowymi.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...accountForm}>
                      <form
                        onSubmit={accountForm.handleSubmit(onAccountSubmit)}
                        className="space-y-8"
                      >
                        <FormField
                          control={accountForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Imię i nazwisko</FormLabel>
                              <FormControl>
                                <Input placeholder="Jan Kowalski" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={accountForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nazwa użytkownika</FormLabel>
                              <FormControl>
                                <Input placeholder="jankowalski" {...field} />
                              </FormControl>
                              <FormDescription>
                                Używana do logowania do panelu.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={accountForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="jan@example.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={accountForm.control}
                          name="profileImage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>URL zdjęcia profilowego</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://example.com/avatar.jpg"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Zmiana hasła</h3>
                          <FormField
                            control={accountForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Aktualne hasło</FormLabel>
                                <FormControl>
                                  <Input
                                    type="password"
                                    placeholder="••••••••"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={accountForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nowe hasło</FormLabel>
                                <FormControl>
                                  <Input
                                    type="password"
                                    placeholder="••••••••"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={accountForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Potwierdź nowe hasło</FormLabel>
                                <FormControl>
                                  <Input
                                    type="password"
                                    placeholder="••••••••"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button type="submit">
                          <Save className="mr-2 h-4 w-4" /> Zapisz zmiany
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}

              {activeTab === "site" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Ustawienia strony</CardTitle>
                    <CardDescription>
                      Dostosuj podstawowe informacje widoczne na stronie.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...siteForm}>
                      <form
                        onSubmit={siteForm.handleSubmit(onSiteSubmit)}
                        className="space-y-8"
                      >
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Informacje o firmie</h3>
                          <FormField
                            control={siteForm.control}
                            name="siteName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nazwa strony</FormLabel>
                                <FormControl>
                                  <Input placeholder="Automatyzator" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={siteForm.control}
                            name="siteDescription"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Opis strony</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Krótki opis widoczny w wyszukiwarkach"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={siteForm.control}
                            name="contactEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email kontaktowy</FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="kontakt@automatyzator.com"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={siteForm.control}
                            name="contactPhone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Telefon kontaktowy</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="+48 123 456 789"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={siteForm.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Adres</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="ul. Przykładowa 123, 00-000 Warszawa"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Media społecznościowe</h3>
                          <FormField
                            control={siteForm.control}
                            name="facebookUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Facebook URL</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="https://facebook.com/automatyzator"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={siteForm.control}
                            name="twitterUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Twitter URL</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="https://twitter.com/automatyzator"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={siteForm.control}
                            name="instagramUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Instagram URL</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="https://instagram.com/automatyzator"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={siteForm.control}
                            name="linkedinUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>LinkedIn URL</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="https://linkedin.com/company/automatyzator"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={siteForm.control}
                            name="youtubeUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>YouTube URL</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="https://youtube.com/c/automatyzator"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Stopka</h3>
                          <FormField
                            control={siteForm.control}
                            name="footerText"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tekst w stopce</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="© 2025 Automatyzator. Wszelkie prawa zastrzeżone."
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button type="submit">
                          <Save className="mr-2 h-4 w-4" /> Zapisz zmiany
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}

              {activeTab === "api" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Ustawienia API i integracji</CardTitle>
                    <CardDescription>
                      Zarządzaj kluczami API i integracjami z zewnętrznymi serwisami.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...apiForm}>
                      <form
                        onSubmit={apiForm.handleSubmit(onApiSubmit)}
                        className="space-y-8"
                      >
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">OpenAI</h3>
                          <FormField
                            control={apiForm.control}
                            name="openaiApiKey"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Klucz API OpenAI</FormLabel>
                                <FormControl>
                                  <Input
                                    type="password"
                                    placeholder="sk-..."
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Wymagany do działania chatbota na stronie.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={apiForm.control}
                            name="chatbotEnabled"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Włącz chatbota
                                  </FormLabel>
                                  <FormDescription>
                                    Widget chatbota będzie widoczny na stronie.
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={apiForm.control}
                            name="chatbotName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nazwa chatbota</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="AutomatyBot"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Stripe</h3>
                          <FormField
                            control={apiForm.control}
                            name="stripePublicKey"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Klucz publiczny Stripe</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="pk_test_..."
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={apiForm.control}
                            name="stripeSecretKey"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Klucz prywatny Stripe</FormLabel>
                                <FormControl>
                                  <Input
                                    type="password"
                                    placeholder="sk_test_..."
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={apiForm.control}
                            name="paymentEnabled"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Włącz płatności
                                  </FormLabel>
                                  <FormDescription>
                                    Możliwość dokonywania płatności za szablony.
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={apiForm.control}
                            name="supportedCurrencies"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Obsługiwane waluty</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="PLN,EUR,USD"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Oddzielone przecinkami
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button type="submit">
                          <Save className="mr-2 h-4 w-4" /> Zapisz zmiany
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}

              {activeTab === "content" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Ustawienia zawartości</CardTitle>
                    <CardDescription>
                      Zarządzaj kategoriami, tagami i innymi elementami zawartości.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-8">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Kategorie blogowe</h3>
                        <div className="grid gap-4">
                          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <div className="font-medium">Automatyzacja</div>
                              <div className="text-sm text-muted-foreground">
                                12 artykułów
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Edytuj</span>
                                <span className="h-4 w-4">✎</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                                <span className="sr-only">Usuń</span>
                                <span className="h-4 w-4">✕</span>
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <div className="font-medium">Integracje</div>
                              <div className="text-sm text-muted-foreground">
                                8 artykułów
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Edytuj</span>
                                <span className="h-4 w-4">✎</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                                <span className="sr-only">Usuń</span>
                                <span className="h-4 w-4">✕</span>
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <div className="font-medium">Procesy biznesowe</div>
                              <div className="text-sm text-muted-foreground">
                                5 artykułów
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Edytuj</span>
                                <span className="h-4 w-4">✎</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                                <span className="sr-only">Usuń</span>
                                <span className="h-4 w-4">✕</span>
                              </Button>
                            </div>
                          </div>
                          <div className="flex rounded-lg border border-dashed p-3">
                            <Button variant="ghost" className="w-full">
                              <span className="text-muted-foreground">+ Dodaj nową kategorię</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Tagi</h3>
                        <div className="flex flex-wrap gap-2">
                          <div className="flex items-center rounded-full bg-secondary px-3 py-1 text-sm">
                            Automatyzacja
                            <Button variant="ghost" size="sm" className="ml-1 h-5 w-5 p-0 text-muted-foreground hover:text-foreground">
                              <span className="sr-only">Usuń</span>
                              <span className="h-3 w-3">✕</span>
                            </Button>
                          </div>
                          <div className="flex items-center rounded-full bg-secondary px-3 py-1 text-sm">
                            RPA
                            <Button variant="ghost" size="sm" className="ml-1 h-5 w-5 p-0 text-muted-foreground hover:text-foreground">
                              <span className="sr-only">Usuń</span>
                              <span className="h-3 w-3">✕</span>
                            </Button>
                          </div>
                          <div className="flex items-center rounded-full bg-secondary px-3 py-1 text-sm">
                            Integracje
                            <Button variant="ghost" size="sm" className="ml-1 h-5 w-5 p-0 text-muted-foreground hover:text-foreground">
                              <span className="sr-only">Usuń</span>
                              <span className="h-3 w-3">✕</span>
                            </Button>
                          </div>
                          <div className="flex items-center rounded-full bg-secondary px-3 py-1 text-sm">
                            API
                            <Button variant="ghost" size="sm" className="ml-1 h-5 w-5 p-0 text-muted-foreground hover:text-foreground">
                              <span className="sr-only">Usuń</span>
                              <span className="h-3 w-3">✕</span>
                            </Button>
                          </div>
                          <div className="flex items-center rounded-full bg-secondary px-3 py-1 text-sm">
                            Szablony
                            <Button variant="ghost" size="sm" className="ml-1 h-5 w-5 p-0 text-muted-foreground hover:text-foreground">
                              <span className="sr-only">Usuń</span>
                              <span className="h-3 w-3">✕</span>
                            </Button>
                          </div>
                          <div className="flex items-center rounded-full border border-dashed px-3 py-1 text-sm text-muted-foreground">
                            + Dodaj nowy tag
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Kategorie szablonów</h3>
                        <div className="grid gap-4">
                          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <div className="font-medium">Obieg dokumentów</div>
                              <div className="text-sm text-muted-foreground">
                                4 szablony
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Edytuj</span>
                                <span className="h-4 w-4">✎</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                                <span className="sr-only">Usuń</span>
                                <span className="h-4 w-4">✕</span>
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <div className="font-medium">Integracje z CRM</div>
                              <div className="text-sm text-muted-foreground">
                                6 szablonów
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Edytuj</span>
                                <span className="h-4 w-4">✎</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                                <span className="sr-only">Usuń</span>
                                <span className="h-4 w-4">✕</span>
                              </Button>
                            </div>
                          </div>
                          <div className="flex rounded-lg border border-dashed p-3">
                            <Button variant="ghost" className="w-full">
                              <span className="text-muted-foreground">+ Dodaj nową kategorię</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>
                      <Save className="mr-2 h-4 w-4" /> Zapisz zmiany
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {activeTab === "language" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Ustawienia językowe</CardTitle>
                    <CardDescription>
                      Zarządzaj dostępnymi językami i tłumaczeniami.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...languageForm}>
                      <form
                        onSubmit={languageForm.handleSubmit(onLanguageSubmit)}
                        className="space-y-8"
                      >
                        <FormField
                          control={languageForm.control}
                          name="defaultLanguage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Domyślny język</FormLabel>
                              <FormControl>
                                <select
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  value={field.value}
                                  onChange={(e) => field.onChange(e.target.value as "pl" | "en" | "de" | "ko")}
                                >
                                  <option value="pl">Polski</option>
                                  <option value="en">Angielski</option>
                                  <option value="de">Niemiecki</option>
                                  <option value="ko">Koreański</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={languageForm.control}
                          name="enablePolish"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Język polski
                                </FormLabel>
                                <FormDescription>
                                  Włącz język polski na stronie
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={languageForm.control}
                          name="enableEnglish"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Język angielski
                                </FormLabel>
                                <FormDescription>
                                  Włącz język angielski na stronie
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={languageForm.control}
                          name="enableGerman"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Język niemiecki
                                </FormLabel>
                                <FormDescription>
                                  Włącz język niemiecki na stronie
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={languageForm.control}
                          name="enableKorean"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Język koreański
                                </FormLabel>
                                <FormDescription>
                                  Włącz język koreański na stronie
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={languageForm.control}
                          name="autoDetectLanguage"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Automatyczne wykrywanie języka
                                </FormLabel>
                                <FormDescription>
                                  Automatycznie wykrywaj język użytkownika
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button type="submit">
                          <Save className="mr-2 h-4 w-4" /> Zapisz zmiany
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}

              {activeTab === "analytics" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Ustawienia analityki</CardTitle>
                    <CardDescription>
                      Zarządzaj narzędziami analitycznymi i raportami.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...analyticsForm}>
                      <form
                        onSubmit={analyticsForm.handleSubmit(onAnalyticsSubmit)}
                        className="space-y-8"
                      >
                        <FormField
                          control={analyticsForm.control}
                          name="googleAnalyticsId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ID Google Analytics</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="G-XXXXXXXXXX lub UA-XXXXXXXXX-X"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={analyticsForm.control}
                          name="facebookPixelId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ID Facebook Pixel</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="XXXXXXXXXXXX"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={analyticsForm.control}
                          name="enableAnalytics"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Włącz analitykę
                                </FormLabel>
                                <FormDescription>
                                  Zbieraj dane analityczne o ruchu na stronie
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={analyticsForm.control}
                          name="anonymizeIp"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Anonimizuj adresy IP
                                </FormLabel>
                                <FormDescription>
                                  Anonimizuj adresy IP użytkowników (zgodnie z RODO)
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Raporty</h3>
                          <FormField
                            control={analyticsForm.control}
                            name="reportEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email do raportów</FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="raporty@automatyzator.com"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={analyticsForm.control}
                            name="sendDailyReports"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Raporty dzienne
                                  </FormLabel>
                                  <FormDescription>
                                    Wysyłaj codzienne raporty z analityki
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={analyticsForm.control}
                            name="sendWeeklyReports"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Raporty tygodniowe
                                  </FormLabel>
                                  <FormDescription>
                                    Wysyłaj tygodniowe raporty z analityki
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button type="submit">
                          <Save className="mr-2 h-4 w-4" /> Zapisz zmiany
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}

              {activeTab === "backup" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Ustawienia kopii zapasowych</CardTitle>
                    <CardDescription>
                      Zarządzaj automatycznymi kopiami zapasowymi bazy danych.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...backupForm}>
                      <form
                        onSubmit={backupForm.handleSubmit(onBackupSubmit)}
                        className="space-y-8"
                      >
                        <FormField
                          control={backupForm.control}
                          name="autoBackup"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Automatyczne kopie zapasowe
                                </FormLabel>
                                <FormDescription>
                                  Twórz automatyczne kopie zapasowe bazy danych
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={backupForm.control}
                          name="backupFrequency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Częstotliwość</FormLabel>
                              <FormControl>
                                <select
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  value={field.value}
                                  onChange={(e) => field.onChange(e.target.value as "daily" | "weekly" | "monthly")}
                                >
                                  <option value="daily">Codziennie</option>
                                  <option value="weekly">Co tydzień</option>
                                  <option value="monthly">Co miesiąc</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={backupForm.control}
                          name="maxBackups"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Liczba przechowywanych kopii</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>
                                Maksymalna liczba kopii zapasowych do przechowywania
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={backupForm.control}
                          name="includeMedia"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Dołącz pliki multimedialne
                                </FormLabel>
                                <FormDescription>
                                  Dołącz pliki multimedialne do kopii zapasowej
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={backupForm.control}
                          name="backupLocation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Lokalizacja kopii</FormLabel>
                              <FormControl>
                                <select
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  value={field.value}
                                  onChange={(e) => field.onChange(e.target.value as "local" | "cloud")}
                                >
                                  <option value="local">Lokalnie</option>
                                  <option value="cloud">Chmura</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex space-x-4">
                          <Button type="submit">
                            <Save className="mr-2 h-4 w-4" /> Zapisz zmiany
                          </Button>
                          <Button variant="outline" type="button">
                            Utwórz kopię zapasową teraz
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}

              {activeTab === "interface" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Ustawienia interfejsu</CardTitle>
                    <CardDescription>
                      Dostosuj wygląd i funkcjonalność panelu administracyjnego.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...interfaceForm}>
                      <form
                        onSubmit={interfaceForm.handleSubmit(onInterfaceSubmit)}
                        className="space-y-8"
                      >
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Wygląd</h3>
                          <FormField
                            control={interfaceForm.control}
                            name="theme"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Motyw panelu</FormLabel>
                                <FormControl>
                                  <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value as "light" | "dark" | "system")}
                                  >
                                    <option value="light">Jasny</option>
                                    <option value="dark">Ciemny</option>
                                    <option value="system">Systemowy</option>
                                  </select>
                                </FormControl>
                                <FormDescription>
                                  Wybierz motyw kolorystyczny panelu administracyjnego.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={interfaceForm.control}
                            name="accentColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Kolor akcentu</FormLabel>
                                <div className="flex flex-wrap gap-3">
                                  {(["blue", "green", "purple", "orange", "pink"] as const).map((color) => (
                                    <div key={color} className="flex items-center">
                                      <button
                                        type="button"
                                        className={`w-8 h-8 rounded-full mr-2 ${
                                          color === "blue" ? "bg-blue-600" :
                                          color === "green" ? "bg-green-600" :
                                          color === "purple" ? "bg-purple-600" :
                                          color === "orange" ? "bg-orange-600" :
                                          "bg-pink-600"
                                        } ${field.value === color ? "ring-2 ring-ring ring-offset-2" : ""}`}
                                        onClick={() => field.onChange(color)}
                                        aria-label={`Kolor ${color}`}
                                      />
                                      <span className="capitalize">{color}</span>
                                    </div>
                                  ))}
                                </div>
                                <FormDescription>
                                  Wybierz kolor akcentu dla przycisków i elementów interaktywnych.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={interfaceForm.control}
                            name="useSystemFont"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Używaj czcionki systemowej
                                  </FormLabel>
                                  <FormDescription>
                                    Zamiast ładować własne czcionki, używaj czcionki systemowej urządzenia.
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={interfaceForm.control}
                            name="animations"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Animacje interfejsu
                                  </FormLabel>
                                  <FormDescription>
                                    Włącz lub wyłącz animacje w interfejsie użytkownika.
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Układ i nawigacja</h3>
                          <FormField
                            control={interfaceForm.control}
                            name="sidebarCompact"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Kompaktowy pasek boczny
                                  </FormLabel>
                                  <FormDescription>
                                    Zmniejsza szerokość paska bocznego, pokazując tylko ikony.
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={interfaceForm.control}
                            name="itemsPerPage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Elementy na stronę</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="5"
                                    max="100"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Liczba elementów wyświetlanych na jednej stronie list i tabel.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={interfaceForm.control}
                            name="tableLayout"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Styl tabel</FormLabel>
                                <FormControl>
                                  <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value as "compact" | "default" | "spacious")}
                                  >
                                    <option value="compact">Kompaktowy</option>
                                    <option value="default">Standardowy</option>
                                    <option value="spacious">Przestronny</option>
                                  </select>
                                </FormControl>
                                <FormDescription>
                                  Wybierz gęstość i styl wyświetlania tabel w panelu.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Personalizacja pulpitu</h3>
                          <FormField
                            control={interfaceForm.control}
                            name="showWelcomeMessage"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Powitanie na pulpicie
                                  </FormLabel>
                                  <FormDescription>
                                    Pokazuj wiadomość powitalną na stronie głównej panelu.
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={interfaceForm.control}
                            name="customizeAdminHome"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Personalizacja pulpitu
                                  </FormLabel>
                                  <FormDescription>
                                    Pozwala na dostosowanie widżetów i układu strony głównej panelu.
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={interfaceForm.control}
                            name="dashboardLayout"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Układ pulpitu</FormLabel>
                                <FormControl>
                                  <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value as "grid" | "list" | "cards")}
                                  >
                                    <option value="grid">Siatka</option>
                                    <option value="list">Lista</option>
                                    <option value="cards">Karty</option>
                                  </select>
                                </FormControl>
                                <FormDescription>
                                  Wybierz sposób prezentacji danych na pulpicie głównym.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="p-4 border rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground mb-2">Podgląd motywu</p>
                          <div className="flex gap-2 flex-wrap">
                            <Button>Przycisk podstawowy</Button>
                            <Button variant="secondary">Przycisk drugorzędny</Button>
                            <Button variant="destructive">Przycisk usuwania</Button>
                            <Button variant="outline">Przycisk konturowy</Button>
                            <Button variant="ghost">Przycisk ghost</Button>
                          </div>
                        </div>
                        
                        <Button type="submit">
                          <Save className="mr-2 h-4 w-4" /> Zapisz zmiany
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "communications" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Komunikacja</CardTitle>
                    <CardDescription>
                      Zarządzaj szablonami wiadomości email i komunikatami.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-8">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Szablony email</h3>
                        <div className="grid gap-4">
                          <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                            <div className="space-y-0.5">
                              <div className="font-medium">Potwierdzenie kontaktu</div>
                              <div className="text-sm text-muted-foreground">
                                Wysyłane po wypełnieniu formularza kontaktowego
                              </div>
                            </div>
                            <Button variant="outline">Edytuj</Button>
                          </div>
                          <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                            <div className="space-y-0.5">
                              <div className="font-medium">Newsletter</div>
                              <div className="text-sm text-muted-foreground">
                                Wiadomość powitalna po zapisaniu się do newslettera
                              </div>
                            </div>
                            <Button variant="outline">Edytuj</Button>
                          </div>
                          <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                            <div className="space-y-0.5">
                              <div className="font-medium">Potwierdzenie zakupu</div>
                              <div className="text-sm text-muted-foreground">
                                Wysyłane po zakupie szablonu
                              </div>
                            </div>
                            <Button variant="outline">Edytuj</Button>
                          </div>
                          <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                            <div className="space-y-0.5">
                              <div className="font-medium">Potwierdzenie konsultacji</div>
                              <div className="text-sm text-muted-foreground">
                                Wysyłane po zarezerwowaniu terminu konsultacji
                              </div>
                            </div>
                            <Button variant="outline">Edytuj</Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Ustawienia SMTP</h3>
                        <div className="grid gap-6">
                          <div className="grid gap-3">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              Serwer SMTP
                            </label>
                            <input
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="smtp.example.com"
                              defaultValue="smtp.automatyzator.com"
                            />
                          </div>
                          <div className="grid gap-3">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              Port
                            </label>
                            <input
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="587"
                              defaultValue="587"
                            />
                          </div>
                          <div className="grid gap-3">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              Nazwa użytkownika
                            </label>
                            <input
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="user@example.com"
                              defaultValue="mail@automatyzator.com"
                            />
                          </div>
                          <div className="grid gap-3">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              Hasło
                            </label>
                            <input
                              type="password"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="••••••••••••"
                              defaultValue="••••••••••••"
                            />
                          </div>
                          <div className="grid gap-3">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              Adres nadawcy
                            </label>
                            <input
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="noreply@example.com"
                              defaultValue="kontakt@automatyzator.com"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="smtp-ssl" defaultChecked />
                            <label
                              htmlFor="smtp-ssl"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Używaj SSL/TLS
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>
                      <Save className="mr-2 h-4 w-4" /> Zapisz ustawienia
                    </Button>
                  </CardFooter>
                </Card>
              )}
              
              {activeTab === "media" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Pliki</CardTitle>
                    <CardDescription>
                      Zarządzaj plikami multimedialnymi.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Biblioteka mediów</h3>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <span className="mr-2">🗂️</span> Nowy folder
                            </Button>
                            <Button size="sm">
                              <span className="mr-2">⬆️</span> Dodaj pliki
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex border rounded-md overflow-hidden h-96">
                          <div className="w-1/4 border-r p-4 overflow-auto">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent cursor-pointer">
                                <span>📁</span>
                                <span>Wszystkie pliki</span>
                              </div>
                              <div className="flex items-center space-x-2 p-2 rounded bg-accent cursor-pointer">
                                <span>🖼️</span>
                                <span>Obrazy</span>
                              </div>
                              <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent cursor-pointer">
                                <span>📄</span>
                                <span>Dokumenty</span>
                              </div>
                              <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent cursor-pointer">
                                <span>🎬</span>
                                <span>Filmy</span>
                              </div>
                              <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent cursor-pointer">
                                <span>📁</span>
                                <span>Blog</span>
                              </div>
                              <div className="flex items-center space-x-2 p-2 rounded hover:bg-accent cursor-pointer">
                                <span>📁</span>
                                <span>Szablony</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 p-4 overflow-auto">
                            <div className="grid grid-cols-4 gap-4">
                              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="overflow-hidden rounded-md border bg-muted">
                                  <div className="h-32 w-full bg-secondary"></div>
                                  <div className="p-2 text-xs truncate">
                                    obraz-{i}.jpg
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Ustawienia przechowywania</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <div className="font-medium">Miejsce przechowywania</div>
                              <div className="text-sm text-muted-foreground">
                                Wybierz, gdzie mają być przechowywane pliki
                              </div>
                            </div>
                            <select
                              className="flex h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              defaultValue="local"
                            >
                              <option value="local">Lokalnie</option>
                              <option value="s3">Amazon S3</option>
                              <option value="gcs">Google Cloud</option>
                            </select>
                          </div>
                          <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <div className="font-medium">Optymalizacja obrazów</div>
                              <div className="text-sm text-muted-foreground">
                                Automatycznie kompresuj i optymalizuj obrazy
                              </div>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <div className="font-medium">Maksymalny rozmiar pliku</div>
                              <div className="text-sm text-muted-foreground">
                                Maksymalny rozmiar pliku, który można przesłać
                              </div>
                            </div>
                            <select
                              className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              defaultValue="10"
                            >
                              <option value="5">5 MB</option>
                              <option value="10">10 MB</option>
                              <option value="20">20 MB</option>
                              <option value="50">50 MB</option>
                            </select>
                          </div>
                          <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <div className="font-medium">Generuj miniaturki</div>
                              <div className="text-sm text-muted-foreground">
                                Twórz różne rozmiary obrazów dla różnych urządzeń
                              </div>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>
                      <Save className="mr-2 h-4 w-4" /> Zapisz ustawienia
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}