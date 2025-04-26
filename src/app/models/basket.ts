export interface Basket {
    id_Basket: number;
    dateCreation: string;
    statut: string;
    total: number;
    quantity: number;
    modePaiement: string | null;
    dateValidation: string | null;
    dateModification: string | null;
    userId: number;
    productIds: number[];
    productIdsList?: number[]; 
    productDetailsList?: any[];
}
