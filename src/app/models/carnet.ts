import { Record } from './records';    

export interface Carnet {
  id: number;  // UUID
  name: string;  // Nom du carnet
  medicalHistory: Record[];  // Liste des records médicaux
  pet_id: string;  // UUID de l'animal
}

