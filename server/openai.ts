import OpenAI from "openai";

// Inicjalizacja klienta OpenAI z kluczem API ze zmiennych środowiskowych
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Funkcja do generowania odpowiedzi poprzez API OpenAI
export async function generateChatResponse(message: string, language: string = 'pl'): Promise<string> {
  try {
    // Dostosuj instrukcję systemową w zależności od języka
    let systemPrompt: string;
    
    switch(language) {
      case 'en':
        systemPrompt = `You are a chatbot assistant for Automatyzator.com, a company specializing in business process automation.
        Your task is to help users understand how automation can help their business.
        Always communicate in English.
        Be helpful, concise, and professional. Maximum response length is 150 words.
        If you don't know the answer to a specific technical question, suggest contacting the Automatyzator team.`;
        break;
      case 'de':
        systemPrompt = `Sie sind ein Chatbot-Assistent für Automatyzator.com, ein Unternehmen, das sich auf die Automatisierung von Geschäftsprozessen spezialisiert hat.
        Ihre Aufgabe ist es, den Benutzern zu helfen zu verstehen, wie Automatisierung ihrem Unternehmen helfen kann.
        Kommunizieren Sie immer auf Deutsch.
        Seien Sie hilfreich, präzise und professionell. Die maximale Antwortlänge beträgt 150 Wörter.
        Wenn Sie die Antwort auf eine bestimmte technische Frage nicht kennen, schlagen Sie vor, das Automatyzator-Team zu kontaktieren.`;
        break;
      default: // pl lub inny język
        systemPrompt = `Jesteś asystentem chatbota dla firmy Automatyzator.com, która specjalizuje się w automatyzacji procesów biznesowych.
        Twoje zadanie to pomagać użytkownikom w zrozumieniu jak automatyzacja może pomóc ich firmie.
        Mów zawsze po polsku (chyba że użytkownik wyraźnie poprosi o inny język).
        Bądź pomocny, zwięzły i profesjonalny. Maksymalna długość odpowiedzi to 150 słów.
        Jeśli nie znasz odpowiedzi na konkretne pytanie techniczne, sugeruj kontakt z zespołem Automatyzator.`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message.content || "Przepraszam, wystąpił problem z generowaniem odpowiedzi.";
    } else {
      throw new Error("Empty response from OpenAI API");
    }
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw error;
  }
}