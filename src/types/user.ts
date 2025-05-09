export type UserRole = 'trainer' | 'trainee' | 'admin';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  isPremium: boolean;
  createdAt: Date;
}