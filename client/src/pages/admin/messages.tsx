import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, Trash2, User, Building, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type ContactMessage } from "@shared/schema";
import AdminLayout from "@/components/admin/admin-layout";
import ProtectedRoute from "@/components/admin/protected-route";

export default function AdminMessagesPage() {
  const { t } = useTranslation('common');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch contact messages
  const { data: messages, isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact-messages"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/contact-messages");
      if (!res.ok) {
        throw new Error("Failed to fetch contact messages");
      }
      return res.json();
    },
  });

  // Delete message mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/contact-messages/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Sukces",
        description: "Wiadomość została usunięta",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/contact-messages"] });
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Błąd",
        description: `Nie udało się usunąć wiadomości: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Czy na pewno chcesz usunąć tę wiadomość?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    // Opóźnij usunięcie danych z modalu, aby zapobiec migotaniu zawartości podczas animacji zamykania
    setTimeout(() => setSelectedMessage(null), 300);
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Wiadomości kontaktowe</h1>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : !messages || messages.length === 0 ? (
            <Card>
              <CardContent className="py-16">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <Mail className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold">Brak wiadomości</h3>
                    <p className="text-muted-foreground">Nie masz żadnych wiadomości od użytkowników.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {messages.map((message) => (
                <Card key={message.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{message.name}</CardTitle>
                        <CardDescription className="mt-1 truncate">
                          <a href={`mailto:${message.email}`} className="hover:underline">
                            {message.email}
                          </a>
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="ml-2 whitespace-nowrap text-xs">
                        {format(new Date(message.createdAt), "dd MMM yyyy", { locale: pl })}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-3">
                    <p className="line-clamp-3 text-sm">{message.message}</p>
                    {message.company && (
                      <div className="mt-3 flex items-center text-xs text-muted-foreground">
                        <Building className="h-3 w-3 mr-1" />
                        <span>{message.company}</span>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="flex justify-end pt-3 space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewMessage(message)}
                    >
                      Szczegóły
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete(message.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          
          {/* Dialog for viewing message details */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-lg">
              {selectedMessage && (
                <>
                  <DialogHeader>
                    <DialogTitle>Wiadomość od {selectedMessage.name}</DialogTitle>
                    <DialogDescription>
                      Szczegóły wiadomości kontaktowej
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="text-sm font-medium">Imię i nazwisko</h4>
                        <p>{selectedMessage.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="text-sm font-medium">Email</h4>
                        <p>
                          <a 
                            href={`mailto:${selectedMessage.email}`} 
                            className="text-blue-600 hover:underline dark:text-blue-400"
                          >
                            {selectedMessage.email}
                          </a>
                        </p>
                      </div>
                    </div>
                    
                    {selectedMessage.company && (
                      <div className="flex items-center space-x-3">
                        <Building className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h4 className="text-sm font-medium">Firma</h4>
                          <p>{selectedMessage.company}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="text-sm font-medium">Data wysłania</h4>
                        <p>{format(new Date(selectedMessage.createdAt), "dd MMMM yyyy, HH:mm", { locale: pl })}</p>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <h4 className="text-sm font-medium mb-2">Wiadomość</h4>
                      <div className="bg-muted p-3 rounded-md whitespace-pre-line">
                        {selectedMessage.message}
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter className="space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={closeDialog}
                    >
                      Zamknij
                    </Button>
                    <Button 
                      variant="default" 
                      asChild
                    >
                      <a href={`mailto:${selectedMessage.email}?subject=Re: Wiadomość z formularza kontaktowego&body=Witaj ${selectedMessage.name},%0D%0A%0D%0ADziękujemy za wiadomość.%0D%0A%0D%0A%0D%0AZ poważaniem,%0D%0AZespół Automatyzator`}>
                        Odpowiedz
                      </a>
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => handleDelete(selectedMessage.id)}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      Usuń
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}