import { RecordTypeEnum } from './recordtypeEnum';

export interface Record {
  date: Date;
  type: string;
  description: string;
  next_due_date: Date;
  carnet_id: string;
}
export { RecordTypeEnum };

