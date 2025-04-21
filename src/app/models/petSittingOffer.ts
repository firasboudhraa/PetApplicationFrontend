import { Pet } from "./pet";
export interface UserRequestStatus {
  userId: number;
  status: string; 
}
export interface PetSittingOffer {
    id: number;
    price: number;
    pet: Pet;
    startDate: string;
    endDate: string;
    locationInLetters: string;
    offerType: string;
    amountPerDay: number | null; 
    userRequestStatuses: UserRequestStatus[];
  }
  