import { Record } from './records';    

export interface Carnet {
  id: string;  // UUID
  medicalHistory: Record[];  // Liste des records médicaux
  pet_id: string;  // UUID de l'animal
}
