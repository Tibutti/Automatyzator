import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import Layout from "@/components/layout/layout";
import NotFound from "@/pages/not-found";
import AdminLayout from "@/components/admin/admin-layout";
import ProtectedRoute from "@/components/admin/protected-route";

// Pages
import Home from "@/pages/home";
import Blog from "@/pages/blog";
import Shop from "@/pages/shop";
import Portfolio from "@/pages/portfolio";
import Contact from "@/pages/contact";

// Admin Pages
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/index";
import AdminBlog from "@/pages/admin/blog";
import PlaceholderPage from "@/pages/admin/placeholder";

function Router() {
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Switch>
      {/* Admin Routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/blog" component={AdminBlog} />
      <Route path="/admin/templates">
        <PlaceholderPage title="Zarządzanie szablonami" />
      </Route>
      <Route path="/admin/case-studies">
        <PlaceholderPage title="Zarządzanie case studies" />
      </Route>
      <Route path="/admin/messages">
        <PlaceholderPage title="Wiadomości kontaktowe" />
      </Route>
      <Route path="/admin/newsletter">
        <PlaceholderPage title="Zarządzanie newsletterem" />
      </Route>
      <Route path="/admin/settings">
        <PlaceholderPage title="Ustawienia" />
      </Route>
      
      {/* Public Routes */}
      <Route path="/">
        <Layout>
          <Home />
        </Layout>
      </Route>
      <Route path="/blog">
        <Layout>
          <Blog />
        </Layout>
      </Route>
      <Route path="/shop">
        <Layout>
          <Shop />
        </Layout>
      </Route>
      <Route path="/portfolio">
        <Layout>
          <Portfolio />
        </Layout>
      </Route>
      <Route path="/contact">
        <Layout>
          <Contact />
        </Layout>
      </Route>
      <Route>
        <Layout>
          <NotFound />
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="automatyzator-theme">
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
