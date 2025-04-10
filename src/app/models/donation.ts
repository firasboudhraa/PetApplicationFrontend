export interface Donation {
    id: number;
    amount: number;
    date: string; 
    eventId: number;
    status: String;
  }

export interface FullEventResponse {
    id: number;
    nameEvent: string;
    description: string;
    dateEvent: string;
    location: string;
    goalAmount: number;
    donations: Donation[];
  }
  