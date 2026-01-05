
import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { SavingGoal } from '../types';
import { Plus, Trash2, X, Target, Flag } from 'lucide-react';

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<SavingGoal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [icon, setIcon] = useState('💰');

  const icons = ['💰', '🚗', '🏠', '✈️', '💍', '🎓', '💻', '🎮', '❤️'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setGoals(dbService.getGoals());
  };

  const handleSave = () => {
    if (!name || !targetAmount) return;
    const newGoal: SavingGoal = {
      id: Date.now().toString(),
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount || '0'),
      deadline,
      icon,
    };
    dbService.saveGoal(newGoal);
    loadData();
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setDeadline('');
    setIcon('💰');
  };

  const handleDelete = (id: string) => {
    if (confirm('確定要刪除這個目標嗎？')) {
      dbService.deleteGoal(id);
      loadData();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">儲蓄目標</h1>
          <p className="text-slate-500">設定願望清單，一步步實現您的夢想</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all"
        >
          <Plus size={20} /> 新增目標
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map(goal => {
          const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
          return (
            <div key={goal.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group">
              <button 
                onClick={() => handleDelete(goal.id)}
                className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={18} />
              </button>
              <div className="text-4xl mb-4">{goal.icon}</div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">{goal.name}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase mb-6 flex items-center gap-1">
                <Flag size={12} /> 截止日期: {goal.deadline || '未設定'}
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-slate-700">${goal.currentAmount.toLocaleString()}</span>
                  <span className="text-slate-400">/ ${goal.targetAmount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-right text-xs font-black text-indigo-600">{progress.toFixed(0)}% 已達成</p>
              </div>
            </div>
          );
        })}
        {goals.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
              <Target size={40} />
            </div>
            <p className="text-slate-400">目前沒有設定任何目標。設定一個目標來激勵自己吧！</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">新增儲蓄目標</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">目標圖示</label>
                <div className="flex flex-wrap gap-2">
                  {icons.map(i => (
                    <button 
                      key={i} 
                      onClick={() => setIcon(i)}
                      className={`w-10 h-10 text-xl rounded-xl flex items-center justify-center transition-all ${icon === i ? 'bg-indigo-600' : 'bg-slate-50 hover:bg-slate-100'}`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">目標名稱</label>
                <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="例如：日本旅行、買新相機" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">目標金額</label>
                  <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">已存金額</label>
                  <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={currentAmount} onChange={e => setCurrentAmount(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">目標日期</label>
                <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={deadline} onChange={e => setDeadline(e.target.value)} />
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-all">取消</button>
              <button onClick={handleSave} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100">建立目標</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
