
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { dbService } from '../services/dbService';
import { getFinancialAdvice } from '../services/geminiService';
import { Transaction, BankAccount, AIAdvice } from '../types';
import { CATEGORIES } from '../constants';
import { Sparkles, BrainCircuit, Activity, CheckCircle2, Loader2, RefreshCw, BarChart3 } from 'lucide-react';

const Reports: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [aiAdvice, setAiAdvice] = useState<AIAdvice | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTransactions(dbService.getTransactions());
    setAccounts(dbService.getAccounts());
  };

  const generateAIAdvice = async () => {
    if (transactions.length === 0) return alert('請先新增交易紀錄以供 AI 分析。');
    setIsAiLoading(true);
    const advice = await getFinancialAdvice(transactions, accounts, CATEGORIES);
    setAiAdvice(advice);
    setIsAiLoading(false);
  };

  // Pie Chart Data
  const expenseByCategory = CATEGORIES.map(cat => {
    const total = transactions
      .filter(t => t.categoryId === cat.id && t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    return { name: cat.name, value: total };
  }).filter(item => item.value > 0);

  // Bar Chart Data (Last 4 Months)
  const getMonthName = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}月`;
  };

  const last4Months = Array.from({ length: 4 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (3 - i));
    const label = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const monthlyTxs = transactions.filter(t => t.date.startsWith(label));
    const income = monthlyTxs.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = monthlyTxs.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    return { name: `${d.getMonth() + 1}月`, 收入: income, 支出: expense };
  });

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#F97316'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">報表與 AI 分析</h1>
        <p className="text-slate-500">視覺化您的收支趨勢，並獲得量身打造的智慧建議</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expenditure Pie Chart */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Activity className="text-indigo-600" size={20} /> 支出比例分析
          </h2>
          <div className="h-[300px]">
            {expenseByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 italic">尚無支出數據</div>
            )}
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="bg-indigo-900 rounded-3xl shadow-xl overflow-hidden text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <BrainCircuit size={120} />
          </div>
          
          <div className="p-8 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles size={24} className="text-yellow-400" /> AI 財務管家
              </h2>
              {aiAdvice && (
                <button 
                  onClick={generateAIAdvice}
                  disabled={isAiLoading}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                >
                  <RefreshCw size={18} className={isAiLoading ? 'animate-spin' : ''} />
                </button>
              )}
            </div>

            {!aiAdvice ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
                  <BrainCircuit size={40} className="text-indigo-300" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">準備好接收 AI 的分析了嗎？</h3>
                  <p className="text-indigo-200 text-sm max-w-xs">我們將根據您的近期交易與資產狀況，提供量身打造的理財建議。</p>
                </div>
                <button 
                  onClick={generateAIAdvice}
                  disabled={isAiLoading}
                  className="px-8 py-4 bg-white text-indigo-900 font-bold rounded-2xl shadow-xl shadow-indigo-950/20 hover:scale-105 transition-all flex items-center gap-2"
                >
                  {isAiLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                  {isAiLoading ? '分析中...' : '生成報告'}
                </button>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-black">{aiAdvice.healthScore}</div>
                  <div className="text-sm font-medium px-3 py-1 bg-white/20 rounded-full">健康分數</div>
                </div>
                <div>
                  <p className="text-lg leading-relaxed">{aiAdvice.summary}</p>
                </div>
                <div className="space-y-3">
                  {aiAdvice.suggestions.map((s, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                      <CheckCircle2 size={18} className="text-emerald-400 mt-1 shrink-0" />
                      <span className="text-sm">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bar Chart - (Extra Feature #3: Multi-dimensional Trend Analysis) */}
        <div className="col-span-full bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <BarChart3 className="text-indigo-600" size={20} /> 收支趨勢比較 (創意功能 #3)
          </h2>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last4Months} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontWeight: 600 }} />
                <Tooltip 
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="收入" fill="#10B981" radius={[6, 6, 0, 0]} barSize={40} />
                <Bar dataKey="支出" fill="#F43F5E" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
