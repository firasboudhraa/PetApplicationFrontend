import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/Services/event-service.service';
import { Event as AppEvent } from 'src/app/models/event';

@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.component.html',
  styleUrls: ['./update-event.component.css']
})
export class UpdateEventComponent implements OnInit {
  eventForm: FormGroup;
  eventId!: number;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      nameEvent: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      dateEvent: ['', Validators.required],
      location: ['', Validators.required],
      goalAmount: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.eventId = +this.route.snapshot.paramMap.get('id')!;
    this.loadEventData();
  }

  loadEventData(): void {
    this.eventService.getEventById(this.eventId).subscribe(
      (event: AppEvent) => {
        // Format date for the form
        const eventDate = new Date(event.dateEvent);
        const formattedDate = eventDate.toISOString().substring(0, 16);
        
        this.eventForm.patchValue({
          nameEvent: event.nameEvent,
          description: event.description,
          dateEvent: formattedDate,
          location: event.location,
          goalAmount: event.goalAmount
        });
      },
      error => {
        this.errorMessage = 'Failed to load event data';
        console.error(error);
      }
    );
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const updatedEvent: AppEvent = {
      idEvent: this.eventId,
      ...this.eventForm.value
    };

    // Convert string date to LocalDateTime format
    updatedEvent.dateEvent = new Date(this.eventForm.value.dateEvent).toISOString();

    this.eventService.updateEvent(this.eventId, updatedEvent).subscribe(
      () => {
        this.router.navigate(['/eventback']);
      },
      error => {
        this.errorMessage = 'Failed to update event';
        this.isSubmitting = false;
        console.error(error);
      }
    );
  }

  onCancel(): void {
    this.router.navigate(['/eventback']);
  }
}