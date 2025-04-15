import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FullEventResponse } from 'src/app/models/donation';
import { EventService } from 'src/app/Services/event-service.service';
import { Donation } from 'src/app/models/donation';
import { DonationService } from 'src/app/Services/donation-service.service';
import { UserService } from 'src/app/Services/user.service';
import { ChangeDetectorRef } from '@angular/core';
import { BadgeService } from 'src/app/Services/badge.service';

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
  badgeLevels: string[] = [];
  badgeThresholds: number[] = [];
  userTopBadge: string = '';
  nextBadge: {level: string, amountNeeded: number} | null = null;

  constructor(
    private es: EventService, 
    private Act: ActivatedRoute, 
    private router: Router,
    private donationService: DonationService,
    private userService: UserService,
    private badgeService: BadgeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.availableUsers = this.userService.getAllUsers();
    this.id = this.Act.snapshot.params['id'];    
    this.loadEventData();
    this.loadBadgeLevels();
  }

  private loadEventData(): void {
    this.es.getEventById(this.id).subscribe(
      (data: FullEventResponse) => {
        this.event = {
          ...data,
          donations: data.donations || [],
          ratings: data.ratings || [],
          feedbacks: data.feedbacks || [],
          averageRating: data.averageRating || 0
        };
        this.loadUserDonations(this.id);
      },
      (error) => {
        console.error('Error loading event:', error);
      }
    );
  }

  private loadUserDonations(eventId: number): void {
    const userId = this.userService.getCurrentUserId();
    
    this.donationService.getDonationsByUserAndEvent(userId, eventId)
      .subscribe({
        next: (donations) => {
          this.userDonations = (donations || []).map((d: any) => {
            if (!d.badgeLevel) {
              d.badgeLevel = this.getBadgeForAmount(d.amount);
            }
            return d;
          });
          this.calculateUserTopBadge(); // Add this line
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading donations:', err);
          this.userDonations = [];
          this.userTopBadge = 'New Donor';
          this.cdr.detectChanges();
        }
      });
  }

  private loadBadgeLevels(): void {
    this.donationService.getBadgeLevels().subscribe({
      next: (data: any) => {
        this.badgeLevels = data.levels;
        this.badgeThresholds = data.thresholds;
      },
      error: (err) => console.error('Error loading badge levels:', err)
    });
  }

  private calculateUserTopBadge(): void {
    const total = this.getUserTotalDonations();
    this.userTopBadge = this.getBadgeForAmount(total);
    this.calculateNextBadge();
  }
  
  private getBadgeForAmount(amount: number): string {
    if (amount >= 2000) return 'Diamond';
    if (amount >= 1000) return 'Platinum';
    if (amount >= 500) return 'Gold';
    if (amount >= 200) return 'Silver';
    if (amount >= 50) return 'Bronze';
    return 'New Donor';
  }

  private calculateNextBadge(): void {
    const total = this.getUserTotalDonations();
    this.nextBadge = this.badgeService.getNextBadge(total);
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
    return this.userDonations.length > 0;
  }

  getUserTotalDonations(): number {
    return this.userDonations
      .filter(d => d.status === 'COMPLETED')
      .reduce((sum, current) => sum + current.amount, 0);
  }

  getBadgeColor(badgeLevel: string): string {
    return this.badgeService.getBadgeColor(badgeLevel);
  }

  getBadgeIcon(badgeLevel: string): string {
    return this.badgeService.getBadgeIcon(badgeLevel);
  }
}