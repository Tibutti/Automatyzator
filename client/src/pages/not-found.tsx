import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";

export default function NotFound() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4 shadow-lg">
        <CardContent className="pt-6 text-center">
          <div className="flex flex-col items-center justify-center mb-6">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-3xl font-bold text-foreground">{t("notFound.title")}</h1>
          </div>

          <p className="mt-4 mb-6 text-muted-foreground">
            {t("notFound.description")}
          </p>
          
          <Link href="/">
            <Button variant="default" className="w-full">
              {t("notFound.button")}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
