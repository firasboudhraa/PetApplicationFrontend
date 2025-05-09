import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { EventService } from 'src/app/Services/event-service.service';
import { Event } from 'src/app/models/event';
import { DonationService } from 'src/app/Services/donation-service.service';
import { Donation } from 'src/app/models/donation';
import Swal from 'sweetalert2'; // Import SweetAlert2

interface SearchParams {
  name?: string;
  location?: string;
  date?: string;
  progress?: string;
  sortBy?: string;
}

@Component({
  selector: 'app-eventback',
  templateUrl: './eventback.component.html',
  styleUrls: ['./eventback.component.css']
})
export class EventbackComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  donations: Donation[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalItems: number = 0;
  searchParams: SearchParams = {};

  constructor(
    private eventService: EventService,
    private donationService: DonationService,
    private router: Router,
    private http: HttpClient
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

    if (this.searchParams.name) {
      results = results.filter(event => 
        event.nameEvent.toLowerCase().includes(this.searchParams.name!.toLowerCase())
      );
    }

    if (this.searchParams.location) {
      results = results.filter(event => 
        event.location.toLowerCase().includes(this.searchParams.location!.toLowerCase())
      );
    }

    if (this.searchParams.date) {
      const searchDate = new Date(this.searchParams.date);
      results = results.filter(event => {
        const eventDate = new Date(event.dateEvent);
        return eventDate.toDateString() === searchDate.toDateString();
      });
    }

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

  deleteEvent(eventId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the event!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4361ee',
      cancelButtonColor: '#e7515a',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
      reverseButtons: true,
      customClass: {
        popup: 'custom-swal-popup', // Classe CSS personnalisée
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventService.deleteEvent(eventId).subscribe(
          () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'The event has been deleted.',
              icon: 'success',
              confirmButtonColor: '#4361ee',
              timer: 2000,
              timerProgressBar: true,
            });
            
            this.loadEvents();
            this.loadDonations();
          },
          (error) => {
            console.error('Error deleting event', error);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete event. Please try again.',
              icon: 'error',
              confirmButtonColor: '#e7515a',
            });
          }
        );
      }
    });
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