
import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { BankAccount } from '../types';
import { ACCOUNT_COLORS } from '../constants';
import { Plus, Trash2, Edit3, X, Landmark } from 'lucide-react';

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [bankName, setBankName] = useState('');
  const [balance, setBalance] = useState('');
  const [color, setColor] = useState(ACCOUNT_COLORS[0]);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = () => {
    setAccounts(dbService.getAccounts());
  };

  const openModal = (acc?: BankAccount) => {
    if (acc) {
      setEditingAccount(acc);
      setName(acc.name);
      setBankName(acc.bankName);
      setBalance(acc.balance.toString());
      setColor(acc.color);
    } else {
      setEditingAccount(null);
      setName('');
      setBankName('');
      setBalance('0');
      setColor(ACCOUNT_COLORS[0]);
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const newAcc: BankAccount = {
      id: editingAccount?.id || Date.now().toString(),
      name,
      bankName,
      balance: parseFloat(balance),
      color,
    };
    dbService.saveAccount(newAcc);
    loadAccounts();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('確定要刪除此帳戶嗎？這會連同刪除相關交易紀錄。')) {
      dbService.deleteAccount(id);
      loadAccounts();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">銀行帳戶管理</h1>
          <p className="text-slate-500">管理您的銀行、卡片與現金帳戶</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all"
        >
          <Plus size={20} /> 新增帳戶
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(acc => (
          <div key={acc.id} className="relative group overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
            <div className={`h-2 ${acc.color}`} />
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${acc.color}`}>
                  <Landmark size={24} />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openModal(acc)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"><Edit3 size={18} /></button>
                  <button onClick={() => handleDelete(acc.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-400"><Trash2 size={18} /></button>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800">{acc.name}</h3>
              <p className="text-sm text-slate-400 mb-6">{acc.bankName}</p>
              <div className="flex items-end justify-between">
                <p className="text-sm text-slate-400 font-medium uppercase">目前餘額</p>
                <p className="text-2xl font-black text-slate-800">${acc.balance.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
        {accounts.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full text-slate-300 mb-4">
              <Landmark size={40} />
            </div>
            <p className="text-slate-400">目前還沒有帳戶，點擊右上角新增一個吧！</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">{editingAccount ? '編輯帳戶' : '新增帳戶'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">帳戶名稱</label>
                <input 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="例如：薪資轉帳、生活費卡"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">銀行名稱</label>
                <input 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="例如：中國信託、台新銀行"
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">初始金額</label>
                <input 
                  type="number"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  value={balance}
                  onChange={e => setBalance(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">代表顏色</label>
                <div className="flex gap-2">
                  {ACCOUNT_COLORS.map(c => (
                    <button 
                      key={c} 
                      onClick={() => setColor(c)}
                      className={`w-10 h-10 rounded-full border-4 ${color === c ? 'border-slate-300' : 'border-transparent'} ${c}`} 
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-all">取消</button>
              <button onClick={handleSave} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">確認儲存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
