import { Pet } from "./pet";

export interface AdoptionRequest {
    id: number;
    adoptedPet: Pet; // Represents the Pet entity (linked via @ManyToOne)
    requesterUserId: number;
    location: string;
    message: string;
    isConfirmed: boolean;
    isRejected: boolean;
    isChangedByPetOwner: boolean;
    isChangedByRequestOwner: boolean;
    date: Date;  // Using Date type
    time: string;
}
