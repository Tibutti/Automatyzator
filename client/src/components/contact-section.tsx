import ContactForm from "@/components/contact-form";
import NewsletterForm from "@/components/newsletter-form";
import { Mail, Phone, Linkedin } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-montserrat font-bold text-center mb-12 text-foreground">
          Kontakt
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <ContactForm />
          </div>
          
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-montserrat font-bold mb-6 text-foreground">
                Dane kontaktowe
              </h3>
              
              <div className="space-y-4 mb-12">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 mt-1">
                    <Mail className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-montserrat font-bold text-foreground">Email</h4>
                    <p className="text-gray-600 dark:text-gray-300">kontakt@automatyzator.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 mt-1">
                    <Phone className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-montserrat font-bold text-foreground">Telefon</h4>
                    <p className="text-gray-600 dark:text-gray-300">+48 123 456 789</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 mt-1">
                    <Linkedin className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-montserrat font-bold text-foreground">LinkedIn</h4>
                    <p className="text-gray-600 dark:text-gray-300">linkedin.com/company/automatyzator</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-background dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-montserrat font-bold mb-4 text-foreground">
                Newsletter
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Zapisz się, aby otrzymywać najnowsze artykuły i porady dotyczące automatyzacji.
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
