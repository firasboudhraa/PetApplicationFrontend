// leaderboard.component.ts
import { Component, OnInit } from '@angular/core';
import { DonationService } from 'src/app/Services/donation-service.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  topDonors: {user: {id: number, name: string}, total: number}[] = [];
  isLoading = true;

  constructor(private donationService: DonationService) {}

  ngOnInit(): void {
    this.loadLeaderboard();
  }

  loadLeaderboard(): void {
    this.isLoading = true;
    this.donationService.getTopDonors().subscribe({
      next: data => {
        this.topDonors = data;
        this.isLoading = false;
      },
      error: error => {
        console.error('Error loading leaderboard', error);
        this.isLoading = false;
      }
    });
  }
}