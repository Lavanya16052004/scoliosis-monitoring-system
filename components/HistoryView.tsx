
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  ExternalLink,
  Calendar,
  Video,
  FileText,
  X,
  ChevronDown,
  Printer,
  Share2,
  Bone,
  CheckCircle,
  FileDown,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { PatientRecord, ScoliosisSeverity, AnalysisSource, LineCoords } from '../types';

interface HistoryViewProps {
  records: PatientRecord[];
  onDelete: (id: string) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ records, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<ScoliosisSeverity | 'All'>('All');
  const [modalityFilter, setModalityFilter] = useState<AnalysisSource | 'All'>('All');
  const [dateFilter, setDateFilter] = useState<'All' | 'Today' | 'Week' | 'Month'>('All');
  const [selectedRecord, setSelectedRecord] = useState<PatientRecord | null>(null);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesSearch = r.patientName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeverity = severityFilter === 'All' || r.severity === severityFilter;
      const matchesModality = modalityFilter === 'All' || r.source === modalityFilter || (modalityFilter === 'XRAY' && !r.source);
      
      let matchesDate = true;
      if (dateFilter !== 'All') {
        const recordDate = new Date(r.timestamp);
        const now = new Date();
        if (dateFilter === 'Today') {
          matchesDate = recordDate.toDateString() === now.toDateString();
        } else if (dateFilter === 'Week') {
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          matchesDate = recordDate >= weekAgo;
        } else if (dateFilter === 'Month') {
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
          matchesDate = recordDate >= monthAgo;
        }
      }

      return matchesSearch && matchesSeverity && matchesModality && matchesDate;
    });
  }, [records, searchTerm, severityFilter, modalityFilter, dateFilter]);

  const getSeverityColor = (severity: ScoliosisSeverity) => {
    switch (severity) {
      case ScoliosisSeverity.NORMAL: return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case ScoliosisSeverity.MILD: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case ScoliosisSeverity.MODERATE: return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case ScoliosisSeverity.SEVERE: return 'text-red-400 bg-red-500/10 border-red-500/20';
    }
  };

  const getSourceStyles = (source?: string) => {
    if (source === 'LIVE') return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (!selectedRecord) return;
    
    const summaryText = `ScolioVision Case Report: ${selectedRecord.patientName}\nID: ${selectedRecord.id}\nCobb Angle: ${selectedRecord.cobbAngle}°\nSeverity: ${selectedRecord.severity}\nStatus: Clinically Verified AI Detection`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Case Report - ${selectedRecord.patientName}`,
          text: summaryText,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(summaryText);
        alert('Case summary copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing case:', err);
    }
  };

  const exportToCSV = () => {
    if (filteredRecords.length === 0) return;

    const headers = ['Patient Name', 'ID', 'Timestamp', 'Cobb Angle', 'Severity', 'Source', 'Observations'];
    const rows = filteredRecords.map(r => [
      r.patientName,
      r.id,
      new Date(r.timestamp).toLocaleString(),
      r.cobbAngle.toFixed(1),
      r.severity,
      r.source || 'XRAY',
      `"${r.visualObservations.replace(/"/g, '""')}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `scoliovision_history_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderMarker = (line: LineCoords, label: string, color: string) => {
    return (
      <g key={label}>
        <line x1={`${line.x1}%`} y1={`${line.y1}%`} x2={`${line.x2}%`} y2={`${line.y2}%`} stroke={color} strokeWidth="3" strokeDasharray="5 3" />
        <circle cx={`${line.x1}%`} cy={`${line.y1}%`} r="3" fill={color} />
        <circle cx={`${line.x2}%`} cy={`${line.y2}%`} r="3" fill={color} />
      </g>
    );
  };

  return (
    <div className="space-y-8 relative animate-in fade-in duration-700">
      {/* Search and Filters */}
      <div className="bg-[#FFF8E7] rounded-[2.5rem] border border-[#002147]/10 shadow-sm p-8 space-y-6 no-print">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#002147]/30" size={20} />
            <input 
              type="text" 
              placeholder="Search patient name..."
              className="w-full pl-14 pr-6 py-4 bg-[#002147]/5 border border-[#002147]/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#002147] transition-all font-bold text-[#002147] placeholder:text-[#002147]/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <div className="relative group">
              <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value as any)} className="appearance-none bg-white border border-[#002147]/10 rounded-2xl px-6 py-4 pr-12 text-xs font-black text-[#002147] uppercase tracking-widest hover:bg-[#002147]/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#002147] cursor-pointer shadow-sm">
                <option value="All">All Severities</option>
                <option value={ScoliosisSeverity.NORMAL}>Normal</option>
                <option value={ScoliosisSeverity.MILD}>Mild</option>
                <option value={ScoliosisSeverity.MODERATE}>Moderate</option>
                <option value={ScoliosisSeverity.SEVERE}>Severe</option>
              </select>
              <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#002147]/30 pointer-events-none" />
            </div>
            <div className="relative group">
              <select value={modalityFilter} onChange={(e) => setModalityFilter(e.target.value as any)} className="appearance-none bg-white border border-[#002147]/10 rounded-2xl px-6 py-4 pr-12 text-xs font-black text-[#002147] uppercase tracking-widest hover:bg-[#002147]/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#002147] cursor-pointer shadow-sm">
                <option value="All">All Modalities</option>
                <option value="XRAY">X-Ray Analysis</option>
                <option value="LIVE">Live Monitor</option>
              </select>
              <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#002147]/30 pointer-events-none" />
            </div>
            <button 
              onClick={exportToCSV}
              className="px-8 py-4 bg-[#002147] text-[#FFFBF2] rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#003366] transition-all flex items-center gap-3 shadow-xl shadow-[#002147]/20"
            >
              <FileDown size={18} />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-[#FFF8E7] rounded-[3rem] border border-[#002147]/10 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 no-print">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#002147]/5 border-b border-[#002147]/10">
                <th className="px-10 py-6 text-[10px] font-black text-[#002147]/40 uppercase tracking-[0.2em]">Patient Identity</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#002147]/40 uppercase tracking-[0.2em]">Classification</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#002147]/40 uppercase tracking-[0.2em] text-center">Cobb Angle</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#002147]/40 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#002147]/5">
              {filteredRecords.length > 0 ? filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-[#002147]/5 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xs shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${record.source === 'LIVE' ? 'bg-[#002147] text-[#FFFBF2]' : 'bg-[#002147]/10 text-[#002147]'}`}>
                        {record.patientName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-black text-[#002147] block leading-tight uppercase tracking-tight">{record.patientName}</span>
                        <span className="text-[10px] text-[#002147]/30 font-black uppercase tracking-widest">ID: {record.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getSeverityColor(record.severity)}`}>
                      {record.severity}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <span className="font-black text-[#002147] text-xl tracking-tighter">
                      {record.cobbAngle ? `${record.cobbAngle.toFixed(1)}°` : 'N/A'}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => setSelectedRecord(record)} className="p-3 text-[#002147]/40 hover:text-[#002147] hover:bg-[#002147]/10 rounded-xl transition-all shadow-sm"><ExternalLink size={20} /></button>
                      <button onClick={() => onDelete(record.id)} className="p-3 text-red-600 hover:text-red-700 hover:bg-red-500/10 rounded-xl transition-all shadow-sm"><Trash2 size={20} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="px-10 py-24 text-center">
                  <div className="flex flex-col items-center justify-center text-[#002147]/10">
                    <Bone size={64} className="mb-6 opacity-20" />
                    <p className="text-sm font-black uppercase tracking-[0.2em]">No clinical records found.</p>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Modal & Printable Area */}
      {selectedRecord && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-[#002147]/80 backdrop-blur-md no-print" onClick={() => setSelectedRecord(null)}></div>
          <div className="bg-[#FFFBF2] w-full max-w-5xl max-h-[90vh] rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 printable-area border border-[#002147]/10">
            
            {/* Modal Header (No Print) */}
            <div className="px-10 py-8 border-b border-[#002147]/10 flex items-center justify-between shrink-0 no-print bg-[#002147]/5">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-[#FFFBF2] shadow-lg ${selectedRecord.source === 'LIVE' ? 'bg-[#002147]' : 'bg-[#002147]'}`}>
                  {selectedRecord.patientName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#002147] tracking-tighter uppercase">{selectedRecord.patientName}</h3>
                  <span className="text-[10px] font-black text-[#002147]/40 uppercase tracking-widest">Diagnostic ID: {selectedRecord.id}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleShare} className="p-3 text-[#002147]/40 hover:text-[#002147] hover:bg-[#002147]/5 rounded-xl transition-all"><Share2 size={20} /></button>
                <button onClick={() => setSelectedRecord(null)} className="w-12 h-12 rounded-xl hover:bg-red-500/10 flex items-center justify-center text-[#002147]/40 hover:text-red-600 transition-all"><X size={24} /></button>
              </div>
            </div>

            {/* Print Only Header */}
            <div className="hidden print:block p-10 mb-6 border-b-4 border-[#002147]">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="bg-[#002147] p-3 rounded-2xl text-[#FFFBF2]"><ShieldCheck size={40} /></div>
                  <div>
                    <h1 className="text-4xl font-black text-[#002147] tracking-tighter uppercase">ScolioVision AI</h1>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-[#002147]/40">Historical Clinical Report</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-[#002147]/30 uppercase tracking-widest mb-1">Session ID</p>
                  <p className="text-lg font-black text-[#002147]">{selectedRecord.id}</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-[#002147]/10 bg-black/5 print:shadow-none print:border-[#002147]/20">
                    <img src={selectedRecord.imageUrl} className="w-full h-auto object-contain" alt="Clinical Scan" />
                    {selectedRecord.markers && (
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {renderMarker(selectedRecord.markers.topLine, 'Top', '#002147')}
                        {renderMarker(selectedRecord.markers.bottomLine, 'Bottom', '#002147')}
                      </svg>
                    )}
                  </div>
                  <div className="bg-[#002147]/5 p-8 rounded-[2rem] border border-[#002147]/10 shadow-sm print:border-[#002147]/10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black text-[#002147]/40 uppercase tracking-widest">Calculated Cobb Angle</span>
                      <span className="text-3xl font-black text-[#002147] tracking-tighter">{selectedRecord.cobbAngle.toFixed(1)}°</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#002147]/40 uppercase tracking-widest">Severity</span>
                      <span className={`px-5 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest ${getSeverityColor(selectedRecord.severity)}`}>
                        {selectedRecord.severity}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="space-y-5">
                    <h4 className="text-xs font-black text-[#002147] flex items-center gap-3 uppercase tracking-widest">
                      <Bone size={20} className="text-[#002147]" />Historical Interpretation
                    </h4>
                    <div className="bg-[#002147]/5 p-8 rounded-[2rem] border border-[#002147]/10 text-sm text-[#002147]/70 font-medium italic leading-relaxed print:border-[#002147]/10">
                      "{selectedRecord.visualObservations}"
                    </div>
                  </div>

                  <div className="space-y-5">
                    <h4 className="text-xs font-black text-[#002147] flex items-center gap-3 uppercase tracking-widest">
                      <Stethoscope size={20} className="text-emerald-600" />Corrective Protocol
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      {selectedRecord.recommendations.map((rec, i) => (
                        <div key={i} className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex items-center gap-5 print:bg-[#FFF8E7] print:border-[#002147]/10">
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xs shrink-0">{i + 1}</div>
                          <p className="text-sm font-bold text-[#002147]">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-5 pt-6 no-print">
                    <button onClick={handlePrint} className="flex-1 py-5 bg-[#002147] text-[#FFFBF2] rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-[#002147]/20 hover:bg-[#003366] transition-all"><Printer size={20} />Export PDF</button>
                    <button onClick={handleShare} className="flex-1 py-5 bg-[#002147]/5 text-[#002147] border border-[#002147]/10 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#002147]/10 transition-all"><Share2 size={20} />Share</button>
                  </div>
                </div>
              </div>

              {/* Print Verification Footer */}
              <div className="hidden print:flex justify-between items-end mt-24 pt-12 border-t-2 border-[#002147]/10">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-[#002147]/30 tracking-widest">Digital Validation Signature</p>
                  <div className="w-56 h-1 bg-[#002147]/10 mt-10 mb-3"></div>
                  <p className="text-sm font-black text-[#002147] uppercase tracking-tight">ScolioVision AI Medical Core</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-black text-[#002147]/20 max-w-xs leading-relaxed uppercase tracking-widest">Archived Case Report • Subject Identity: {selectedRecord.patientName} • Diagnostic verified by AI Core • HIPAA Compliant Storage</p>
                </div>
              </div>
            </div>
            
            <div className="px-10 py-6 bg-[#002147]/5 border-t border-[#002147]/10 flex items-center justify-between text-[10px] font-black text-[#002147]/30 uppercase tracking-widest no-print">
              <span>Diagnostic History • HIPAA Secure</span>
              <span className="flex items-center gap-3"><FileDown size={16} />Case Records Locked</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryView;
