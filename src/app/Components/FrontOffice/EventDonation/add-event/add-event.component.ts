import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Event as AppEvent } from 'src/app/models/event'; // Utilisation d'un alias
import { EventService } from 'src/app/Services/event-service.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent {
  eventForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService
  ) {
    this.eventForm = this.fb.group({
      nameEvent: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      dateEvent: ['', [Validators.required]],
      location: ['', [Validators.required]]
    });
  }

  get f() { return this.eventForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.eventForm.invalid) {
      return;
    }

    const newEvent: AppEvent = { // Utilisation de l'alias AppEvent ici
      idEvent: 0, // L'ID sera généré par le backend
      nameEvent: this.eventForm.value.nameEvent,
      description: this.eventForm.value.description,
      dateEvent: this.eventForm.value.dateEvent,
      location: this.eventForm.value.location
    };

    this.eventService.addEvent(newEvent).subscribe(
      () => {
        alert('Événement ajouté avec succès!');
        this.eventForm.reset();
        this.submitted = false;
      },
      error => {
        console.error('Erreur lors de l\'ajout:', error);
        alert('Une erreur est survenue lors de l\'ajout de l\'événement');
      }
    );
  }
}