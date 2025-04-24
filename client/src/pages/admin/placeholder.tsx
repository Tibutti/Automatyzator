import { ReactNode } from "react";
import AdminLayout from "@/components/admin/admin-layout";
import ProtectedRoute from "@/components/admin/protected-route";

interface PlaceholderPageProps {
  title: string;
}

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">Ta funkcjonalność jest w trakcie implementacji.</p>
          <div className="p-8 text-center border rounded-md bg-muted/10">
            <p className="text-lg">
              Pracujemy nad dodaniem tej sekcji do panelu administracyjnego.
            </p>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}