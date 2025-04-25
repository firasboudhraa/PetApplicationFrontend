import { Injectable } from '@angular/core';
import { Donation } from '../models/donation';

@Injectable({
  providedIn: 'root'
})
export class BadgeService {
  private badgeLevels = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
  private badgeThresholds = [50, 200, 500, 1000, 2000];

  getBadgeForAmount(amount: number): string {
    for (let i = this.badgeThresholds.length - 1; i >= 0; i--) {
      if (amount >= this.badgeThresholds[i]) {
        return this.badgeLevels[i];
      }
    }
    return 'New';
  }

  getNextBadge(total: number): {level: string, amountNeeded: number} | null {
    if (total >= 2000) return {level: 'Max', amountNeeded: 0};
    if (total >= 1000) return {level: 'Diamond', amountNeeded: 2000 - total};
    if (total >= 500) return {level: 'Platinum', amountNeeded: 1000 - total};
    if (total >= 200) return {level: 'Gold', amountNeeded: 500 - total};
    if (total >= 50) return {level: 'Silver', amountNeeded: 200 - total};
    return {level: 'Bronze', amountNeeded: 50 - total};
  }

  getBadgeLevels() {
    return this.badgeLevels;
  }

  getBadgeThresholds() {
    return this.badgeThresholds;
  }

  getBadgeColor(badgeLevel: string): string {
    switch(badgeLevel.toLowerCase()) {
      case 'bronze': return '#cd7f32';
      case 'silver': return '#c0c0c0';
      case 'gold': return '#ffd700';
      case 'platinum': return '#e5e4e2';
      case 'diamond': return '#b9f2ff';
      default: return '#6c757d';
    }
  }

  getBadgeIcon(badgeLevel: string): string {
    switch(badgeLevel.toLowerCase()) {
      case 'bronze': return 'fa-medal';
      case 'silver': return 'fa-medal';
      case 'gold': return 'fa-trophy';
      case 'platinum': return 'fa-crown';
      case 'diamond': return 'fa-gem';
      default: return 'fa-star';
    }
  }
}