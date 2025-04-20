export interface Product {
  id_Product?: number;
  nom: string;
  description: string;
  prix: number;
  imageUrl: string;
  stock: number;
  marketplaceId: number;
  lowStockThreshold: number;
  alertSent: boolean;
  category: string;
  quantity: number;

}
