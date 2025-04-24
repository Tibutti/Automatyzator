import { ReactNode } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import ChatWidget from "@/components/chat-widget";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
