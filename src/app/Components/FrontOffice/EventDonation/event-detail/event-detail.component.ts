import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FullEventResponse } from 'src/app/models/donation';
import { EventService } from 'src/app/Services/event-service.service';
import { Donation } from 'src/app/models/donation';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  id!: number;
  event: FullEventResponse | null = null;

  constructor(
    private es: EventService, 
    private Act: ActivatedRoute, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.Act.snapshot.params['id'];    
    this.es.getEventById(this.id).subscribe(
      (data) => {
        this.event = data;
      }
    );
  }

  getTotalDonations(): number {
    if (!this.event?.donations) return 0;
    return this.event.donations
      .filter((d: Donation) => d.status === 'COMPLETED')
      .reduce((sum: number, current: Donation) => sum + current.amount, 0);
  }

  getDonationPercentage(): number {
    if (!this.event?.goalAmount || this.event.goalAmount <= 0) return 0;
    return (this.getTotalDonations() / this.event.goalAmount) * 100;
  }

  hasCompletedDonations(): boolean {
    return this.event?.donations?.some(d => d.status !== 'PENDING') ?? false;
  }
}