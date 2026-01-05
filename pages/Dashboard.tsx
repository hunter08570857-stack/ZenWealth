
import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { parseNaturalLanguageTransaction } from '../services/geminiService';
import { Transaction, BankAccount, SavingGoal } from '../types';
import { CATEGORIES } from '../constants';
import { TrendingUp, TrendingDown, Wallet, ArrowRight, Plus, Sparkles, Loader2, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<SavingGoal[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  useEffect(() => {
    loadData();
    window.addEventListener('db_updated', loadData);
    return () => window.removeEventListener('db_updated', loadData);
  }, []);

  const loadData = () => {
    setAccounts(dbService.getAccounts());
    setTransactions(dbService.getTransactions().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setGoals(dbService.getGoals());
  };

  const handleAiFastEntry = async () => {
    if (!aiInput.trim()) return;
    if (accounts.length === 0) return alert('請先建立一個銀行帳戶。');
    
    setIsParsing(true);
    const result = await parseNaturalLanguageTransaction(aiInput, CATEGORIES);
    if (result) {
      const tx: Transaction = {
        ...result,
        id: Date.now().toString(),
        accountId: accounts[0].id // Default to first account
      };
      dbService.saveTransaction(tx);
      setAiInput('');
      loadData();
      alert(`已成功解析並新增：${result.note} $${result.amount}`);
    } else {
      alert('AI 無法解析該文字，請嘗試更具體的描述。');
    }
    setIsParsing(false);
  };

  const totalBalance = accounts.reduce((acc, a) => acc + a.balance, 0);
  const monthlyTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const monthlyExpense = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">資產總覽</h1>
          <p className="text-slate-500">掌握您的財務狀況，智慧管理每一分錢</p>
        </div>
        <div className="flex gap-3">
          <Link to="/transactions" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all">
            <Plus size={20} /> 新增交易
          </Link>
        </div>
      </header>

      {/* AI Fast Entry */}
      <div className="bg-white p-6 rounded-3xl border border-indigo-100 shadow-sm shadow-indigo-50">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={18} className="text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">AI 快速記帳 (創意功能 #1)</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <input 
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="例如：『昨天晚餐花了 300 元』或『今天領薪水 50000 元』"
            value={aiInput}
            onChange={e => setAiInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAiFastEntry()}
          />
          <button 
            onClick={handleAiFastEntry}
            disabled={isParsing || !aiInput.trim()}
            className="bg-indigo-600 disabled:bg-slate-300 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
          >
            {isParsing ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
            解析並記錄
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <Wallet size={20} />
            </div>
            <p className="text-sm font-medium text-slate-500">總資產</p>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">${totalBalance.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <p className="text-sm font-medium text-slate-500">本月收入</p>
          </div>
          <h3 className="text-2xl font-bold text-emerald-600">+${monthlyIncome.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
              <TrendingDown size={20} />
            </div>
            <p className="text-sm font-medium text-slate-500">本月支出</p>
          </div>
          <h3 className="text-2xl font-bold text-rose-600">-${monthlyExpense.toLocaleString()}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">最近交易</h2>
            <Link to="/transactions" className="text-indigo-600 font-medium text-sm flex items-center gap-1 hover:underline">
              查看全部 <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-4">
            {transactions.slice(0, 5).map(tx => {
              const category = CATEGORIES.find(c => c.id === tx.categoryId);
              return (
                <div key={tx.id} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${category?.color}`}>
                    {category?.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">{tx.note || category?.name}</p>
                    <p className="text-xs text-slate-500">{tx.date}</p>
                  </div>
                  <p className={`font-bold ${tx.type === 'expense' ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {tx.type === 'expense' ? '-' : '+'}${tx.amount.toLocaleString()}
                  </p>
                </div>
              );
            })}
            {transactions.length === 0 && <p className="text-center text-slate-400 py-10">尚無交易紀錄</p>}
          </div>
        </section>

        {/* Saving Goals Progress */}
        <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Target className="text-indigo-600" size={20} /> 儲蓄目標進度 (創意功能 #2)
            </h2>
            <Link to="/goals" className="text-indigo-600 font-medium text-sm flex items-center gap-1 hover:underline">
              管理目標 <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-6">
            {goals.slice(0, 3).map(goal => {
              const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-2xl mr-2">{goal.icon}</span>
                      <span className="font-bold text-slate-800">{goal.name}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-500">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                    <span>${goal.currentAmount.toLocaleString()}</span>
                    <span>目標: ${goal.targetAmount.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
            {goals.length === 0 && (
              <div className="text-center py-10">
                <p className="text-slate-400 mb-4">還沒有設定儲蓄目標嗎？</p>
                <Link to="/goals" className="text-indigo-600 font-bold border-b-2 border-indigo-600">現在去設定</Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
