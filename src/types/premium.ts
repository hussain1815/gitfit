export type PremiumPlan = {
    id: string;
    name: string;
    price: number;
    features: string[];
  };
  
  export type PaymentMethod = {
    cardNumber: string;
    expiryDate: string;
    cvc: string;
    cardHolder: string;
  };
  
  export type PremiumStatus = {
    isPremium: boolean;
    plan?: string;
    expiryDate?: string;
    paymentMethod?: PaymentMethod;
  };