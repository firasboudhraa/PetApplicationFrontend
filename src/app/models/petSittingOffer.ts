import { Pet } from "./pet";

export interface PetSittingOffer {
    id: number;
    price: number;
    pet: Pet;
    startDate: string;
    endDate: string;
    locationInLetters: string;
    offerType: string;
    amountPerDay: number | null; 
  }
  