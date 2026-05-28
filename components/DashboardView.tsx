
import React from 'react';
import { 
  ArrowRight, 
  Users, 
  Bone, 
  AlertTriangle,
  Clock,
  Plus,
  TrendingUp,
  TrendingDown,
  SplineIcon
} from 'lucide-react';
import { PatientRecord, AppView, ScoliosisSeverity, User } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardViewProps {
  records: PatientRecord[];
  setView: (view: AppView) => void;
  user: User;
}

const DashboardView: React.FC<DashboardViewProps> = ({ records, setView, user }) => {
  const stats = [
    { label:'Total Analyses', value: records.length, icon: Users, color: 'text-[#002147]', bg: 'bg-[#002147]/10' },
    { label:'Avg.Cobb Angle', value: records.length ? (records.reduce((a, b) => a + b.cobbAngle, 0) / records.length).toFixed(1) + '°' : '0°', icon: SplineIcon, color: 'text-[#002147]', bg: 'bg-[#002147]/10' },
    { label:'Severe Cases', value: records.filter(r => r.severity === ScoliosisSeverity.SEVERE).length, icon: AlertTriangle, color: 'text-[#002147]', bg: 'bg-[#002147]/10' },
    { label:'Live Monitoring', value: records.filter(r => r.source === 'LIVE').length, icon: Clock, color: 'text-[#002147]', bg: 'bg-[#002147]/10' },
  ];

  const chartData = [...records].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).map(r => ({
    date: new Date(r.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    angle: r.cobbAngle,
    name: r.patientName
  })).slice(-15);

  const calculateTrend = () => {
    if (records.length < 2) return null;
    const sorted = [...records].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const latest = sorted[0].cobbAngle;
    const previous = sorted[1].cobbAngle;
    const diff = latest - previous;
    return {
      value: Math.abs(diff).toFixed(1),
      isUp: diff > 0
    };
  };

  const trend = calculateTrend();

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-[#001a33] to-[#002147] rounded-[3rem] p-10 md:p-16 text-[#FFFBF2] shadow-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -mr-64 -mt-64 blur-3xl"></div>
        <div className="space-y-6 text-center md:text-left relative">
          <div className="inline-block px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-white/10 mb-2">
            System Online • {user.department}
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Welcome, {user.name.split(' ')[0]}</h2>
          <p className="text-[#FFFBF2]/70 max-w-xl text-lg font-medium leading-relaxed">The AI detection core is active. Your dashboard is synced with the latest patient data and live monitoring results.</p>
          <div className="pt-8 flex flex-wrap justify-center md:justify-start gap-5">
            <button 
              onClick={() => setView('ANALYSIS')}
              className="px-10 py-5 bg-[#FFFBF2] text-[#002147] rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#FFF8E7] transition-all flex items-center gap-3 shadow-xl shadow-black/20"
            >
              <Plus size={18} />
              New AI Scan
            </button>
            <button 
              onClick={() => setView('POSTURE_LIVE')}
              className="px-10 py-5 bg-white/5 backdrop-blur-md text-[#FFFBF2] border border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
            >
              Live Monitor
            </button>
          </div>
        </div>
        <div className="hidden lg:block relative">
          <div className="w-72 h-56 bg-white/5 rounded-[2.5rem] backdrop-blur-xl border border-white/10 p-2 transform -rotate-6 hover:rotate-0 transition-all duration-500 cursor-pointer overflow-hidden group shadow-2xl">
            <img 
              src="https://tse4.mm.bing.net/th/id/OIP.vXXcvV8SvIcdUEY3MY6YGAHaJQ?pid=ImgDet&w=178&h=221&c=7&dpr=1.5&o=7&rm=3" 
              alt="Spinal Analysis" 
              className="w-full h-full object-cover rounded-[1.8rem] opacity-60 group-hover:opacity-100 transition-all duration-500 grayscale group-hover:grayscale-0"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-400 rounded-full blur-[100px] opacity-20"></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#FFF8E7] p-4 rounded-[2.5rem] border border-[#002147]/10 shadow-sm flex items-center gap-3 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className={`${stat.bg} ${stat.color} p-6 rounded-2xl transition-all duration-500 group-hover:rotate-12`}>
              <stat.icon size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-[#002147]/30 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <p className="text-4xl font-black text-[#002147] tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Chart */}
        <div className="lg:col-span-2 bg-[#FFF8E7] p-12 rounded-[3rem] border border-[#002147]/10 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-4">
                <h3 className="text-3xl font-black text-[#002147] tracking-tighter uppercase">Biometric Progression</h3>
                {trend && (
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${trend.isUp ? 'bg-red-500/20 text-red-600' : 'bg-emerald-500/20 text-emerald-600'}`}>
                    {trend.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {trend.value}° Trend
                  </div>
                )}
              </div>
              <p className="text-sm text-[#002147]/40 font-bold mt-2 uppercase tracking-wider">Clinical curvature variance over time</p>
            </div>
            <select className="bg-[#002147]/5 border-none text-[10px] font-black text-[#002147] uppercase tracking-widest rounded-xl px-6 py-3 focus:ring-2 focus:ring-[#002147] cursor-pointer">
              <option className="bg-[#FFFBF2]">Diagnostic Timeline</option>
              <option className="bg-[#FFFBF2]">Clinical History</option>
            </select>
          </div>
          <div className="h-[400px] w-full">
            {records.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAngleDashboard" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#002147" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#002147" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#002147" strokeOpacity={0.05} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#002147', fontSize: 10, fontWeight: 900, opacity: 0.3}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#002147', fontSize: 10, fontWeight: 900, opacity: 0.3}} dx={-15} unit="°" />
                  <Tooltip 
                    contentStyle={{borderRadius: '24px', border: 'none', backgroundColor: '#FFFBF2', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)', padding: '20px'}} 
                    itemStyle={{color: '#002147', fontWeight: '900', fontSize: '18px'}}
                    labelStyle={{fontWeight: '900', marginBottom: '8px', color: '#002147', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '10px'}}
                    formatter={(value: any) => [`${value}°`, 'Cobb Angle']}
                  />
                  <Area type="monotone" dataKey="angle" stroke="#002147" strokeWidth={5} fillOpacity={1} fill="url(#colorAngleDashboard)" animationDuration={2000} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[#002147]/20">
                <div className="w-20 h-20 bg-[#002147]/5 rounded-full flex items-center justify-center mb-6">
                  <Bone size={40} />
                </div>
                <p className="text-sm font-black uppercase tracking-[0.2em]">No diagnostic data available.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#FFF8E7] p-12 rounded-[3rem] border border-[#002147]/10 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-[#002147] tracking-tighter uppercase">Recent Reports</h3>
            <button onClick={() => setView('HISTORY')} className="text-[#002147] text-[10px] font-black uppercase tracking-widest hover:underline transition-all">View All</button>
          </div>
          <div className="space-y-6 flex-1 overflow-y-auto max-h-[450px] pr-2 custom-scrollbar">
            {records.slice(0, 5).length > 0 ? records.slice(0, 5).map((record, i) => (
              <div key={record.id} className="flex items-center gap-6 group cursor-pointer p-3 hover:bg-[#002147]/5 rounded-[2rem] transition-all duration-300" onClick={() => setView('HISTORY')}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${
                  record.severity === ScoliosisSeverity.SEVERE ? 'bg-red-500/20 text-red-600' :
                  record.severity === ScoliosisSeverity.MODERATE ? 'bg-amber-500/20 text-amber-600' :
                  'bg-emerald-500/20 text-emerald-600'
                }`}>
                  <Bone size={28} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-[#002147] truncate leading-tight uppercase tracking-tight">{record.patientName}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[9px] font-black text-[#002147]/40 uppercase tracking-widest">{record.severity}</span>
                    <span className="w-1 h-1 bg-[#002147]/10 rounded-full"></span>
                    <span className="text-[9px] font-black text-[#002147] uppercase tracking-widest opacity-60">{record.source || 'XRAY'}</span>
                  </div>
                </div>
                <div className="text-[10px] font-black text-[#002147]/20 uppercase vertical-text tracking-widest">
                  {new Date(record.timestamp).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full text-[#002147]/10 text-center py-10">
                <Users size={64} className="opacity-20 mb-6" />
                <p className="text-sm font-black uppercase tracking-widest">No recent patient activity found.</p>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setView('ANALYSIS')}
            className="mt-10 w-full py-5 bg-[#002147] text-[#FFFBF2] rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#003366] transition-all duration-500 flex items-center justify-center gap-3 shadow-sm"
          >
            Run New Diagnostic
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
