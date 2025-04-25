export interface Event {
  idEvent: number;
  nameEvent: string;
  description: string;
  dateEvent: string;
  location: string;
  latitude?: number;
  longitude?: number;
  goalAmount: number;
  ratings?: EventRating[];
}

export interface EventRating {
  value: number;
  feedback: string;
  userId: number;
}