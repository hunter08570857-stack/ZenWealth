
import { BankAccount, Transaction, SavingGoal } from "../types";
// @fix: APP_STORAGE_KEY is exported from constants.tsx, not types.ts
import { APP_STORAGE_KEY } from "../constants";

interface DbSchema {
  accounts: BankAccount[];
  transactions: Transaction[];
  goals: SavingGoal[];
}

const getDb = (): DbSchema => {
  const data = localStorage.getItem(APP_STORAGE_KEY);
  return data ? JSON.parse(data) : { accounts: [], transactions: [], goals: [] };
};

const saveDb = (db: DbSchema) => {
  localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(db));
  // Dispatch custom event to notify other components
  window.dispatchEvent(new Event('db_updated'));
};

export const dbService = {
  getAccounts: (): BankAccount[] => getDb().accounts,
  
  saveAccount: (account: BankAccount) => {
    const db = getDb();
    const index = db.accounts.findIndex(a => a.id === account.id);
    if (index >= 0) {
      db.accounts[index] = account;
    } else {
      db.accounts.push(account);
    }
    saveDb(db);
  },

  deleteAccount: (id: string) => {
    const db = getDb();
    db.accounts = db.accounts.filter(a => a.id !== id);
    db.transactions = db.transactions.filter(t => t.accountId !== id);
    saveDb(db);
  },

  getTransactions: (): Transaction[] => getDb().transactions,

  saveTransaction: (transaction: Transaction) => {
    const db = getDb();
    const account = db.accounts.find(a => a.id === transaction.accountId);
    if (!account) return;

    const oldTx = db.transactions.find(t => t.id === transaction.id);
    
    if (oldTx) {
      account.balance += (oldTx.type === 'expense' ? oldTx.amount : -oldTx.amount);
      const index = db.transactions.findIndex(t => t.id === transaction.id);
      db.transactions[index] = transaction;
    } else {
      db.transactions.push(transaction);
    }

    account.balance += (transaction.type === 'expense' ? -transaction.amount : transaction.amount);
    saveDb(db);
  },

  deleteTransaction: (id: string) => {
    const db = getDb();
    const tx = db.transactions.find(t => t.id === id);
    if (tx) {
      const account = db.accounts.find(a => a.id === tx.accountId);
      if (account) {
        account.balance += (tx.type === 'expense' ? tx.amount : -tx.amount);
      }
      db.transactions = db.transactions.filter(t => t.id !== id);
      saveDb(db);
    }
  },

  getGoals: (): SavingGoal[] => getDb().goals || [],

  saveGoal: (goal: SavingGoal) => {
    const db = getDb();
    const goals = db.goals || [];
    const index = goals.findIndex(g => g.id === goal.id);
    if (index >= 0) {
      goals[index] = goal;
    } else {
      goals.push(goal);
    }
    db.goals = goals;
    saveDb(db);
  },

  deleteGoal: (id: string) => {
    const db = getDb();
    db.goals = (db.goals || []).filter(g => g.id !== id);
    saveDb(db);
  }
};
