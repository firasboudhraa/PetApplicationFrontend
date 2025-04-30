import { Pet } from "./pet";

export interface AdoptionRequest {
    id: number;
    adoptedPet: Pet; 
    requesterUserId: number;
    location: string;
    message: string;
    isConfirmed: boolean;
    isRejected: boolean;
    isChangedByPetOwner: boolean;
    isChangedByRequestOwner: boolean;
    date: Date; 
    time: string;
    rejectionReason: string;
    changedFields: string[];
    isTranfered: boolean ;
}
