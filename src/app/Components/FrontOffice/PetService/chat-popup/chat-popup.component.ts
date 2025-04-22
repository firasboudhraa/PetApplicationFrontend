import { Component, ElementRef, Renderer2 } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

declare var lordicon: any; // Declare lordicon as a global variable
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat-popup',
  templateUrl: './chat-popup.component.html',
  styleUrls: ['./chat-popup.component.css']
})
export class ChatPopupComponent {

  messages: { sender: 'user' | 'bot', content: string }[] = [];
  userInput: string = '';
  sessionId: string = uuidv4();  // Unique ID per session
  loading = false;
  showPopup = false;

  constructor(private http: HttpClient ,private renderer: Renderer2, private el: ElementRef) {}

  togglePopup() {
    this.showPopup = !this.showPopup;
  }
  closeChat() {
    this.showPopup = false;
  }
  lordicon : any ;
  ngAfterViewInit() {
    this.loadLordIconScript().then(() => {
      if (typeof lordicon !== 'undefined') {
        lordicon.init();  
      }
    });
  }

  loadLordIconScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.lordicon.com/lordicon.js';
      script.onload = () => resolve();
      script.onerror = (err) => reject('Lordicon script loading failed');
      document.head.appendChild(script);
    });
  }




  sendMessage(): void {
    if (!this.userInput.trim()) return;

    const input = this.userInput.trim();

    // Display user's message
    this.messages.push({ sender: 'user', content: input });
    this.loading = true;

    const payload = {
      session_id: this.sessionId,
      message: input
    };

    this.http.post<any>('http://127.0.0.1:8000/interact', payload).subscribe({
      next: (res) => {
        this.messages.push({ sender: 'bot', content: res.response });
        this.loading = false;
      },
      error: (err) => {
        this.messages.push({ sender: 'bot', content: '❌ Error communicating with the assistant.' });
        this.loading = false;
      }
    });

    this.userInput = '';
  }
  
}