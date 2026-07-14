import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  TrendingUp, 
  DollarSign, 
  Settings as SettingsIcon, 
  LogOut, 
  ChevronDown, 
  User, 
  Bell,
  Sparkles,
  Calendar,
  Users
} from 'lucide-react';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name') || 'FUTA Merchant';
  const userEmail = localStorage.getItem('user_email') || 'merchant@futa.edu.ng';
  
  // Ticker states
  const [tickerIndex, setTickerIndex] = useState(0);
  const [tickerFade, setTickerFade] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const tickerItems = [
    { text: 'Current FUTA Phase: Mid-Semester', icon: Sparkles, color: 'text-amber-500' },
    { text: 'Next Event: First Semester Exams (in 14 days)', icon: Calendar, color: 'text-indigo-500' },
    { text: 'Campus Population Status: HIGH', icon: Users, color: 'text-emerald-500' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerFade(false);
      setTimeout(() => {
        setTickerIndex((prev) => (prev + 1) % tickerItems.length);
        setTickerFade(true);
      }, 300); // fade out duration
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/market-intelligence', label: 'Market Intelligence', icon: MapPin },
    { to: '/dashboard/product-analyzer', label: 'Product Analyzer', icon: TrendingUp },
    { to: '/dashboard/roi-calculator', label: 'ROI Calculator', icon: DollarSign },
    { to: '/dashboard/settings', label: 'Settings', icon: SettingsIcon }
  ];

  const CurrentTickerIcon = tickerItems[tickerIndex].icon;

  return (
    <div className="h-screen flex bg-slate-50 overflow-hidden">
      {/* Sidebar - Sleek Dark Theme */}
      <aside className="w-64 h-full bg-slate-950 text-slate-300 border-r border-slate-900 flex flex-col justify-between shrink-0 z-30 overflow-y-auto">
        <div>
          {/* Logo Header */}
          <div className="h-16 border-b border-slate-900 px-6 flex items-center gap-3 bg-slate-950">
            <img src="/futa_market_logo.png" alt="FUTA Market AI Logo" className="w-7 h-7 object-contain" />
            <span className="font-bold text-white text-base tracking-tight">FUTA Market AI</span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => 
                    `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive 
                        ? 'bg-slate-900 text-white border-l-2 border-brand-400 pl-3.5 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer - User details summary */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/60">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-xs">
              {userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Active Merchant</p>
              <p className="text-sm font-bold text-white truncate">{userName}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Top Navigation - Clean White */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-20 shadow-sm shrink-0">
          {/* FUTA Real-Time Academic Ticker */}
          <div className="flex items-center">
            <div className="bg-slate-100/80 px-4 py-2 rounded-full border border-slate-250/30 flex items-center gap-2 text-xs font-semibold text-slate-600 shadow-inner">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <div className={`flex items-center gap-1.5 transition-all duration-300 ${tickerFade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>
                <CurrentTickerIcon className={`w-3.5 h-3.5 ${tickerItems[tickerIndex].color}`} />
                <span>{tickerItems[tickerIndex].text}</span>
              </div>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-5">
            {/* Notification Bell */}
            <button className="relative w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-600 rounded-full"></span>
            </button>

            {/* Profile Avatar Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-xl transition duration-150 border border-transparent hover:border-slate-200"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-800 flex items-center justify-center font-bold text-white text-xs">
                  {userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 leading-tight">{userName}</span>
                  <span className="text-[10px] text-slate-400 font-normal leading-tight">Owner</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setProfileDropdownOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Signed In As</p>
                      <p className="text-sm font-bold text-slate-800 truncate mt-0.5">{userName}</p>
                      <p className="text-xs text-slate-400 truncate font-normal">{userEmail}</p>
                    </div>
                    
                    <button 
                      onClick={() => { setProfileDropdownOpen(false); navigate('/dashboard/settings'); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-55 hover:text-slate-800 transition text-left"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Account Settings
                    </button>

                    <button 
                      onClick={() => { setProfileDropdownOpen(false); handleLogout(); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition text-left border-t border-slate-100 font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Child Routes Main View Area */}
        <main className="flex-1 p-8 overflow-y-auto bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
