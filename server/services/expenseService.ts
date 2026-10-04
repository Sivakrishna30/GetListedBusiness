import { db } from '../db.ts';
import { Expense, ExpenseCategory, PaymentMethod } from '../../shared/types.ts';

export class ExpenseService {
  public static list(businessId: string, filters?: { category?: ExpenseCategory; date?: string; startDate?: string; endDate?: string }): Expense[] {
    let list = db.getState().expenses.filter(e => e.businessId === businessId);

    if (filters?.category) {
      list = list.filter(e => e.category === filters.category);
    }
    if (filters?.date) {
      list = list.filter(e => e.date === filters.date);
    }
    if (filters?.startDate) {
      list = list.filter(e => e.date >= filters.startDate!);
    }
    if (filters?.endDate) {
      list = list.filter(e => e.date <= filters.endDate!);
    }

    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public static getById(id: string): Expense | undefined {
    return db.getState().expenses.find(e => e.id === id);
  }

  public static create(data: {
    businessId: string;
    category: ExpenseCategory;
    amount: number;
    date: string;
    description: string;
    paymentMethod: PaymentMethod;
    paidTo?: string;
    receiptRef?: string;
  }): Expense {
    if (!data.businessId || !data.amount || data.amount <= 0) {
      throw new Error('Valid business ID and positive expense amount are required');
    }
    if (!data.category || !data.description) {
      throw new Error('Category and description are required');
    }

    const newExpense: Expense = {
      id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      businessId: data.businessId,
      category: data.category,
      amount: Math.round(data.amount * 100) / 100,
      date: data.date || new Date().toISOString().split('T')[0],
      description: data.description.trim(),
      paymentMethod: data.paymentMethod || 'CASH',
      paidTo: data.paidTo?.trim(),
      receiptRef: data.receiptRef?.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.update(s => {
      s.expenses.push(newExpense);
    });

    return newExpense;
  }

  public static update(id: string, data: Partial<Omit<Expense, 'id' | 'businessId' | 'createdAt'>>): Expense {
    const state = db.getState();
    const idx = state.expenses.findIndex(e => e.id === id);
    if (idx === -1) {
      throw new Error('Expense not found');
    }

    const existing = state.expenses[idx];
    const updated: Expense = {
      ...existing,
      category: data.category || existing.category,
      amount: data.amount !== undefined ? Math.round(data.amount * 100) / 100 : existing.amount,
      date: data.date || existing.date,
      description: data.description !== undefined ? data.description.trim() : existing.description,
      paymentMethod: data.paymentMethod || existing.paymentMethod,
      paidTo: data.paidTo !== undefined ? data.paidTo.trim() : existing.paidTo,
      receiptRef: data.receiptRef !== undefined ? data.receiptRef.trim() : existing.receiptRef,
      updatedAt: new Date().toISOString(),
    };

    db.update(s => {
      s.expenses[idx] = updated;
    });

    return updated;
  }

  public static delete(id: string): void {
    const state = db.getState();
    const exists = state.expenses.some(e => e.id === id);
    if (!exists) {
      throw new Error('Expense not found');
    }

    db.update(s => {
      s.expenses = s.expenses.filter(e => e.id !== id);
    });
  }

  public static getSummary(businessId: string): {
    totalExpenses: number;
    byCategory: { category: ExpenseCategory; amount: number; count: number }[];
    recentExpenses: Expense[];
  } {
    const list = this.list(businessId);
    const totalExpenses = list.reduce((sum, e) => sum + e.amount, 0);

    const catMap = new Map<ExpenseCategory, { amount: number; count: number }>();
    list.forEach(e => {
      const cur = catMap.get(e.category) || { amount: 0, count: 0 };
      cur.amount += e.amount;
      cur.count += 1;
      catMap.set(e.category, cur);
    });

    const byCategory = Array.from(catMap.entries()).map(([category, val]) => ({
      category,
      amount: Math.round(val.amount * 100) / 100,
      count: val.count,
    }));

    return {
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      byCategory,
      recentExpenses: list.slice(0, 10),
    };
  }
}
