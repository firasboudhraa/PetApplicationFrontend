export interface Donation {
  id: number;
  amount: number;
  date: string; 
  eventId: number;
  userId: number;
  status: string;
  paymentMethod: string;
  badgeLevel: string;
}

export interface FullEventResponse {
  idEvent: number;
  nameEvent: string;
  description: string;
  dateEvent: string;
  location: string;
  goalAmount: number;
  donations: Donation[];
  ratings?: number[];
  feedbacks?: string[];
  averageRating?: number;
}