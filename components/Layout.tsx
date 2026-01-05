
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, 
  History, 
  LogOut,
  Sparkles,
  Target,
  User
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  userEmail?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, userEmail }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: '總覽', icon: LayoutDashboard },
    { path: '/accounts', label: '帳戶', icon: CreditCard },
    { path: '/transactions', label: '紀錄', icon: History },
    { path: '/goals', label: '目標', icon: Target },
    { path: '/reports', label: '報表與 AI', icon: Sparkles },
    { path: '/profile', label: '設定', icon: User },
  ];

  const handleLogout = () => {
    localStorage.removeItem('zenwealth_logged_in');
    localStorage.removeItem('zenwealth_user_email');
    navigate('/login');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      <aside className="hidden md:flex flex-col w-64 glass border-r border-slate-200 sticky top-0 h-screen p-6">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">Z</div>
          <span className="text-xl font-bold tracking-tight text-slate-800">ZenWealth</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-200 space-y-4">
          <div className="px-4">
            <p className="text-xs text-slate-400 uppercase font-semibold mb-1">使用者</p>
            <p className="text-sm font-medium text-slate-700 truncate">{userEmail}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">登出</span>
          </button>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-slate-200 px-4 py-3 flex justify-between items-center z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}
            >
              <Icon size={18} />
              <span className="text-[9px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <main className="flex-1 p-6 md:p-10 mb-20 md:mb-0 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;
