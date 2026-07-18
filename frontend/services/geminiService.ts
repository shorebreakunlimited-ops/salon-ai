import { GoogleGenAI, Chat } from '@google/genai';
import { SYSTEM_INSTRUCTION } from '../constants';

export class GeminiService {
  private ai: GoogleGenAI;
  private chatSession: Chat | null = null;

  constructor() {
    // Initialize the SDK. Assumes process.env.API_KEY is available in the environment.
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });
  }

  /**
   * Initializes a new chat session with the system instructions.
   */
  public initChat() {
    this.chatSession = this.ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Slightly creative but mostly focused
      },
    });
  }

  /**
   * Sends a message to the model and returns an async iterable for streaming the response.
   * @param message The user's message
   * @returns AsyncGenerator yielding response chunks
   */
  public async sendMessageStream(message: string) {
    if (!this.chatSession) {
      this.initChat();
    }
    
    if (!this.chatSession) {
        throw new Error("Failed to initialize chat session.");
    }

    try {
      return await this.chatSession.sendMessageStream({ message });
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      throw error;
    }
  }
}

// Export a singleton instance for use across the app if needed, 
// though in React it's often better to instantiate in a hook or component.
export const geminiService = new GeminiService();
