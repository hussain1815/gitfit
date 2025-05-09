// Add to src/types/user.ts
export type UserType = 'trainee' | 'trainer';

export type UserData = {
  email: string;
  name: string;
  userType: UserType;
  createdAt: string;
  premium?: {
    isPremium: boolean;
    plan?: string;
    expiryDate?: string;
    paymentMethod?: {
      last4: string;
      brand: string;
    };
  };
};