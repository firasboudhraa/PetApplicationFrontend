import { AdoptionRequest } from "./adoptionRequest";

export interface Pet {
    id: number;
    name: string;
    imagePath: string
    species: string;
    age: number;
    color: string;
    sex: string;
    ownerId: number;
    description:string;
    forAdoption: boolean;
    location:string ;
    adoptionRequests: AdoptionRequest[];
  }
  