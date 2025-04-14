import { RecordTypeEnum } from './recordtypeEnum';

export interface Record {
date: string|number|Date;
  dateTime: string; 
   type: RecordTypeEnum;
  description: string;
  next_due_date: Date;
  carnet_id: string;
  poids: number;
}
export { RecordTypeEnum };

export interface FullCarnetResponse {
id: any;
  name: string;
  medicalRecords: Record[];
}