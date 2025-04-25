import { Basket } from '../models/basket';
import { User } from '../models/user';

export interface PaymentRequest {
  basketDTO: Basket;
  userDTO: User;
}

export interface Payment {
  id_Payment: number;
  amount: number;
  status: string;
  paymentMethod: string;
  paymentDate: string;
  basketId: number;
  userId: number;
}
