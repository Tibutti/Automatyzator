import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FileText, 
  ShoppingBag, 
  Briefcase, 
  Mail, 
  Users, 
  LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "../theme-toggle";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { logout } = useAuth();
  const [location] = useLocation();

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      label: "Blog",
      href: "/admin/blog",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      label: "Szablony",
      href: "/admin/templates",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      label: "Case Studies",
      href: "/admin/case-studies",
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      label: "Wiadomości",
      href: "/admin/messages",
      icon: <Mail className="h-5 w-5" />,
    },
    {
      label: "Newsletter",
      href: "/admin/newsletter",
      icon: <Users className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Top navigation */}
      <header className="bg-white dark:bg-gray-800 h-16 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between h-full px-4 sm:px-6">
          <div className="flex items-center">
            <Link to="/admin">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 relative">
                  <div className="absolute inset-0 bg-primary rounded-lg flex items-center justify-center text-white font-montserrat font-bold text-xl">
                    A
                  </div>
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent rounded-full"></div>
                </div>
                <span className="hidden md:block text-lg font-semibold dark:text-white">
                  Admin Panel
                </span>
              </div>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Wyloguj</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-16 md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <nav className="p-2 md:p-4 space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex items-center p-2 rounded-md transition-colors cursor-pointer",
                  "hover:bg-gray-100 dark:hover:bg-gray-700",
                  location === item.href 
                    ? "bg-gray-100 dark:bg-gray-700 text-primary" 
                    : "text-gray-700 dark:text-gray-300"
                )}>
                  <div className="flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="ml-3 hidden md:block">{item.label}</span>
                </div>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}