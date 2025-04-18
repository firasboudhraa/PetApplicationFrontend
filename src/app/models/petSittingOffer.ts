import { Pet } from "./pet";

export interface PetSittingOffer {
    id: number;
    price: number;
    position: string;
    pet: Pet;
    startDate: string;
    endDate: string;
  }
  