export interface Donation {
    id: number;
    amount: number;
    date: string; // ou LocalDateTime si tu veux gérer en tant que Date
    eventId: number;
    status: String;
  }

export interface FullEventResponse {
    nameEvent: string;
    description: string;
    dateEvent: string;  // ou Date, si tu veux utiliser le type Date natif
    location: string;
    donations: Donation[];
  }
  