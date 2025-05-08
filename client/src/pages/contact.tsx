import ContactSection from "@/components/contact-section";
import HeroSection from "@/components/hero-section";

export default function Contact() {
  return (
    <div className="min-h-screen pt-20">
      <HeroSection pageKey="contact" />
      <ContactSection />
    </div>
  );
}
