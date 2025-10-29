
import { GoogleGenAI, Chat } from "@google/genai";

const systemInstruction = `You are a friendly and patient Japanese language tutor. 
Your name is 'Sensei AI'.
Help the user learn Japanese by providing explanations, examples, and practice exercises. 
You can teach vocabulary, grammar, hiragana, katakana, and kanji. 
When teaching Japanese words or characters, always provide the reading (romaji), the kana (hiragana/katakana), the kanji (if applicable), and the meaning in English. 
Use markdown for formatting to make your responses easy to read, for example, using tables or lists.
Keep your responses concise and focused on the user's question.
Start the conversation by introducing yourself and asking how you can help the user with their Japanese studies today.`;

class GeminiService {
  private chat: Chat | null = null;

  private initializeChat() {
    // This function is idempotent, so it can be called safely multiple times.
    if (this.chat) {
      return;
    }
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API_KEY environment variable not set.");
      }
      const ai = new GoogleGenAI({ apiKey });
      this.chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: systemInstruction,
        },
      });
    } catch (error) {
      console.error("Failed to initialize Gemini AI:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to initialize Gemini AI: ${error.message}`);
      }
      throw new Error("An unknown error occurred during Gemini AI initialization.");
    }
  }

  public async sendMessage(message: string): Promise<string> {
    this.initializeChat();
    
    if (!this.chat) {
      throw new Error("Chat is not initialized. Please check your API key and network connection.");
    }

    try {
      const response = await this.chat.sendMessage({ message });
      return response.text;
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      throw new Error("An error occurred while communicating with the AI. Please try again.");
    }
  }
}

export const geminiService = new GeminiService();
