import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [location, navigate] = useLocation();
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Błąd logowania",
        description: "Wprowadź nazwę użytkownika i hasło",
        variant: "destructive",
      });
      return;
    }
    
    const success = await login(username, password);
    
    if (success) {
      toast({
        title: "Zalogowano pomyślnie",
        description: "Witamy w panelu administracyjnym",
      });
      navigate("/admin");
    } else {
      toast({
        title: "Błąd logowania",
        description: "Nieprawidłowa nazwa użytkownika lub hasło",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-4">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Panel administratora</CardTitle>
            <CardDescription className="text-center">
              Zaloguj się, aby zarządzać stroną
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Nazwa użytkownika</Label>
                  <Input
                    id="username"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Hasło</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logowanie...</>
                  ) : (
                    "Zaloguj się"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              variant="link" 
              className="px-0"
              onClick={() => navigate("/")}
            >
              Powrót do strony głównej
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p className="mb-2">Dane testowego konta administratora:</p>
          <div className="bg-muted p-2 rounded-md inline-block text-left">
            <p>Login: <strong>admin</strong></p>
            <p>Hasło: <strong>admin123</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}