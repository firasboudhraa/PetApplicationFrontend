// speech.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {

  constructor() {}

  readAloud(text: string): void {
    const speech = new SpeechSynthesisUtterance(text); // Create a new speech object
    speech.lang = 'en-US';  // Set the language (you can also use other languages)
    speech.rate = 1;  // Control the speed of speech (1 is normal speed)
    speech.pitch = 1;  // Control the pitch of the voice
    window.speechSynthesis.speak(speech);  // Use the browser's speech synthesis to read aloud
  }

  stopReading(): void {
    window.speechSynthesis.cancel();  // Stop reading aloud if needed
  }
}
