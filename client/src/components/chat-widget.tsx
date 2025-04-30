import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X, Send } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { apiRequest } from "@/lib/queryClient";
import { useTranslation } from "react-i18next";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
};

export default function ChatWidget() {
  const { t, i18n } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: t('chat.welcome'),
      sender: "bot"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Aktualizuj wiadomość powitalną, gdy zmienia się język
  useEffect(() => {
    // Zmień tylko wiadomość powitalną (pierwszą)
    setMessages(prev => [
      { id: "1", text: t('chat.welcome'), sender: "bot" },
      ...prev.slice(1)
    ]);
  }, [i18n.language, t]);

  // Automatyczne przewijanie na dół po nowej wiadomości
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user"
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    
    // Zapisz inputValue przed wyczyszczeniem
    const messageToSend = inputValue;
    setInputValue("");
    
    // Pokaż wskaźnik ładowania
    setIsLoading(true);
    
    try {
      // Pobierz aktualny język i wyślij zapytanie do API OpenAI
      const currentLanguage = i18n.language?.substring(0, 2) || 'pl';
      const response = await apiRequest("POST", "/api/chat", { 
        message: messageToSend,
        language: currentLanguage
      });
      const data = await response.json();
      
      // Dodaj odpowiedź bota
      const botResponse: Message = {
        id: Date.now().toString(),
        text: data.response,
        sender: "bot"
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Dodaj komunikat o błędzie
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "Przepraszam, wystąpił błąd podczas generowania odpowiedzi. Proszę spróbować ponownie później.",
        sender: "bot"
      };
      
      // Uwaga: To mogłoby być przetłumaczone, ale zachowujemy stały tekst błędu dla prostoty
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={toggleChat}
        className="w-16 h-16 rounded-full shadow-lg"
        size="icon"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </Button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 md:w-96 bg-background rounded-xl shadow-2xl overflow-hidden border border-border">
          <div className="bg-primary p-4">
            <h3 className="text-white font-montserrat font-bold text-lg">{t('chat.title')}</h3>
            <p className="text-white/80 text-sm">{t('chat.subtitle')}</p>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start ${
                  message.sender === "user" ? "justify-end" : ""
                }`}
              >
                {message.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white mr-2 flex-shrink-0">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-lg max-w-[80%] ${
                    message.sender === "user"
                      ? "bg-primary text-white"
                      : theme === "dark"
                      ? "bg-gray-700 text-gray-200"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p>{message.text}</p>
                </div>
                {message.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center ml-2 flex-shrink-0">
                    <svg
                      className="h-4 w-4 text-gray-600 dark:text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white mr-2 flex-shrink-0">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800"} flex items-center space-x-2`}>
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <p>{t('chat.typing')}</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex">
              <input
                type="text"
                className="flex-grow p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={t('chat.placeholder')}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
              />
              <Button
                className="px-4 rounded-r-lg"
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
