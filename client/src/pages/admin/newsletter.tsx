import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Mail, Plus, Send, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type NewsletterSubscriber } from "@shared/schema";
import AdminLayout from "@/components/admin/admin-layout";
import ProtectedRoute from "@/components/admin/protected-route";

// Formularze
const addSubscriberSchema = z.object({
  email: z.string().email({ message: "Wprowadź poprawny adres email" }),
});

type AddSubscriberValues = z.infer<typeof addSubscriberSchema>;

export default function AdminNewsletterPage() {
  const { t } = useTranslation('common');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch newsletter subscribers
  const { data: subscribers, isLoading } = useQuery<NewsletterSubscriber[]>({
    queryKey: ["/api/newsletter-subscribers"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/newsletter-subscribers");
      if (!res.ok) {
        throw new Error("Failed to fetch newsletter subscribers");
      }
      return res.json();
    },
  });

  // Add subscriber form
  const form = useForm<AddSubscriberValues>({
    resolver: zodResolver(addSubscriberSchema),
    defaultValues: {
      email: "",
    },
  });

  // Add subscriber mutation
  const addSubscriberMutation = useMutation({
    mutationFn: async (values: AddSubscriberValues) => {
      const res = await apiRequest("POST", "/api/newsletter", values);
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to add subscriber");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Sukces",
        description: "Subskrybent został dodany",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/newsletter-subscribers"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Błąd",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete subscriber mutation
  const deleteSubscriberMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/newsletter-subscribers/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Sukces",
        description: "Subskrybent został usunięty",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/newsletter-subscribers"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Błąd",
        description: `Nie udało się usunąć subskrybenta: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: AddSubscriberValues) => {
    addSubscriberMutation.mutate(values);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Czy na pewno chcesz usunąć tego subskrybenta?")) {
      deleteSubscriberMutation.mutate(id);
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Subskrybenci newslettera</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Lista subskrybentów</CardTitle>
                  <CardDescription>
                    Lista osób zapisanych do newslettera
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                  ) : !subscribers || subscribers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
                      <Mail className="h-12 w-12 text-muted-foreground" />
                      <div>
                        <h3 className="text-lg font-semibold">Brak subskrybentów</h3>
                        <p className="text-muted-foreground">Nikt jeszcze nie zapisał się do newslettera.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">
                              <Checkbox />
                            </TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Data zapisania</TableHead>
                            <TableHead className="text-right">Akcje</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subscribers.map((subscriber) => (
                            <TableRow key={subscriber.id}>
                              <TableCell>
                                <Checkbox />
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">{subscriber.email}</div>
                              </TableCell>
                              <TableCell>
                                {format(new Date(subscriber.createdAt), "dd MMM yyyy", { locale: pl })}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    asChild
                                  >
                                    <a href={`mailto:${subscriber.email}`}>
                                      <Mail className="h-4 w-4" />
                                    </a>
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleDelete(subscriber.id)}
                                    disabled={deleteSubscriberMutation.isPending}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    Łącznie: {subscribers?.length || 0} subskrybentów
                  </div>
                  <Button variant="outline" disabled={!subscribers || subscribers.length === 0}>
                    <Send className="mr-2 h-4 w-4" />
                    Wyślij kampanię
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Dodaj subskrybenta</CardTitle>
                  <CardDescription>
                    Ręcznie dodaj osobę do newslettera
                  </CardDescription>
                </CardHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Adres email</FormLabel>
                            <FormControl>
                              <Input placeholder="jan.kowalski@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={addSubscriberMutation.isPending}
                      >
                        {addSubscriberMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="mr-2 h-4 w-4" />
                        )}
                        Dodaj subskrybenta
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Szybkie statystyki</CardTitle>
                  <CardDescription>
                    Statystyki newslettera
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Łączna liczba subskrybentów</h4>
                      <p className="text-3xl font-bold">{subscribers?.length || 0}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Średni wskaźnik otwarć</h4>
                      <p className="text-3xl font-bold">--</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Średni wskaźnik kliknięć</h4>
                      <p className="text-3xl font-bold">--</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}