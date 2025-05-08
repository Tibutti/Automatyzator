import ContactSection from "@/components/contact-section";
import HeroSection from "@/components/hero-section";

export default function Contact() {
  return (
    <div className="min-h-screen">
      <HeroSection pageKey="contact" />
      <ContactSection />
    </div>
  );
}
