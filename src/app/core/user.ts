export interface User {
    uid: string;
    email: string;
    photoURL?: string;
    displayName?: string;
    role?: string;
    isOnBoarded?: boolean;
    stripeCustomerId?: string;
    subscriptions?: {
      [key: string]: 'active' | 'pastDue' | 'cancelled';
    }
    accountId?: string;
    refreshToken?: string;
    company?:string
    createdAt?: any, 
      updatedAt?: any
    }