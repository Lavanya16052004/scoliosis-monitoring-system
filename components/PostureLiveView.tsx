
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Play, 
  Square, 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle,
  CameraOff,
  User,
  ZapOff,
  FileDown,
  Bone as BoneIcon,
  Focus,
  LineChart as LineChartIcon,
  CheckCircle,
  Stethoscope,
  Info,
  RotateCcw,
  Zap,
  Clock,
  Hand,
  Cpu,
  Monitor,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { PostureAnalysis, Landmark, ScoliosisSeverity, PatientRecord } from '../types';
import { AreaChart, Area, YAxis, XAxis, ResponsiveContainer, ReferenceLine, CartesianGrid, Tooltip } from 'recharts';

declare const poseDetection: any;

interface PostureLiveViewProps {
  onSaveReport?: (record: PatientRecord) => void;
}

interface SessionDataPoint {
  time: string;
  timestamp: number;
  score: number;
  angle: number;
}

const PostureLiveView: React.FC<PostureLiveViewProps> = ({ onSaveReport }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectorRef = useRef<any>(null);
  
  const [isActive, setIsActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [localAnalysis, setLocalAnalysis] = useState<{angle: number, score: number, peakAngle: number} | null>(null);
  const [cloudAnalysis, setCloudAnalysis] = useState<Partial<PostureAnalysis> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [patientName, setPatientName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [sessionHistory, setSessionHistory] = useState<SessionDataPoint[]>([]);
  const [sessionLogs, setSessionLogs] = useState<{time: string, text: string, severity: string}[]>([]);

  // Initialize TensorFlow MoveNet Detector
  const initDetector = async () => {
    try {
      const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
      };
      detectorRef.current = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet, 
        detectorConfig
      );
    } catch (err) {
      console.error("TFJS Init Error:", err);
      setError("Local AI Engine failed to load. Check GPU support.");
    }
  };

  const toggleMonitoring = async () => {
    if (isActive) {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      setIsActive(false);
      setLocalAnalysis(null);
      setCloudAnalysis(null);
      setSessionHistory([]);
      setSessionLogs([]);
    } else {
      try {
        if (!detectorRef.current) await initDetector();
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user', width: 640, height: 480 } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsActive(true);
          setError(null);
        }
      } catch (err) {
        setError("Optical link failure: Camera access denied.");
      }
    }
  };

  const runCloudInsights = useCallback(async () => {
    if (!isActive || !videoRef.current || isAnalyzing) return;

    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 180;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const base64Image = canvas.toDataURL('image/jpeg', 0.6).split(',')[1];

    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-flash-preview',
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
            { text: `SCOLIOSIS CLINICAL CONSULTATION. Analyze the spinal alignment in this frame. Return JSON: feedback (1 medical sentence), severity (Normal/Mild/Moderate/Severe), recommendations (3 exercises).` }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              feedback: { type: Type.STRING },
              severity: { type: Type.STRING },
              recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['feedback', 'severity', 'recommendations']
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      setCloudAnalysis(result);
      
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setSessionLogs(prev => [{
        time: currentTime,
        text: result.feedback,
        severity: result.severity
      }, ...prev.slice(0, 5)]);

    } catch (err) {
      console.warn("Cloud quota reached - utilizing Local Heuristics only.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [isActive, isAnalyzing]);

  // Main Local Frame Loop
  useEffect(() => {
    let animationFrame: number;
    let peak = 0;

    const processFrame = async () => {
      if (!isActive || !videoRef.current || !detectorRef.current || !canvasRef.current) return;

      const poses = await detectorRef.current.estimatePoses(videoRef.current);
      const ctx = canvasRef.current.getContext('2d');
      
      if (poses.length > 0 && ctx) {
        const pose = poses[0];
        const { width, height } = canvasRef.current;
        ctx.clearRect(0, 0, width, height);

        // Biometric Mapping
        const getKpt = (name: string) => pose.keypoints.find((k: any) => k.name === name);
        const lS = getKpt('left_shoulder');
        const rS = getKpt('right_shoulder');
        const lH = getKpt('left_hip');
        const rH = getKpt('right_hip');

        if (lS && rS && lH && rH) {
          const midS = { x: (lS.x + rS.x) / 2, y: (lS.y + rS.y) / 2 };
          const midH = { x: (lH.x + rH.x) / 2, y: (lH.y + rH.y) / 2 };
          
          // Local Cobb Approximation (Simple linear deviation)
          const dx = midS.x - midH.x;
          const dy = midS.y - midH.y;
          const angle = Math.abs(Math.atan2(dx, dy) * (180 / Math.PI));
          const score = Math.round(pose.score * 100);

          if (angle > peak) peak = angle;

          setLocalAnalysis({ angle, score, peakAngle: peak });

          // Update session history for chart
          const now = new Date();
          setSessionHistory(prev => {
            const last = prev[prev.length - 1];
            // Only add point every 1 second to avoid overwhelming the chart
            if (!last || now.getTime() - last.timestamp > 1000) {
              return [...prev, {
                time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                timestamp: now.getTime(),
                score,
                angle
              }].slice(-50); // Keep last 50 points
            }
            return prev;
          });

          // Draw HUD
          ctx.beginPath();
          ctx.lineWidth = 4;
          ctx.strokeStyle = angle > 10 ? '#f43f5e' : '#10b981';
          ctx.setLineDash([10, 5]);
          ctx.moveTo(midS.x, midS.y);
          ctx.lineTo(midH.x, midH.y);
          ctx.stroke();
          ctx.setLineDash([]);

          // Markers
          [lS, rS, lH, rH].forEach(kp => {
            ctx.beginPath();
            ctx.arc(kp.x, kp.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.strokeStyle = '#6366f1';
            ctx.lineWidth = 2;
            ctx.stroke();
          });
        }
      }
      animationFrame = requestAnimationFrame(processFrame);
    };

    if (isActive) {
      processFrame();
      // Cloud insights every 15s to save API quota
      const cloudInterval = setInterval(runCloudInsights, 15000);
      return () => {
        cancelAnimationFrame(animationFrame);
        clearInterval(cloudInterval);
      };
    }
  }, [isActive, runCloudInsights]);

  const archiveSession = async () => {
    if (!localAnalysis || !onSaveReport) return;
    setIsSaving(true);
    try {
      const snap = document.createElement('canvas');
      snap.width = 640; snap.height = 480;
      const sCtx = snap.getContext('2d');
      if (sCtx && videoRef.current) {
        sCtx.drawImage(videoRef.current, 0, 0, 640, 480);
        if (canvasRef.current) sCtx.drawImage(canvasRef.current, 0, 0, 640, 480);
      }
      onSaveReport({
        id: Math.random().toString(36).substr(2, 9),
        patientName: patientName || 'Unidentified Subject',
        timestamp: new Date().toISOString(),
        cobbAngle: localAnalysis.angle,
        severity: (cloudAnalysis?.severity as ScoliosisSeverity) || ScoliosisSeverity.NORMAL,
        recommendations: cloudAnalysis?.recommendations || [],
        visualObservations: cloudAnalysis?.feedback || 'Local biometric baseline recorded.',
        imageUrl: snap.toDataURL('image/jpeg', 0.7),
        source: 'LIVE'
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const getSeverityBadgeColor = (severity?: string) => {
    switch (severity) {
      case 'Severe': return 'text-red-600 border-red-200 bg-red-50';
      case 'Moderate': return 'text-amber-600 border-amber-200 bg-amber-50';
      case 'Mild': return 'text-[#002147] border-[#002147]/20 bg-[#002147]/5';
      default: return 'text-emerald-600 border-emerald-200 bg-emerald-50';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* HUD Header */}
      <div className="bg-[#FFF8E7] p-6 rounded-3xl border border-[#002147]/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 w-full">
          <label className="text-[10px] font-black text-[#002147]/40 uppercase tracking-widest mb-1 block">Subject Profile Mapping</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#002147]/20" size={18} />
            <input 
              type="text" 
              placeholder="Assign Patient ID..." 
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#002147]/5 border border-[#002147]/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#002147] transition-all font-bold text-[#002147]"
            />
          </div>
        </div>
        <button 
          onClick={archiveSession}
          disabled={!localAnalysis || isSaving}
          className={`px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
            saveSuccess ? 'bg-emerald-500 text-white' : !localAnalysis || isSaving ? 'bg-[#002147]/10 text-[#002147]/30' : 'bg-[#002147] text-[#FFFBF2] shadow-lg shadow-[#002147]/20'
          }`}
        >
          {saveSuccess ? 'Session Logged' : 'Capture Baseline'}
        </button>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-6">
          {/* Medical Viewport */}
          <div className="relative bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/3] border-[6px] border-[#002147]">
            <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${isActive ? 'opacity-100' : 'opacity-10'}`} />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" width={640} height={480} />

            {isActive && (
              <div className="absolute top-8 left-8 flex flex-col gap-3">
                <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                  <Cpu size={14} className="text-emerald-400 animate-spin" />
                  <span className="text-white text-[10px] font-black tracking-widest uppercase">Biometric HUD (Active)</span>
                </div>
                {isAnalyzing && (
                  <div className="bg-[#002147]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3 animate-pulse">
                    <Monitor size={14} className="text-[#FFFBF2]" />
                    <span className="text-[#FFFBF2] text-[10px] font-black tracking-widest uppercase">Gemini Cloud</span>
                  </div>
                )}
              </div>
            )}

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-4">
              {!isActive ? (
                <button onClick={toggleMonitoring} className="bg-[#002147] hover:bg-[#003366] text-[#FFFBF2] px-12 py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl flex items-center gap-4">
                  <Play size={24} fill="currentColor" /> Activate Sensors
                </button>
              ) : (
                <>
                  <button onClick={toggleMonitoring} className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3">
                    <Square size={16} fill="currentColor" /> Terminate Session
                  </button>
                  <button onClick={runCloudInsights} disabled={isAnalyzing} className="bg-[#FFFBF2] text-[#002147] px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3">
                    <Zap size={16} className="text-[#002147]" /> Manual Sync
                  </button>
                </>
              )}
            </div>
            
            {!isActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-[#FFFBF2]/20 pointer-events-none">
                <div className="absolute inset-0 opacity-20">
                  <img 
                    src="https://tse4.mm.bing.net/th/id/OIP.vXXcvV8SvIcdUEY3MY6YGAHaJQ?pid=ImgDet&w=178&h=221&c=7&dpr=1.5&o=7&rm=3"  
                    alt="Spinal Sensors" 
                    className="w-full h-full object-cover grayscale"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="relative z-10 flex flex-col items-center">
                  <CameraOff size={64} className="mb-4 opacity-40" />
                  <p className="font-black text-xs uppercase tracking-widest opacity-80">Sensors Offline</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#FFF8E7] p-6 rounded-[2rem] border border-[#002147]/10 shadow-sm border-l-4 border-l-[#002147]">
              <p className="text-[9px] font-black text-[#002147]/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Focus size={10} className="text-[#002147]" />
                Live Angle
              </p>
              <div className="flex items-baseline gap-0.5">
                <p className="text-3xl font-black text-[#002147] tracking-tighter">{localAnalysis?.angle.toFixed(1) || '--'}</p>
                <span className="text-lg font-bold text-[#002147]/20">°</span>
              </div>
            </div>
            <div className="bg-[#FFF8E7] p-6 rounded-[2rem] border border-[#002147]/10 shadow-sm border-l-4 border-l-emerald-600">
              <p className="text-[9px] font-black text-[#002147]/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                <TrendingUp size={10} className="text-emerald-600" />
                Peak Angle
              </p>
              <div className="flex items-baseline gap-0.5">
                <p className="text-3xl font-black text-[#002147] tracking-tighter">{localAnalysis?.peakAngle.toFixed(1) || '--'}</p>
                <span className="text-lg font-bold text-[#002147]/20">°</span>
              </div>
            </div>
            <div className="bg-[#FFF8E7] p-6 rounded-[2rem] border border-[#002147]/10 shadow-sm border-l-4 border-l-amber-500">
              <p className="text-[9px] font-black text-[#002147]/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                <AlertCircle size={10} className="text-amber-500" />
                Clinical Severity
              </p>
              <div className="h-9 flex items-center">
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getSeverityBadgeColor(cloudAnalysis?.severity)}`}>
                  {cloudAnalysis?.severity || 'SYNC REQ'}
                </span>
              </div>
            </div>
            <div className="bg-[#FFF8E7] p-6 rounded-[2rem] border border-[#002147]/10 shadow-sm border-l-4 border-l-[#002147]/40">
              <p className="text-[9px] font-black text-[#002147]/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                <ShieldCheck size={10} className="text-[#002147]/40" />
                Tracking
              </p>
              <div className="flex items-baseline gap-0.5">
                <p className="text-3xl font-black text-[#002147] tracking-tighter">{localAnalysis?.score || '--'}</p>
                <span className="text-lg font-bold text-[#002147]/20">%</span>
              </div>
            </div>
          </div>

          {/* Session History Chart */}
          <div className="bg-[#FFF8E7] p-8 rounded-[2.5rem] border border-[#002147]/10 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-[#002147] flex items-center gap-2 uppercase tracking-tighter">
                <LineChartIcon size={20} className="text-[#002147]" />
                Real-time Biometric Variance
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#002147]"></div>
                  <span className="text-[10px] font-black text-[#002147]/40 uppercase tracking-widest">Angle (°)</span>
                </div>
              </div>
            </div>
            <div className="h-48 w-full">
              {sessionHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sessionHistory}>
                    <defs>
                      <linearGradient id="colorAngleLive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#002147" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#002147" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#002147" strokeOpacity={0.05} />
                    <XAxis dataKey="time" hide />
                    <YAxis domain={[0, 'auto']} hide />
                    <Tooltip 
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#FFFBF2', color: '#002147'}}
                      labelStyle={{display: 'none'}}
                    />
                    <ReferenceLine y={10} stroke="#f43f5e" strokeDasharray="3 3" label={{ position: 'right', value: 'Mild Threshold', fill: '#f43f5e', fontSize: 10, fontWeight: 'bold' }} />
                    <Area type="monotone" dataKey="angle" stroke="#002147" strokeWidth={3} fillOpacity={1} fill="url(#colorAngleLive)" animationDuration={0} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-[#002147]/10 border-2 border-dashed border-[#002147]/5 rounded-3xl">
                  <BoneIcon size={32} className="opacity-20 mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Awaiting Sensor Data...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Diagnostic Stream */}
        <div className="w-full xl:w-96 flex flex-col gap-6">
          <div className="bg-[#FFF8E7] p-8 rounded-[2.5rem] border border-[#002147]/10 shadow-lg flex flex-col h-[400px]">
            <h3 className="text-xl font-black text-[#002147] flex items-center gap-2 mb-6 border-b border-[#002147]/10 pb-4 shrink-0 uppercase tracking-tighter">
              <ShieldCheck size={24} className="text-[#002147]" /> AI Diagnostic Log
            </h3>
            <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
              {sessionLogs.map((log, i) => (
                <div key={i} className={`p-5 rounded-2xl border transition-all ${i === 0 ? 'bg-[#002147]/5 border-[#002147]/10' : 'bg-[#002147]/5 border-transparent opacity-60'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black text-[#002147]/30 uppercase tracking-widest">{log.time}</span>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase border ${getSeverityBadgeColor(log.severity)}`}>{log.severity}</span>
                  </div>
                  <p className="text-xs font-bold text-[#002147] italic leading-relaxed">"{log.text}"</p>
                </div>
              ))}
              {sessionLogs.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-[#002147]/10">
                  <BoneIcon size={48} className="opacity-20 mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40 text-center px-8">Sync required for text-based analysis</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#FFF8E7] p-8 rounded-[2.5rem] border border-[#002147]/10 shadow-lg flex-1">
            <h3 className="text-xl font-black text-[#002147] flex items-center gap-2 mb-6 border-b border-[#002147]/10 pb-4 uppercase tracking-tighter">
              <Stethoscope size={24} className="text-emerald-500" /> Dynamic Protocol
            </h3>
            <div className="space-y-3">
              {cloudAnalysis?.recommendations?.map((rec, i) => (
                <div key={i} className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xs shrink-0">{i+1}</div>
                  <p className="text-xs font-black text-[#002147] uppercase tracking-tighter leading-tight">{rec}</p>
                </div>
              )) || (
                <p className="text-[10px] text-[#002147]/30 font-black uppercase tracking-widest text-center py-10">Protocols will manifest after cloud validation.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostureLiveView;
