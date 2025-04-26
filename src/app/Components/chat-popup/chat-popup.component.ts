import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat-popup',
  templateUrl: './chat-popup.component.html',
  styleUrls: ['./chat-popup.component.css']
})
export class ChatPopupComponent {
  @ViewChild('barkAudio') barkAudio!: ElementRef<HTMLAudioElement>; // Reference to the audio element
  messages: { sender: 'user' | 'bot', content: string }[] = [];
  userInput: string = '';
  loading = false;
  showPopup = false;
  soundFiles: string[] = [
    'kitten.wav',
    'cow.wav',
    'duck.wav',
    'geese.wav',
    'horse.wav',
    'monkey.wav',
    'kitten.wav'
  ];

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
  mute !: boolean ;
  toggleMute() {
    this.mute = !this.mute; // Toggle the mute state
  }
  playAnimalSound(): void {
    if (this.mute) return; 
    const randomSound = this.soundFiles[Math.floor(Math.random() * this.soundFiles.length)];
    const audioElement = this.barkAudio.nativeElement;

    audioElement.src = `assets/audio/${randomSound}`;
    audioElement.load(); 

    audioElement.play().catch((error) => {
      console.error('Audio playback failed:', error);
    });
  }
  ngOnInit() {
    const audioElement = this.el.nativeElement.querySelector('#barkAudio');
    this.barkAudio = audioElement;
  }
  sendMessage() {
    if (!this.userInput.trim()) return;

    const input = this.userInput.trim();
    this.messages.push({ sender: 'user', content: input });
    this.loading = true;

    const payload = {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `
            You are a helpful assistant for a pet care app. 
            Provide brief, clear, and accurate advice related to pets only. 
            Keep your answers short and to the point, and avoid irrelevant information.
            Respond in a professional and friendly tone. For example:
            - "What food is best for a cat?" → "Cats thrive on high-protein food like chicken or fish."
            - "How can I train my dog?" → "Start with basic commands like sit and stay using positive reinforcement."
          `
        },
        { role: "user", content: input }
      ]
    };

    this.http.post<any>('http://localhost:8051/api/chat', payload).subscribe({
      next: (res) => {
        const reply = res.choices[0].message.content;
        this.messages.push({ sender: 'bot', content: reply });
        this.loading = false;
      },
      error: () => {
        this.messages.push({ sender: 'bot', content: 'Une erreur est survenue.' });
        this.loading = false;
      }
    });

    this.userInput = '';
  }
}
