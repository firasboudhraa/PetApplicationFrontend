import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FullEventResponse } from 'src/app/models/donation';
import { EventService } from 'src/app/Services/event-service.service';
import { Donation } from 'src/app/models/donation';
import { DonationService } from 'src/app/Services/donation-service.service';
import { UserService } from 'src/app/Services/user.service';
import { ChangeDetectorRef } from '@angular/core';
import { BadgeService } from 'src/app/Services/badge.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  isGeneratingPDF = false;

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
          this.calculateUserTopBadge();
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

  getCompletedUserDonations(): Donation[] {
    return this.userDonations?.filter(d => d.status === 'COMPLETED') || [];
  }

  getBadgeColor(badgeLevel: string): string {
    return this.badgeService.getBadgeColor(badgeLevel);
  }

  getBadgeIcon(badgeLevel: string): string {
    return this.badgeService.getBadgeIcon(badgeLevel);
  }

  private getBase64ImageFromURL(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.height = img.height;
        canvas.width = img.width;
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = error => reject(error);
      img.src = url;
    });
  }

  async generateDonationPDF(donation: Donation): Promise<void> {
    this.isGeneratingPDF = true;
    try {
      const doc = new jsPDF();
      
      // Add logo
      try {
        const logoData = await this.getBase64ImageFromURL('assets/images/logo.png');
        doc.addImage(logoData, 'PNG', 15, 10, 30, 30);
      } catch (e) {
        console.warn('Logo not loaded, continuing without it');
      }

      // Header
      doc.setFontSize(20);
      doc.setTextColor(40, 53, 147);
      doc.text('Donation Receipt', 105, 30, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text('Thank you for your generous donation', 105, 40, { align: 'center' });
      
      // Event info
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`Event: ${this.event?.nameEvent}`, 14, 55);
      doc.text(`Date: ${new Date(donation.date).toLocaleDateString()}`, 14, 65);
      
      // Donation details
      autoTable(doc, {
        startY: 75,
        head: [['Description', 'Details']],
        body: [
          ['Donation ID', donation.id.toString()],
          ['Amount', `${donation.amount} DT`],
          ['Status', donation.status],
          ['Badge Level', donation.badgeLevel],
          ['Payment Method', donation.paymentMethod || 'N/A'],
        ],
        theme: 'grid',
        headStyles: {
          fillColor: [67, 97, 238],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        styles: {
          cellPadding: 5,
          fontSize: 12,
          valign: 'middle'
        }
      });
      
      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('This is an official donation receipt. Thank you for your support!', 
              105, doc.internal.pageSize.height - 20, { align: 'center' });
      doc.text('Generated on: ' + new Date().toLocaleDateString(), 
              105, doc.internal.pageSize.height - 15, { align: 'center' });
      
      // Save PDF
      doc.save(`Donation_Receipt_${donation.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      this.isGeneratingPDF = false;
    }
  }

  async generateAllDonationsPDF(): Promise<void> {
    if (!this. userDonations || this.userDonations.length === 0) return;
    
    this.isGeneratingPDF = true;
    try {
      const doc = new jsPDF();
      
      // Add logo
      try {
        const logoData = await this.getBase64ImageFromURL('assets/images/logo.png');
        doc.addImage(logoData, 'PNG', 15, 10, 30, 30);
      } catch (e) {
        console.warn('Logo not loaded, continuing without it');
      }

      // Header
      doc.setFontSize(20);
      doc.setTextColor(40, 53, 147);
      doc.text('Your Donation History', 105, 30, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Event: ${this.event?.nameEvent}`, 105, 40, { align: 'center' });
      
      // Prepare data
      const donationsData = this.userDonations.map(d => [
        new Date(d.date).toLocaleDateString(),
        `${d.amount} DT`,
        d.status,
        d.badgeLevel,
        d.paymentMethod || 'N/A'
      ]);
      
      // Add table
      autoTable(doc, {
        startY: 50,
        head: [['Date', 'Amount', 'Status', 'Badge', 'Payment Method']],
        body: donationsData,
        theme: 'striped',
        headStyles: {
          fillColor: [67, 97, 238],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 25 },
          2: { cellWidth: 30 },
          3: { cellWidth: 25 },
          4: { cellWidth: 40 }
        },
        styles: {
          cellPadding: 5,
          fontSize: 10,
          valign: 'middle'
        }
      });
      
      // Add summary
      const finalY = (doc as any).lastAutoTable?.finalY || 50 + donationsData.length * 10;
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`Total Donations: ${this.getUserTotalDonations()} DT`, 14, finalY + 20);
      
      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Generated on: ' + new Date().toLocaleDateString(), 
              105, doc.internal.pageSize.height - 10, { align: 'center' });
      
      // Save PDF
      doc.save(`Donation_History_${this.event?.nameEvent}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      this.isGeneratingPDF = false;
    }
  }
}