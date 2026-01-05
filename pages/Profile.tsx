
import React, { useState } from 'react';
import { User, Mail, Shield, Settings, Bell, ChevronRight, Save } from 'lucide-react';

const Profile: React.FC = () => {
  const email = localStorage.getItem('zenwealth_user_email') || 'user@example.com';
  const [displayName, setDisplayName] = useState('Zen 使用者');
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">個人設定</h1>
        <p className="text-slate-500">管理您的個人資訊與系統偏好</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
            <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={48} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">{displayName}</h3>
            <p className="text-sm text-slate-400">{email}</p>
          </div>

          <nav className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-all text-indigo-600 border-l-4 border-indigo-600">
              <div className="flex items-center gap-3">
                <User size={18} />
                <span className="font-bold">基本資料</span>
              </div>
              <ChevronRight size={16} />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-all text-slate-600">
              <div className="flex items-center gap-3">
                <Shield size={18} />
                <span className="font-medium">安全性與密碼</span>
              </div>
              <ChevronRight size={16} />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-all text-slate-600">
              <div className="flex items-center gap-3">
                <Bell size={18} />
                <span className="font-medium">通知設定</span>
              </div>
              <ChevronRight size={16} />
            </button>
          </nav>
        </div>

        {/* Right Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Settings className="text-indigo-600" size={20} /> 個人化資料
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">顯示名稱</label>
                <input 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">電子郵件 (無法修改)</label>
                <div className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-400 flex items-center gap-2">
                  <Mail size={16} />
                  {email}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                {success ? (
                  <p className="text-emerald-600 font-bold flex items-center gap-1">
                    <Shield size={16} /> 設定已儲存
                  </p>
                ) : <div />}
                <button 
                  onClick={handleSave}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-100"
                >
                  <Save size={18} /> 儲存變更
                </button>
              </div>
            </div>
          </div>

          <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100">
            <h3 className="text-rose-800 font-bold mb-2">危險區域</h3>
            <p className="text-sm text-rose-600 mb-4">刪除帳號將會清除所有雲端同步數據，此操作無法復原。</p>
            <button className="px-6 py-2 bg-white border border-rose-200 text-rose-600 font-bold rounded-xl hover:bg-rose-600 hover:text-white transition-all">
              刪除我的帳號
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
