
import React, { useState, useEffect } from 'react';
import { 
  Bone, 
  History, 
  LayoutDashboard, 
  ShieldCheck,
  LogOut,
  Bell,
  Menu,
  X,
  Video,
  BookOpen
} from 'lucide-react';
import { AppView, PatientRecord, User } from './types';
import DashboardView from './components/DashboardView';
import AnalysisView from './components/AnalysisView';
import HistoryView from './components/HistoryView';
import LoginView from './components/LoginView';
import PostureLiveView from './components/PostureLiveView';
import DocumentationView from './components/DocumentationView';

const MAX_RECORDS = 15;

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('DASHBOARD');
  const [records, setRecords] = useState<PatientRecord[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedRecords = localStorage.getItem('scolio_records');
    if (savedRecords) {
      try { 
        const parsed = JSON.parse(savedRecords);
        if (Array.isArray(parsed)) setRecords(parsed);
      } catch (e) { 
        localStorage.removeItem('scolio_records');
      }
    }

    const savedUser = localStorage.getItem('scolio_user');
    if (savedUser) {
      try { 
        const parsed = JSON.parse(savedUser);
        setUser(parsed); 
      } catch (e) { 
        localStorage.removeItem('scolio_user');
      }
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('scolio_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('scolio_user');
  };

  const addRecord = (record: PatientRecord) => {
    const updated = [record, ...records].slice(0, MAX_RECORDS);
    setRecords(updated);
    try {
      localStorage.setItem('scolio_records', JSON.stringify(updated));
    } catch (e) {
      const trimmed = updated.slice(0, 5);
      setRecords(trimmed);
      localStorage.setItem('scolio_records', JSON.stringify(trimmed));
    }
  };

  const deleteRecord = (id: string) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    localStorage.setItem('scolio_records', JSON.stringify(updated));
  };

  const navItems = [
    { id: 'DASHBOARD' as AppView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ANALYSIS' as AppView, label: 'AI Analysis', icon: Bone },
    { id: 'POSTURE_LIVE' as AppView, label: 'Live Monitoring', icon: Video },
    { id: 'HISTORY' as AppView, label: 'Patient History', icon: History },
  ];

  if (!user) {
    return <LoginView onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'DASHBOARD': return <DashboardView records={records} setView={setCurrentView} user={user} />;
      case 'ANALYSIS': return <AnalysisView onResultSave={addRecord} />;
      case 'POSTURE_LIVE': return <PostureLiveView onSaveReport={addRecord} />;
      case 'HISTORY': return <HistoryView records={records} onDelete={deleteRecord} />;
      default: return <DashboardView records={records} setView={setCurrentView} user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#002147] flex flex-col md:flex-row font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-72 bg-[#001a33] border-r border-white/5 flex-col sticky top-0 h-screen shadow-2xl no-print">
        <div className="p-8 flex items-center gap-4 border-b border-white/5">
          <div className="bg-[#FFFBF2] p-2.5 rounded-2xl text-[#002147] shadow-lg">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="font-black text-[#FFFBF2] text-xl tracking-tighter leading-tight">ScolioVision</h1>
            <p className="text-[#FFFBF2]/40 text-[10px] font-black uppercase tracking-[0.2em]">AI Medical Suite</p>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                currentView === item.id 
                  ? 'bg-[#FFFBF2] text-[#002147] shadow-xl shadow-black/20 font-black scale-[1.02]' 
                  : 'text-[#FFFBF2]/50 hover:bg-white/5 hover:text-[#FFFBF2]'
              }`}
            >
              <item.icon size={20} className={currentView === item.id ? 'text-[#002147]' : 'group-hover:scale-110 transition-transform'} />
              <span className="text-sm uppercase tracking-widest font-bold">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[#FFFBF2]/40 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm uppercase tracking-widest font-bold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-[#001a33] border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-50 no-print">
        <div className="flex items-center gap-3">
          <div className="bg-[#FFFBF2] p-2 rounded-xl text-[#002147]">
            <ShieldCheck size={20} />
          </div>
          <span className="font-black text-[#FFFBF2] tracking-tighter">ScolioVision</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-[#FFFBF2]">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Nav Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-[#001a33] z-40 pt-20 flex flex-col no-print">
          <nav className="p-8 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-5 px-6 py-5 rounded-2xl text-sm uppercase tracking-[0.2em] ${
                  currentView === item.id ? 'bg-[#FFFBF2] text-[#002147] font-black' : 'text-[#FFFBF2]/60 font-bold'
                }`}
              >
                <item.icon size={24} />
                {item.label}
              </button>
            ))}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-5 px-6 py-5 rounded-2xl text-sm uppercase tracking-[0.2em] text-red-400 font-bold"
            >
              <LogOut size={24} />
              Sign Out
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        <header className="hidden md:flex bg-[#002147] border-b border-white/5 px-10 py-6 items-center justify-between sticky top-0 z-10 no-print">
          <h2 className="text-2xl font-black text-[#FFFBF2] tracking-tighter uppercase">
            {navItems.find(n => n.id === currentView)?.label}
          </h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
              <div className="text-right">
                <p className="text-sm font-black text-[#FFFBF2] uppercase tracking-wider">{user.name}</p>
                <p className="text-[10px] font-bold text-[#FFFBF2]/40 uppercase tracking-widest">{user.designation}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFFBF2] flex items-center justify-center text-[#002147] font-black text-lg shadow-lg">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full flex-1">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
