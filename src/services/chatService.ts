import { processGroundedChatMessage } from '../ai/chatbot';
import { ChatMessage } from '../types/ai';

export interface IChatService {
  sendMessage(message: string): Promise<ChatMessage>;
  getInitialMessage(): ChatMessage;
}

class MockChatService implements IChatService {
  getInitialMessage(): ChatMessage {
    return {
      id: 'init-msg',
      sender: 'assistant',
      text: 'Hi! I can help you explore our products, ingredients, routines, and common questions. What are you looking for?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  async sendMessage(message: string): Promise<ChatMessage> {
    await new Promise((res) => setTimeout(res, 500));
    return processGroundedChatMessage(message);
  }
}

export const chatService: IChatService = new MockChatService();
