import { Record } from './records';    

export interface Carnet {
  medicalRecords: globalThis.Record<string, any>[];
  id: number;  // UUID
  name: string;  // Nom du carnet
  medicalHistory: Record[];  // Liste des records médicaux
  pet_id: string;  // UUID de l'animal
  photoUrl?: string;  // Ajout de la propriété photoUrl

}

