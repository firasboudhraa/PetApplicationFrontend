import { Component, OnInit } from '@angular/core';
import { GeminiService } from 'src/app/services/gemini.service';

@Component({
  selector: 'app-gemini-chat',
  templateUrl: './gemini-chat.component.html',
  styleUrls: ['./gemini-chat.component.css']
})
export class GeminiChatComponent implements OnInit {
  userInput = '';
  messages: {text: string, sender: 'user' | 'bot', timestamp?: Date}[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  isTyping = false;

  constructor(private geminiService: GeminiService) {}

  ngOnInit(): void {
    this.addWelcomeMessage();
  }

  private addWelcomeMessage(): void {
    this.messages.push({
      text: 'Bonjour ! Je suis votre assistant Gemini. Comment puis-je vous aider aujourd\'hui ?',
      sender: 'bot',
      timestamp: new Date()
    });
  }

  async sendMessage(): Promise<void> {
    if (!this.userInput.trim() || this.isLoading) return;

    // Ajouter le message de l'utilisateur
    const userMessage = this.userInput.trim();
    this.addUserMessage(userMessage);
    this.userInput = '';
    this.isLoading = true;
    this.errorMessage = null;

    try {
      // Simuler un délai de frappe pour plus de réalisme
      this.isTyping = true;
      await new Promise(resolve => setTimeout(resolve, 1000));
     
      // Obtenir la réponse de Gemini
      const botResponse = await this.geminiService.generateContent(userMessage);
      this.addBotMessage(botResponse);
    } catch (error) {
      console.error('Erreur avec Gemini:', error);
      this.errorMessage = 'Désolé, une erreur est survenue. Veuillez réessayer.';
      this.addBotMessage(this.errorMessage);
    } finally {
      this.isLoading = false;
      this.isTyping = false;
    }
  }

  private addUserMessage(text: string): void {
    this.messages.push({
      text,
      sender: 'user',
      timestamp: new Date()
    });
    this.scrollToBottom();
  }

  private addBotMessage(text: string): void {
    this.messages.push({
      text,
      sender: 'bot',
      timestamp: new Date()
    });
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const messageArea = document.querySelector('.message-area');
      if (messageArea) {
        messageArea.scrollTop = messageArea.scrollHeight;
      }
    }, 100);
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}

