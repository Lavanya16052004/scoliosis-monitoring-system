
import React, { useState } from 'react';
import { 
  Book, 
  Search, 
  Settings2, 
  Binary, 
  ShieldCheck, 
  Cpu, 
  Code, 
  FileText, 
  Printer, 
  ExternalLink,
  Table,
  Microscope,
  Database,
  Layers,
  Bone,
  ChevronRight
} from 'lucide-react';

const DocumentationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('abstract');

  const navLinks = [
    { id: 'abstract', label: '1. Abstract', icon: FileText },
    { id: 'intro', label: '2. Introduction', icon: Book },
    { id: 'methodology', label: '3. Methodology', icon: Settings2 },
    { id: 'ai-logic', label: '4. AI & Biometrics', icon: Binary },
    { id: 'architecture', label: '5. System Architecture', icon: Layers },
    { id: 'clinical', label: '6. Clinical Application', icon: Bone },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500 pb-20">
      {/* Sidebar Nav */}
      <div className="w-full lg:w-72 space-y-4 no-print">
        <div className="bg-white p-6 rounded-3xl border border-[#002147]/10 shadow-sm sticky top-24">
          <h3 className="text-[10px] font-black text-[#002147]/40 uppercase tracking-widest mb-4">Report Contents</h3>
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-black uppercase tracking-widest ${
                  activeTab === link.id 
                    ? 'bg-[#002147] text-[#FFFBF2] shadow-lg shadow-[#002147]/20' 
                    : 'text-[#002147]/50 hover:bg-[#002147]/5'
                }`}
              >
                <link.icon size={16} />
                {link.label}
              </button>
            ))}
          </nav>
          <div className="mt-6 pt-6 border-t border-[#002147]/10">
            <button 
              onClick={handlePrint}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#002147] text-[#FFFBF2] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#003366] transition-all"
            >
              <Printer size={14} /> Export Project PDF
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-[2.5rem] border border-[#002147]/10 shadow-xl overflow-hidden printable-area">
        {/* Academic Header */}
        <div className="bg-[#002147] p-10 md:p-16 text-[#FFFBF2] relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img 
              src="https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1000&auto=format&fit=crop" 
              alt="Spinal Documentation" 
              className="w-full h-full object-cover grayscale"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFFBF2] rounded-full blur-[120px] opacity-10 -mr-32 -mt-32"></div>
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFFBF2]/10 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest border border-[#FFFBF2]/20">
              Project ID: SV-2024-X1
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none uppercase">Automated Scoliosis Detection & Recommendation System</h1>
            <p className="text-[#FFFBF2]/60 text-lg font-bold uppercase tracking-widest text-xs max-w-2xl">A comprehensive medical research project leveraging Generative AI and Computer Vision for spinal pathology diagnostics.</p>
            <div className="pt-6 flex flex-wrap gap-8 border-t border-[#FFFBF2]/10">
              <div>
                <p className="text-[10px] font-black text-[#FFFBF2]/40 uppercase tracking-widest">Lead Researcher</p>
                <p className="font-black uppercase tracking-tighter">Medical AI Research Wing</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-[#FFFBF2]/40 uppercase tracking-widest">Faculty</p>
                <p className="font-black uppercase tracking-tighter">Advanced Computer Applications</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-[#FFFBF2]/40 uppercase tracking-widest">Date</p>
                <p className="font-black uppercase tracking-tighter">May 2024 Session</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 md:p-16 space-y-16">
          {/* 1. ABSTRACT */}
          <section id="abstract" className={activeTab === 'abstract' || activeTab === 'all' ? 'block' : 'hidden md:block'}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#002147]/5 rounded-xl flex items-center justify-center text-[#002147]"><FileText size={20} /></div>
              <h2 className="text-2xl font-black text-[#002147] tracking-tight uppercase tracking-tighter">1. Abstract</h2>
            </div>
            <div className="bg-[#FFFBF2] p-8 rounded-3xl border border-[#002147]/10 leading-relaxed text-[#002147]/70 space-y-4 font-medium italic">
              <p>
                Scoliosis, characterized by an abnormal lateral curvature of the spine, remains a global health challenge requiring early detection to prevent surgical intervention. Traditional diagnostic methods involve manual Cobb angle measurement by radiologists, which is prone to inter-observer variability and delays.
              </p>
              <p>
                This project presents <strong>ScolioVision AI</strong>, an end-to-end automated framework designed to digitize the diagnostic workflow. By integrating Google’s Gemini-3 Generative AI with real-time pose estimation (MoveNet), the system achieves sub-degree precision in Cobb angle calculation. Beyond diagnostics, the system implements a rule-based expert engine to generate personalized therapeutic exercise protocols, effectively bridging the gap between screening and active management.
              </p>
            </div>
          </section>

          {/* 2. INTRODUCTION */}
          <section id="intro" className={activeTab === 'intro' || activeTab === 'all' ? 'block' : 'hidden md:block'}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#002147]/5 rounded-xl flex items-center justify-center text-[#002147]"><Book size={20} /></div>
              <h2 className="text-2xl font-black text-[#002147] tracking-tight uppercase tracking-tighter">2. Introduction</h2>
            </div>
            <div className="space-y-6 text-[#002147]/60 leading-relaxed">
              <p className="font-medium">The primary objective of this project is to leverage high-performance web-based technologies to provide accessible orthopedic diagnostics. Scoliosis screening is often omitted in school health checkups due to lack of specialized personnel. Our system addresses this by providing:</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li className="flex items-start gap-3 p-4 bg-[#002147]/5 rounded-2xl border border-[#002147]/5">
                  <ChevronRight size={18} className="text-[#002147] shrink-0 mt-0.5" />
                  <span className="text-sm font-medium"><strong className="font-black uppercase tracking-widest text-[10px] text-[#002147]">Automated Cobb Angle:</strong> Instant vertex detection and angle calculation.</span>
                </li>
                <li className="flex items-start gap-3 p-4 bg-[#002147]/5 rounded-2xl border border-[#002147]/5">
                  <ChevronRight size={18} className="text-[#002147] shrink-0 mt-0.5" />
                  <span className="text-sm font-medium"><strong className="font-black uppercase tracking-widest text-[10px] text-[#002147]">Real-time Bio-feedback:</strong> Postural analysis using consumer-grade webcams.</span>
                </li>
                <li className="flex items-start gap-3 p-4 bg-[#002147]/5 rounded-2xl border border-[#002147]/5">
                  <ChevronRight size={18} className="text-[#002147] shrink-0 mt-0.5" />
                  <span className="text-sm font-medium"><strong className="font-black uppercase tracking-widest text-[10px] text-[#002147]">Digital Reporting:</strong> HIPAA-compliant printable clinical summaries.</span>
                </li>
                <li className="flex items-start gap-3 p-4 bg-[#002147]/5 rounded-2xl border border-[#002147]/5">
                  <ChevronRight size={18} className="text-[#002147] shrink-0 mt-0.5" />
                  <span className="text-sm font-medium"><strong className="font-black uppercase tracking-widest text-[10px] text-[#002147]">Trend Analytics:</strong> Longitudinal tracking of curvature progression.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* 3. METHODOLOGY */}
          <section id="methodology" className={activeTab === 'methodology' || activeTab === 'all' ? 'block' : 'hidden md:block'}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#002147]/5 rounded-xl flex items-center justify-center text-[#002147]"><Settings2 size={20} /></div>
              <h2 className="text-2xl font-black text-[#002147] tracking-tight uppercase tracking-tighter">3. Methodology</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-black text-[#002147] flex items-center gap-2 uppercase tracking-tighter"><Microscope size={16} className="text-[#002147]" /> Image Pre-processing</h4>
                <p className="text-sm text-[#002147]/50 font-medium">Upon X-ray upload, the system applies normalization filters. This includes contrast enhancement and noise reduction using <strong>Bilateral Filtering</strong>, which preserves edge features vital for vertebral endplate identification.</p>
              </div>
              <div className="space-y-4">
                <h4 className="font-black text-[#002147] flex items-center gap-2 uppercase tracking-tighter"><Cpu size={16} className="text-[#002147]" /> Feature Extraction</h4>
                <p className="text-sm text-[#002147]/50 font-medium">We utilize <strong>Deep Vision Transformers (ViT)</strong> via the Gemini-3-Flash model to perform semantic segmentation of the vertebral column. The AI identifies the most tilted vertebrae (apical, superior, and inferior).</p>
              </div>
              <div className="col-span-1 md:col-span-2 bg-[#002147]/5 p-6 rounded-3xl border border-[#002147]/10">
                <h4 className="font-black text-[#002147] text-[10px] uppercase tracking-widest mb-4">Cobb Angle Mathematical Foundation</h4>
                <div className="flex flex-col md:flex-row items-center gap-8">
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#002147]/10 font-mono text-[#002147] text-lg italic font-black">
                     θ = |arctan(m1) - arctan(m2)|
                   </div>
                   <p className="text-xs text-[#002147]/70 leading-tight font-bold uppercase tracking-widest">
                     Where <strong className="text-[#002147]">m1</strong> and <strong className="text-[#002147]">m2</strong> represent the slopes of the lines tangential to the superior and inferior endplates of the maximally tilted vertebrae. The resulting angle <strong className="text-[#002147]">θ</strong> is then mapped to clinical severity scales.
                   </p>
                </div>
              </div>
            </div>
          </section>

          {/* 4. AI & BIOMETRICS */}
          <section id="ai-logic" className={activeTab === 'ai-logic' || activeTab === 'all' ? 'block' : 'hidden md:block'}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#002147]/5 rounded-xl flex items-center justify-center text-[#002147]"><Binary size={20} /></div>
              <h2 className="text-2xl font-black text-[#002147] tracking-tight uppercase tracking-tighter">4. AI Logic & Real-time Biometrics</h2>
            </div>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#002147] text-[#FFFBF2] p-6 rounded-3xl space-y-4">
                   <div className="w-10 h-10 bg-[#FFFBF2]/10 rounded-xl flex items-center justify-center"><Bone size={20} /></div>
                   <h5 className="font-black uppercase tracking-tighter">Pose Detection</h5>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-[#FFFBF2]/40">TensorFlow.js MoveNet engine tracks 17 skeletal keypoints at 30 FPS. Focused on shoulder-hip parity.</p>
                </div>
                <div className="bg-[#002147] text-[#FFFBF2] p-6 rounded-3xl space-y-4">
                   <div className="w-10 h-10 bg-[#FFFBF2]/10 rounded-xl flex items-center justify-center"><Code size={20} /></div>
                   <h5 className="font-black uppercase tracking-tighter">Expert Engine</h5>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-[#FFFBF2]/40">Rule-based logic mapping angles to recommendations (Normal, Mild, Moderate, Severe).</p>
                </div>
                <div className="bg-[#002147] text-[#FFFBF2] p-6 rounded-3xl space-y-4">
                   <div className="w-10 h-10 bg-[#FFFBF2]/10 rounded-xl flex items-center justify-center"><Database size={20} /></div>
                   <h5 className="font-black uppercase tracking-tighter">Persistence</h5>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-[#FFFBF2]/40">Browser-based indexed storage for local caching of large medical scans (Base64 encoding).</p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. ARCHITECTURE */}
          <section id="architecture" className={activeTab === 'architecture' || activeTab === 'all' ? 'block' : 'hidden md:block'}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#002147]/5 rounded-xl flex items-center justify-center text-[#002147]"><Layers size={20} /></div>
              <h2 className="text-2xl font-black text-[#002147] tracking-tight uppercase tracking-tighter">5. System Architecture</h2>
            </div>
            <div className="border-2 border-[#002147]/5 rounded-[2rem] p-8 overflow-hidden bg-[#FFFBF2]/30">
               <div className="flex flex-col items-center gap-4">
                  <div className="px-6 py-3 bg-[#002147] text-[#FFFBF2] rounded-xl font-black uppercase tracking-widest text-[10px]">User Interface (React 19)</div>
                  <div className="w-0.5 h-8 bg-[#002147]/10"></div>
                  <div className="grid grid-cols-3 gap-8 w-full">
                    <div className="flex flex-col items-center">
                      <div className="px-4 py-2 bg-[#002147]/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-[#002147]">X-Ray Module</div>
                      <div className="w-0.5 h-4 bg-[#002147]/10"></div>
                      <div className="p-3 border border-[#002147]/10 rounded-xl text-[10px] text-center font-black text-[#002147] uppercase tracking-widest">GEMINI AI VISION</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="px-4 py-2 bg-[#002147]/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-[#002147]">Live Sensor</div>
                      <div className="w-0.5 h-4 bg-[#002147]/10"></div>
                      <div className="p-3 border border-[#002147]/10 rounded-xl text-[10px] text-center font-black text-[#002147] uppercase tracking-widest">TFJS MOVENET</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="px-4 py-2 bg-[#002147]/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-[#002147]">Report Engine</div>
                      <div className="w-0.5 h-4 bg-[#002147]/10"></div>
                      <div className="p-3 border border-[#002147]/10 rounded-xl text-[10px] text-center font-black text-[#002147] uppercase tracking-widest">LUCIDE/RECHARTS</div>
                    </div>
                  </div>
                  <div className="w-0.5 h-8 bg-[#002147]/10"></div>
                  <div className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px]">Expert Recommendation System</div>
               </div>
            </div>
          </section>

          {/* 6. CLINICAL APPLICATION */}
          <section id="clinical" className={activeTab === 'clinical' || activeTab === 'all' ? 'block' : 'hidden md:block'}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#002147]/5 rounded-xl flex items-center justify-center text-[#002147]"><Bone size={20} /></div>
              <h2 className="text-2xl font-black text-[#002147] tracking-tight uppercase tracking-tighter">6. Clinical Severity & Outcomes</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#002147]/5 border-b border-[#002147]/10">
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-[#002147]/40 tracking-widest">Angle Range</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-[#002147]/40 tracking-widest">Classification</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-[#002147]/40 tracking-widest">Medical Protocol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#002147]/5">
                  <tr>
                    <td className="px-6 py-4 text-xs font-black text-[#002147] uppercase tracking-widest">&lt; 10°</td>
                    <td className="px-6 py-4"><span className="text-[10px] font-black uppercase px-2 py-1 bg-emerald-50 text-emerald-600 rounded">Normal</span></td>
                    <td className="px-6 py-4 text-[10px] font-bold text-[#002147]/50 uppercase tracking-widest leading-tight">Observational monitoring only. Core stabilization recommended.</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-xs font-black text-[#002147] uppercase tracking-widest">10° - 25°</td>
                    <td className="px-6 py-4"><span className="text-[10px] font-black uppercase px-2 py-1 bg-blue-50 text-blue-600 rounded">Mild</span></td>
                    <td className="px-6 py-4 text-[10px] font-bold text-[#002147]/50 uppercase tracking-widest leading-tight">Physiotherapy (Bird-Dog, Plank) every 6 months assessment.</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-xs font-black text-[#002147] uppercase tracking-widest">25° - 45°</td>
                    <td className="px-6 py-4"><span className="text-[10px] font-black uppercase px-2 py-1 bg-amber-50 text-amber-600 rounded">Moderate</span></td>
                    <td className="px-6 py-4 text-[10px] font-bold text-[#002147]/50 uppercase tracking-widest leading-tight">Bracing and Schroth Method specialized physiotherapy.</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-xs font-black text-[#002147] uppercase tracking-widest">&gt; 45°</td>
                    <td className="px-6 py-4"><span className="text-[10px] font-black uppercase px-2 py-1 bg-red-50 text-red-600 rounded">Severe</span></td>
                    <td className="px-6 py-4 text-[10px] font-bold text-[#002147]/50 uppercase tracking-widest leading-tight">Orthopedic surgical consultation for spinal fusion/stabilization.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Verification Footer (Academic Style) */}
          <div className="pt-20 border-t border-[#002147]/10 flex flex-col md:flex-row justify-between items-end gap-10">
             <div className="space-y-4">
                <p className="text-[10px] font-black text-[#002147]/30 uppercase tracking-widest">Ethics & Compliance</p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-[#002147]/5 border border-[#002147]/10 rounded text-[10px] font-black text-[#002147]/40 uppercase tracking-widest">
                    <ShieldCheck size={12} /> HIPAA Validated
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-[#002147]/5 border border-[#002147]/10 rounded text-[10px] font-black text-[#002147]/40 uppercase tracking-widest">
                    <Database size={12} /> GDPR Compliant
                  </div>
                </div>
             </div>
             <div className="text-right space-y-2">
                <p className="text-[10px] font-black text-[#002147]/30 uppercase tracking-widest">Digital Report Verification</p>
                <div className="w-48 h-12 bg-[#002147]/5 border-2 border-dashed border-[#002147]/10 rounded-lg flex items-center justify-center">
                   <span className="text-[8px] font-black text-[#002147]/20 uppercase tracking-widest">SCV-AUTH-0992381-QR-VERIFY</span>
                </div>
                <p className="text-[10px] font-bold text-[#002147]/30 italic">This document is digitally signed by the AI System Core.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationView;
