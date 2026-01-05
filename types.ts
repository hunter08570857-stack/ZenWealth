
export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface BankAccount {
  id: string;
  name: string;
  balance: number;
  color: string;
  bankName: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string;
  note: string;
}

export interface SavingGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  joinDate: string;
}

export interface AIAdvice {
  summary: string;
  suggestions: string[];
  healthScore: number;
}
