export interface Event {
  idEvent: number;
  nameEvent: string;
  description: string;
  dateEvent: string;
  location: string;
  latitude?: number;
  longitude?: number;
  goalAmount: number;
  ratings?: number[];
  feedbacks?: string[];
}