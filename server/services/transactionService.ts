import { db } from '../db.ts';
import { Transaction, TransactionType, PaymentMethod, TransactionStatus } from '../../shared/types.ts';

export class TransactionService {
  public static list(businessId: string, filters?: { type?: TransactionType; date?: string; status?: TransactionStatus }): Transaction[] {
    let list = db.getState().transactions.filter(t => t.businessId === businessId);

    if (filters?.type) {
      list = list.filter(t => t.type === filters.type);
    }
    if (filters?.date) {
      list = list.filter(t => t.date === filters.date);
    }
    if (filters?.status) {
      list = list.filter(t => t.status === filters.status);
    }

    // Sort by date descending
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public static getById(id: string): Transaction | undefined {
    return db.getState().transactions.find(t => t.id === id);
  }

  public static recordIncome(data: {
    businessId: string;
    category: string;
    amount: number;
    paymentMethod: PaymentMethod;
    date: string;
    bookingId?: string;
    customerId?: string;
    customerName?: string;
    description?: string;
    referenceNumber?: string;
  }): Transaction {
    if (!data.businessId || !data.amount || data.amount <= 0) {
      throw new Error('Valid business ID and positive amount are required');
    }

    const newTx: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      businessId: data.businessId,
      type: 'INCOME',
      category: data.category || 'DIRECT_SALE',
      amount: Math.round(data.amount * 100) / 100,
      paymentMethod: data.paymentMethod || 'CASH',
      status: 'SUCCESS',
      date: data.date || new Date().toISOString().split('T')[0],
      bookingId: data.bookingId,
      customerId: data.customerId,
      customerName: data.customerName,
      description: data.description,
      referenceNumber: data.referenceNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.update(s => {
      s.transactions.push(newTx);
    });

    return newTx;
  }

  public static getSummary(businessId: string): {
    totalIncome: number;
    totalTransactionsCount: number;
    byPaymentMethod: { method: PaymentMethod; amount: number; count: number }[];
    recentTransactions: Transaction[];
  } {
    const list = this.list(businessId, { status: 'SUCCESS' });
    const incomeList = list.filter(t => t.type === 'INCOME');
    const totalIncome = incomeList.reduce((sum, t) => sum + t.amount, 0);

    const methodMap = new Map<PaymentMethod, { amount: number; count: number }>();
    incomeList.forEach(t => {
      const current = methodMap.get(t.paymentMethod) || { amount: 0, count: 0 };
      current.amount += t.amount;
      current.count += 1;
      methodMap.set(t.paymentMethod, current);
    });

    const byPaymentMethod = Array.from(methodMap.entries()).map(([method, val]) => ({
      method,
      amount: Math.round(val.amount * 100) / 100,
      count: val.count,
    }));

    return {
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalTransactionsCount: list.length,
      byPaymentMethod,
      recentTransactions: list.slice(0, 10),
    };
  }
}
