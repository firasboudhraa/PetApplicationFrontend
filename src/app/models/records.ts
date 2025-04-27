import { RecordTypeEnum } from './recordtypeEnum';

export interface Record {
  id:number;
  nextDate: string;
date: string|number|Date;
  dateTime: string; 
   type: RecordTypeEnum;
  description: string;
  next_due_date: Date;
  carnet_Id: string;
  poids: number;
  imageUrl:string;
}
export { RecordTypeEnum };

export interface FullCarnetResponse {
  records: any;
id: any;
  name: string;
  medicalRecords: Record[];
}