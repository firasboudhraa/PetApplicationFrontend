import { RecordTypeEnum } from './recordtypeEnum';

export interface Record {
  id: string;  // UUID
  date: Date;
  type: RecordTypeEnum;
  description: string;
  veterinarian_id: string;  // UUID du vétérinaire
  next_due_date?: Date;  // Facultatif
  carnet_id: string;  // UUID du carnet
  attachments?: string[];  // Liste de fichiers attachés (facultatif)
}
