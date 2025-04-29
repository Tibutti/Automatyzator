import { Link } from "wouter";
import { Facebook, Twitter, Linkedin, Github } from "lucide-react";
import Logo from "@/components/logo";

export default function Footer() {
  return (
    <footer className="bg-[#1F1F1F] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <Logo />
              <span className="ml-2 text-xl font-montserrat font-bold text-white">Automatyzator</span>
            </div>
            <p className="text-gray-400 mb-4">
              Pomagamy firmom automatyzować procesy, integrować systemy i budować przewagę konkurencyjną.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-montserrat font-bold mb-4 text-white">Usługi</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Make.com</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">n8n</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Zapier</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Boty</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Agenty LLM</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-montserrat font-bold mb-4 text-white">Zasoby</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-400 hover:text-white transition-colors">Szablony</Link>
              </li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Dokumentacja</a></li>
              <li>
                <Link href="/portfolio" className="text-gray-400 hover:text-white transition-colors">Case Studies</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-montserrat font-bold mb-4 text-white">Firma</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">O nas</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Zespół</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Kariera</a></li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Kontakt</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">© {new Date().getFullYear()} Automatyzator. Wszelkie prawa zastrzeżone.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Polityka prywatności</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Warunki korzystania</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
