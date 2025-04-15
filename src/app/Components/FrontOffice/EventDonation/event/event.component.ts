import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { EventService } from 'src/app/Services/event-service.service';
import { Event } from 'src/app/models/event';
import { DonationService } from 'src/app/Services/donation-service.service';
import { Donation } from 'src/app/models/donation';
import { UserService } from 'src/app/Services/user.service';

interface SearchParams {
  name?: string;
  location?: string;
  date?: string;
  progress?: string;
  sortBy?: string;
}

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  donations: Donation[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalItems: number = 0;
  searchParams: SearchParams = {};
  showRatingModal: boolean = false;
  selectedEventId: number | null = null;
  newRating = {
    value: 0,
    feedback: ''
  };
  averageRatings: { [key: number]: number } = {};

  constructor(
    private eventService: EventService, 
    private donationService: DonationService,
    private router: Router, 
    private http: HttpClient,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.loadDonations();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe(
      (data: Event[]) => {
        this.events = data;
        this.filteredEvents = [...data];
        this.totalItems = data.length;
        this.loadAverageRatings();
      },
      (error) => {
        console.error('Error loading events', error);
      }
    );
  }

  loadDonations(): void {
    this.donationService.getDonations().subscribe(
      (data: Donation[]) => {
        this.donations = data;
      },
      (error) => {
        console.error('Error loading donations', error);
      }
    );
  }

  loadAverageRatings(): void {
    this.events.forEach(event => {
      this.eventService.getAverageRating(event.idEvent).subscribe(
        average => {
          this.averageRatings[event.idEvent] = average;
        }
      );
    });
  }

  openRatingModal(eventId: number): void {
    this.selectedEventId = eventId;
    const userId = this.userService.getCurrentUserId();
    
    this.eventService.getUserRating(eventId, userId).subscribe({
      next: (rating) => {
        this.newRating = {
          value: rating || 0,
          feedback: ''
        };
        this.showRatingModal = true;
      },
      error: (err) => {
        console.error('Error getting user rating:', err);
        this.newRating = { value: 0, feedback: '' };
        this.showRatingModal = true;
      }
    });
  }
  
  submitRating(): void {
    if (!this.selectedEventId || this.newRating.value <= 0) {
      alert('Please provide a valid rating');
      return;
    }
  
    const userId = this.userService.getCurrentUserId();
    
    this.eventService.rateEvent(
      this.selectedEventId,
      this.newRating.value,
      this.newRating.feedback,
      userId
    ).subscribe({
      next: (event) => {
        this.loadEvents();
        this.showRatingModal = false;
      },
      error: (err) => {
        console.error('Error saving rating:', err);
        alert('Failed to save rating. Please try again.');
      }
    });
  }

  updateAverageRating(eventId: number): void {
    this.eventService.getAverageRating(eventId).subscribe(
      average => {
        this.averageRatings[eventId] = average;
      }
    );
  }

  getTotalDonationsForEvent(eventId: number): number {
    return this.donations
      .filter(d => d.eventId === eventId && d.status === 'COMPLETED')
      .reduce((sum, current) => sum + current.amount, 0);
  }

  getDonationPercentage(eventId: number): number {
    const event = this.events.find(e => e.idEvent === eventId);
    if (!event || event.goalAmount <= 0) return 0;
    
    const total = this.getTotalDonationsForEvent(eventId);
    return (total / event.goalAmount) * 100;
  }

  applyFilters(): void {
    let results = [...this.events];

    // Filter by name
    if (this.searchParams.name) {
      results = results.filter(event => 
        event.nameEvent.toLowerCase().includes(this.searchParams.name!.toLowerCase())
      );
    }

    // Filter by location
    if (this.searchParams.location) {
      results = results.filter(event => 
        event.location.toLowerCase().includes(this.searchParams.location!.toLowerCase())
      );
    }

    // Filter by date
    if (this.searchParams.date) {
      const searchDate = new Date(this.searchParams.date);
      results = results.filter(event => {
        const eventDate = new Date(event.dateEvent);
        return eventDate.toDateString() === searchDate.toDateString();
      });
    }

    // Filter by progress
    if (this.searchParams.progress) {
      results = results.filter(event => {
        const progress = this.getDonationPercentage(event.idEvent);
        switch(this.searchParams.progress) {
          case 'low': return progress <= 25;
          case 'medium': return progress > 25 && progress <= 75;
          case 'high': return progress > 75 && progress < 100;
          case 'completed': return progress >= 100;
          default: return true;
        }
      });
    }

    // Sort results
    if (this.searchParams.sortBy) {
      switch(this.searchParams.sortBy) {
        case 'date_asc':
          results.sort((a, b) => new Date(a.dateEvent).getTime() - new Date(b.dateEvent).getTime());
          break;
        case 'date_desc':
          results.sort((a, b) => new Date(b.dateEvent).getTime() - new Date(a.dateEvent).getTime());
          break;
        case 'name_asc':
          results.sort((a, b) => a.nameEvent.localeCompare(b.nameEvent));
          break;
        case 'name_desc':
          results.sort((a, b) => b.nameEvent.localeCompare(a.nameEvent));
          break;
        case 'progress_asc':
          results.sort((a, b) => this.getDonationPercentage(a.idEvent) - this.getDonationPercentage(b.idEvent));
          break;
        case 'progress_desc':
          results.sort((a, b) => this.getDonationPercentage(b.idEvent) - this.getDonationPercentage(a.idEvent));
          break;
      }
    }

    this.filteredEvents = results;
    this.totalItems = results.length;
    this.currentPage = 1;
  }

  resetFilters(): void {
    this.searchParams = {};
    this.filteredEvents = [...this.events];
    this.totalItems = this.events.length;
    this.currentPage = 1;
  }

  get paginatedEvents(): Event[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEvents.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
}