import { Record } from './records';    

export interface Carnet {
  id: number;  // UUID
  medicalHistory: Record[];  // Liste des records médicaux
  pet_id: string;  // UUID de l'animal
}

