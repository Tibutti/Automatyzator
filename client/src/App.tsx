import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { ChatProvider } from "./contexts/chat-context";
import Layout from "@/components/layout/layout";
import NotFound from "@/pages/not-found";
import AdminLayout from "@/components/admin/admin-layout";
import ProtectedRoute from "@/components/admin/protected-route";
import SectionGuard from "@/components/section-guard";

// Pages
import Home from "@/pages/home";
import Services from "@/pages/services";
import WhyUs from "@/pages/why-us";
import Blog from "@/pages/blog";
import BlogArticle from "@/pages/blog-article";
import Shop from "@/pages/shop";
import Portfolio from "@/pages/portfolio";
import Contact from "@/pages/contact";
import Consultation from "@/pages/consultation";
import Trainings from "@/pages/trainings";

// Admin Pages
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/index";
import AdminBlog from "@/pages/admin/blog";
import AdminSettings from "@/pages/admin/settings";
import AdminWhyUs from "@/pages/admin/why-us";
import AdminServices from "@/pages/admin/services";
import AdminSectionSettings from "@/pages/admin/section-settings";
import AdminHeroSettings from "@/pages/admin/hero-settings";
import AdminConsultationSettings from "@/pages/admin/consultation-settings";
import AdminTemplates from "@/pages/admin/templates";
import AdminCaseStudies from "@/pages/admin/case-studies";
import AdminMessages from "@/pages/admin/messages";
import AdminNewsletter from "@/pages/admin/newsletter";
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
      {/* Usunięte routy do placeholder stron ponieważ zostały zintegrowane z głównym dashboardem */}
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin/why-us" component={AdminWhyUs} />
      <Route path="/admin/services" component={AdminServices} />
      <Route path="/admin/section-settings" component={AdminSectionSettings} />
      <Route path="/admin/hero-settings" component={AdminHeroSettings} />
      <Route path="/admin/consultation-settings" component={AdminConsultationSettings} />
      <Route path="/admin/templates" component={AdminTemplates} />
      <Route path="/admin/case-studies" component={AdminCaseStudies} />
      <Route path="/admin/messages" component={AdminMessages} />
      <Route path="/admin/newsletter" component={AdminNewsletter} />
      
      {/* Public Routes */}
      <Route path="/">
        <Layout>
          <Home />
        </Layout>
      </Route>
      <Route path="/services">
        <Layout>
          <Services />
        </Layout>
      </Route>
      <Route path="/why-us">
        <Layout>
          <WhyUs />
        </Layout>
      </Route>
      <Route path="/blog">
        <Layout>
          <Blog />
        </Layout>
      </Route>
      <Route path="/blog/:slug">
        <BlogArticle />
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
      <Route path="/consultation" component={Consultation} />
      <Route path="/trainings">
        <Layout>
          <Trainings />
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
            <ChatProvider>
              <Toaster />
              <SectionGuard>
                <Router />
              </SectionGuard>
            </ChatProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
