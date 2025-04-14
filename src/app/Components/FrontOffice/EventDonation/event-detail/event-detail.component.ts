import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FullEventResponse } from 'src/app/models/donation';
import { EventService } from 'src/app/Services/event-service.service';
import { Donation } from 'src/app/models/donation';
import { DonationService } from 'src/app/Services/donation-service.service';
import { UserService } from 'src/app/Services/user.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  id!: number;
  event: FullEventResponse | null = null;
  userDonations: Donation[] = [];
  availableUsers: any[] = [];

  constructor(
    private es: EventService, 
    private Act: ActivatedRoute, 
    private router: Router,
    private donationService: DonationService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.availableUsers = this.userService.getAllUsers();
    this.id = this.Act.snapshot.params['id'];    
    this.loadEventData();
  }

  switchUser(event: any): void {
    const userId = Number(event.target.value);
    this.userService.switchUser(userId);
    this.loadUserDonations(this.id); // Recharger les dons après changement d'utilisateur
  }

  private loadEventData(): void {
    this.es.getEventById(this.id).subscribe(
      (data) => {
        this.event = data;
        this.loadUserDonations(this.id); // Utilisez this.id au lieu de event.id pour plus de fiabilité
      },
      (error) => {
        console.error('Error loading event:', error);
      }
    );
  }
  
  private loadUserDonations(eventId: number): void {
    const userId = this.userService.getCurrentUserId();
    console.log('Loading donations for user:', userId, 'event:', eventId);
    
    this.donationService.getDonationsByUserAndEvent(userId, eventId)
      .subscribe({
        next: (donations) => {
          console.log('Donations received:', donations);
          this.userDonations = donations || [];
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading donations:', err);
          this.userDonations = [];
          this.cdr.detectChanges();
        }
      });
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

  hasUserDonated(): boolean {
    const hasDonations = this.userDonations.length > 0;
    console.log('Has user donated:', hasDonations); // Ajouté
    return hasDonations;
  }

  // Nouvelle méthode pour obtenir le montant total des dons de l'utilisateur
  getUserTotalDonations(): number {
    return this.userDonations
      .filter(d => d.status === 'COMPLETED')
      .reduce((sum, current) => sum + current.amount, 0);
  }
}