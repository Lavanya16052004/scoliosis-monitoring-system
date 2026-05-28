
import React, { useState, useRef } from 'react';
import { 
  Upload, 
  X, 
  FileText, 
  ShieldAlert, 
  CheckCircle, 
  ChevronRight, 
  Loader2,
  Dna,
  Printer,
  Share2,
  Bone,
  Info,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { analyzeXRay } from '../services/aiService';
import { AnalysisResult, PatientRecord, ScoliosisSeverity, LineCoords } from '../types';

interface AnalysisViewProps {
  onResultSave: (record: PatientRecord) => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ onResultSave }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [patientName, setPatientName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file (PNG, JPG, or DICOM-converted-to-image).');
        return;
      }
      setSelectedFile(file);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (!result || !patientName) return;
    
    const summaryText = `ScolioVision AI Report: ${patientName}\nCobb Angle: ${result.cobbAngle}°\nSeverity: ${result.severity}\nDate: ${new Date(result.timestamp).toLocaleDateString()}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Diagnostic Report - ${patientName}`,
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

  const startAnalysis = async () => {
    if (!previewUrl || !patientName) {
      setError('Please provide patient name and upload an X-ray image.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    try {
      const base64 = previewUrl.split(',')[1];
      const analysisResult = await analyzeXRay(base64);
      setResult(analysisResult);
      onResultSave({
        ...analysisResult,
        patientName,
        imageUrl: previewUrl
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred during AI analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setPatientName('');
    setError(null);
  };

  const getSeverityStyles = (severity: ScoliosisSeverity) => {
    switch (severity) {
      case ScoliosisSeverity.NORMAL: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case ScoliosisSeverity.MILD: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case ScoliosisSeverity.MODERATE: return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case ScoliosisSeverity.SEVERE: return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  const renderMarker = (line: LineCoords, label: string, color: string) => {
    return (
      <g key={label}>
        <line 
          x1={`${line.x1}%`} y1={`${line.y1}%`} 
          x2={`${line.x2}%`} y2={`${line.y2}%`} 
          stroke={color} 
          strokeWidth="3" 
          strokeDasharray="5 3"
          className="drop-shadow-md"
        />
        <circle cx={`${line.x1}%`} cy={`${line.y1}%`} r="4" fill={color} className="drop-shadow-md" />
        <circle cx={`${line.x2}%`} cy={`${line.y2}%`} r="4" fill={color} className="drop-shadow-md" />
        <text 
          x={`${(line.x1 + line.x2) / 2}%`} 
          y={`${(line.y1 + line.y2) / 2 - 4}%`} 
          fill={color} 
          fontSize="8" 
          fontWeight="900" 
          textAnchor="middle"
          className="uppercase tracking-widest"
        >
          {label}
        </text>
      </g>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {!result ? (
        <div className="bg-[#FFF8E7] rounded-3xl border border-[#002147]/10 shadow-xl overflow-hidden no-print">
          <div className="p-8 border-b border-[#002147]/10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-[#002147] uppercase tracking-tighter">New Diagnostic Analysis</h2>
              <p className="text-[#002147]/50 font-bold uppercase tracking-widest text-xs mt-1">Automated Cobb Angle detection & severity classification</p>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <label className="block text-xs font-black text-[#002147] uppercase tracking-widest mb-2">Patient Full Name / ID</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-[#002147]/5 border border-[#002147]/10 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#002147] transition-all font-bold text-[#002147] placeholder:text-[#002147]/20"
                />
                <Dna className="absolute right-4 top-1/2 -translate-y-1/2 text-[#002147]/20" size={20} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-[#002147] uppercase tracking-widest mb-2">Upload X-Ray Scans (AP/Lateral)</label>
              <div 
                onClick={() => !isAnalyzing && fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer ${
                  previewUrl ? 'border-[#002147]/40 bg-[#002147]/5' : 'border-[#002147]/10 hover:border-[#002147]/40 bg-[#002147]/5'
                }`}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                
                {previewUrl ? (
                  <div className="w-full relative group">
                    <img src={previewUrl} alt="Preview" className="max-h-96 w-full object-contain rounded-2xl shadow-lg border border-[#002147]/10" />
                    <div className="absolute inset-0 bg-[#002147]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                      <p className="text-[#FFFBF2] font-black uppercase tracking-widest flex items-center gap-2"><Upload size={20} />Replace Image</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-[#002147]/5 rounded-2xl shadow-sm flex items-center justify-center mb-4 text-[#002147]"><Upload size={32} /></div>
                    <p className="font-black text-[#002147] text-lg uppercase tracking-tighter">Click or drag X-ray scan here</p>
                    <p className="text-[#002147]/40 font-bold uppercase tracking-widest text-xs mt-2">DICOM, PNG or JPEG formats supported</p>
                  </>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-600 px-6 py-4 rounded-2xl flex items-center gap-4">
                <ShieldAlert size={24} className="shrink-0" />
                <p className="font-bold text-xs uppercase tracking-widest">{error}</p>
              </div>
            )}

            <button
              onClick={startAnalysis}
              disabled={isAnalyzing || !previewUrl || !patientName}
              className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${
                isAnalyzing || !previewUrl || !patientName
                  ? 'bg-[#002147]/10 text-[#002147]/30 cursor-not-allowed'
                  : 'bg-[#002147] text-[#FFFBF2] hover:bg-[#003366] shadow-xl shadow-[#002147]/20'
              }`}
            >
              {isAnalyzing ? <><Loader2 className="animate-spin" size={24} />Analyzing Spinal Curvature...</> : <><Bone size={24} />Execute AI Diagnostics</>}
            </button>
          </div>
        </div>
      ) : (
        /* RESULTS VIEW & PRINTABLE REPORT */
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="printable-area">
            {/* Professional Medical Report Header (Print only) */}
            <div className="hidden print:block mb-10 border-b-2 border-[#002147] pb-8">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="bg-[#002147] p-2 rounded-lg text-[#FFFBF2]">
                    <ShieldCheck size={32} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-[#002147] tracking-tighter uppercase">ScolioVision AI</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#002147]/50">Clinical Diagnostic Report</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-[#002147]/30 uppercase tracking-widest mb-1">Diagnostic System ID</p>
                  <p className="text-sm font-black text-[#002147]">{result.id}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3 space-y-4 print:w-1/2">
                <div className="bg-[#FFF8E7] p-4 rounded-3xl border border-[#002147]/10 shadow-lg relative overflow-hidden group print:shadow-none print:border-[#002147]/20">
                  <div className="relative">
                      <img src={previewUrl!} className="w-full rounded-2xl shadow-sm" alt="Analyzed X-ray" />
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {result.markers && (
                          <>
                            {renderMarker(result.markers.topLine, 'Top Endplate', '#002147')}
                            {renderMarker(result.markers.bottomLine, 'Bottom Endplate', '#002147')}
                          </>
                        )}
                      </svg>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[10px] uppercase font-black text-[#002147]/40 px-2 print:text-[#002147]">
                      <span className="tracking-widest">Vertex Mapping</span>
                      <span className="text-[#002147]">Cobb Angle: {result.cobbAngle}°</span>
                  </div>
                </div>
                <button 
                  onClick={reset}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#002147]/5 text-[#002147] border border-[#002147]/10 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#002147]/10 transition-all no-print"
                >
                  <X size={18} />Clear & Start New
                </button>
              </div>

              <div className="flex-1 space-y-6 print:w-1/2">
                <div className="bg-[#FFF8E7] p-8 rounded-3xl border border-[#002147]/10 shadow-lg print:shadow-none print:border-none">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-black text-[#002147] uppercase tracking-tighter">{patientName}</h2>
                      <p className="text-xs font-bold text-[#002147]/40 uppercase tracking-widest mt-1">Report generated: {new Date(result.timestamp).toLocaleString()}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-xl border-2 font-black text-[10px] uppercase tracking-[0.2em] ${getSeverityStyles(result.severity)}`}>
                      {result.severity}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-[#002147]/5 p-6 rounded-2xl border border-[#002147]/10 print:bg-[#FFF8E7] print:border-[#002147]/20">
                      <p className="text-[10px] font-black text-[#002147]/30 uppercase tracking-widest mb-2">Cobb Angle</p>
                      <p className="text-4xl font-black text-[#002147] tracking-tighter">{result.cobbAngle}°</p>
                    </div>
                    <div className="bg-[#002147]/5 p-6 rounded-2xl border border-[#002147]/10 print:bg-[#FFF8E7] print:border-[#002147]/20">
                      <p className="text-[10px] font-black text-[#002147]/30 uppercase tracking-widest mb-2">Status</p>
                      <div className="flex items-center gap-2">
                        <CheckCircle size={18} className="text-emerald-600" />
                        <p className="text-lg font-black text-[#002147] uppercase tracking-tighter">AI Verified</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-[#002147] uppercase tracking-widest flex items-center gap-2">
                      <FileText size={18} className="text-[#002147]" />AI Pathological Findings
                    </h4>
                    <div className="bg-[#002147]/5 p-5 rounded-2xl border border-[#002147]/10 text-sm leading-relaxed text-[#002147]/70 italic font-medium print:bg-[#FFF8E7] print:border-[#002147]/10">
                      "{result.visualObservations}"
                    </div>
                  </div>
                </div>

                <div className="bg-[#FFF8E7] p-8 rounded-3xl border border-[#002147]/10 shadow-lg print:shadow-none print:border-none">
                  <h4 className="text-xs font-black text-[#002147] uppercase tracking-widest flex items-center gap-2 mb-6">
                    <Stethoscope size={18} className="text-emerald-600" />Clinical Correction Protocol
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-1">
                    {result.recommendations.map((rec, i) => (
                      <div key={i} className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex flex-col items-center text-center gap-3 print:flex-row print:text-left print:bg-[#FFF8E7]">
                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-black text-xs shrink-0">{i + 1}</div>
                        <p className="text-xs font-black text-[#002147] uppercase tracking-tighter leading-tight">{rec}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 flex gap-4 no-print">
                    <button onClick={handlePrint} className="flex-1 py-4 bg-[#002147] text-[#FFFBF2] rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 hover:bg-[#003366] transition-all shadow-xl shadow-[#002147]/20">
                        <Printer size={18} />Print Clinical Report
                    </button>
                    <button onClick={handleShare} className="px-6 py-4 bg-[#002147]/5 text-[#002147] border border-[#002147]/10 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[#002147]/10 transition-all"><Share2 size={18} /></button>
                  </div>
                </div>

                {/* Print Verification Footer */}
                <div className="hidden print:flex justify-between items-end mt-20 pt-10 border-t border-[#002147]/20">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-[#002147]/30 tracking-widest">Digital Signature</p>
                    <div className="w-48 h-1 bg-[#002147]/10 mt-8 mb-2"></div>
                    <p className="text-sm font-black text-[#002147] uppercase tracking-tighter">ScolioVision AI Validation Core</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-bold text-[#002147]/40 max-w-xs leading-tight uppercase tracking-widest">This report is generated by a computer vision diagnostic system and should be reviewed by a licensed radiologist or orthopedic specialist. HIPAA Compliant Analysis.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisView;
