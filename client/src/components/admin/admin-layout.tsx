import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  FileText,
  ShoppingBag,
  Briefcase,
  MessageSquare,
  Mail,
  LogOut,
  Settings,
  ChevronRight,
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { logout } = useAuth();
  const [location] = useLocation();

  const menuItems = [
    {
      title: "Panel główny",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin",
    },
    {
      title: "Blog",
      icon: <FileText className="h-5 w-5" />,
      href: "/admin/blog",
    },
    {
      title: "Usługi",
      icon: <FileText className="h-5 w-5" />,
      href: "/admin/services",
    },
    {
      title: "Dlaczego my",
      icon: <FileText className="h-5 w-5" />,
      href: "/admin/why-us",
    },
    {
      title: "Szablony",
      icon: <ShoppingBag className="h-5 w-5" />,
      href: "/admin/templates",
    },
    {
      title: "Case studies",
      icon: <Briefcase className="h-5 w-5" />,
      href: "/admin/case-studies",
    },
    {
      title: "Wiadomości",
      icon: <MessageSquare className="h-5 w-5" />,
      href: "/admin/messages",
    },
    {
      title: "Newsletter",
      icon: <Mail className="h-5 w-5" />,
      href: "/admin/newsletter",
    },
    {
      title: "Sekcje strony",
      icon: <Settings className="h-5 w-5" />,
      href: "/admin/section-settings",
    },
    {
      title: "Sekcje Hero",
      icon: <Settings className="h-5 w-5" />,
      href: "/admin/hero-settings",
    },
    {
      title: "Ustawienia konsultacji",
      icon: <Settings className="h-5 w-5" />,
      href: "/admin/consultation-settings",
    },
    {
      title: "Ustawienia",
      icon: <Settings className="h-5 w-5" />,
      href: "/admin/settings",
    },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto border-r bg-white dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold">Automatyzator</h1>
            <span className="ml-2 px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              Admin
            </span>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {menuItems.map((item) => (
                <Link 
                  key={item.title} 
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    location === item.href
                      ? "bg-gray-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400"
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                  {location === item.href && (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
            <Button
              variant="outline"
              className="w-full justify-start text-gray-600 dark:text-gray-400"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Wyloguj się
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 w-full">
        <h1 className="text-xl font-bold flex items-center">
          Automatyzator
          <span className="ml-2 px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            Admin
          </span>
        </h1>
        <Button variant="outline" onClick={handleLogout} size="sm">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <div className="py-6 px-4 sm:px-6 md:px-8 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}