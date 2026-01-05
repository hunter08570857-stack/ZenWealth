
import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { Transaction, BankAccount, TransactionType } from '../types';
import { CATEGORIES } from '../constants';
import { Plus, Search, Filter, Trash2, X, ChevronDown, Calendar } from 'lucide-react';

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');

  // Form State
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const accs = dbService.getAccounts();
    setAccounts(accs);
    setTransactions(dbService.getTransactions().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    if (accs.length > 0) setAccountId(accs[0].id);
  };

  const handleSave = () => {
    if (!amount || !accountId) return alert('請填寫金額與選擇帳戶');
    const tx: Transaction = {
      id: Date.now().toString(),
      type,
      amount: parseFloat(amount),
      accountId,
      categoryId,
      date,
      note,
    };
    dbService.saveTransaction(tx);
    loadData();
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setAmount('');
    setNote('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleDelete = (id: string) => {
    if (confirm('確定要刪除這筆交易嗎？帳戶餘額將自動歸還。')) {
      dbService.deleteTransaction(id);
      loadData();
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchSearch = tx.note.toLowerCase().includes(search.toLowerCase()) || 
                       CATEGORIES.find(c => c.id === tx.categoryId)?.name.includes(search);
    const matchType = filterType === 'all' || tx.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">交易紀錄管理</h1>
          <p className="text-slate-500">追蹤您的每一筆收入與支出細節</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all"
        >
          <Plus size={20} /> 新增交易
        </button>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"><Search size={18} /></span>
          <input 
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            placeholder="搜尋備註或分類..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="px-4 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-medium text-slate-600"
            value={filterType}
            onChange={e => setFilterType(e.target.value as any)}
          >
            <option value="all">所有類型</option>
            <option value="income">收入</option>
            <option value="expense">支出</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">日期</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">分類</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">備註 / 帳戶</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">金額</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map(tx => {
                const category = CATEGORIES.find(c => c.id === tx.categoryId);
                const account = accounts.find(a => a.id === tx.accountId);
                return (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{tx.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${category?.color}`}>
                          {category?.icon || '✨'}
                        </span>
                        <span className="font-semibold text-slate-700">{category?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{tx.note || '-'}</p>
                      <p className="text-xs text-slate-400">{account?.name || '未知帳戶'}</p>
                    </td>
                    <td className={`px-6 py-4 text-right font-bold text-lg ${tx.type === 'expense' ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {tx.type === 'expense' ? '-' : '+'}{tx.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => handleDelete(tx.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-400">尚無相關紀錄</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">新增交易</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-6">
              {/* Type Switcher */}
              <div className="flex p-1 bg-slate-100 rounded-2xl">
                <button 
                  onClick={() => setType('expense')}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${type === 'expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}
                >支出</button>
                <button 
                  onClick={() => setType('income')}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
                >收入</button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">日期</label>
                  <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">金額</label>
                  <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-right font-bold text-xl" placeholder="0" value={amount} onChange={e => setAmount(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">帳戶</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={accountId} onChange={e => setAccountId(e.target.value)}>
                    <option value="">選擇帳戶</option>
                    {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name} (${acc.balance})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">分類</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                    {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">備註</label>
                <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="想記點什麼..." value={note} onChange={e => setNote(e.target.value)} />
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-all">取消</button>
              <button onClick={handleSave} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">新增交易</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
