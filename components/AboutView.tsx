
import React from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  Link as LinkIcon, 
  ExternalLink, 
  Lightbulb, 
  Bone, 
  ShieldCheck, 
  Binary, 
  Settings2,
  FileSearch
} from 'lucide-react';

const AboutView: React.FC = () => {
  const sections = [
    {
      title: "Module 1: Image Pre-processing",
      content: "Before analysis, raw X-ray images are processed using Grayscale conversion and Gaussian Blurring (5x5 kernel) to eliminate noise, ensuring that only significant vertebral edges are detected.",
      icon: Settings2,
      color: "text-[#FFFBF2]",
      bg: "bg-white/5"
    },
    {
      title: "Module 2: Feature Extraction",
      content: "The system utilizes Canny Edge Detection (Thresholds: 50, 150) and Hough Line Transform algorithms to identify the vertebral endplates and spinal tilt with clinical precision.",
      icon: Binary,
      color: "text-[#FFFBF2]",
      bg: "bg-white/5"
    },
    {
      title: "Module 3: Cobb Angle Logic",
      content: "The simulated Cobb Angle is calculated using the geometric formula θ = arctan((y2-y1)/(x2-x1)). The absolute difference between the top and bottom endplate angles determines the curvature.",
      icon: Bone,
      color: "text-[#FFFBF2]",
      bg: "bg-white/5"
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#002147]/5 text-[#002147] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#002147]/10 mb-2">
          Technical Documentation
        </div>
        <h2 className="text-5xl font-black text-[#002147] uppercase tracking-tighter">ScolioVision Methodology</h2>
        <p className="text-[#002147]/50 text-lg max-w-2xl mx-auto font-bold uppercase tracking-widest text-xs">An automated web-based system for Scoliosis detection using advanced Computer Vision and rule-based Expert Systems.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section, i) => (
          <div key={i} className="bg-[#FFF8E7] p-8 rounded-3xl border border-[#002147]/10 shadow-sm flex flex-col gap-6 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 bg-[#002147]/10 text-[#002147] rounded-2xl flex items-center justify-center shrink-0`}>
              <section.icon size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#002147] mb-3 uppercase tracking-tighter">{section.title}</h3>
              <p className="text-[#002147]/60 leading-relaxed text-sm font-medium">
                {section.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#FFF8E7] rounded-3xl border border-[#002147]/10 shadow-lg overflow-hidden flex flex-col lg:flex-row">
        <div className="flex-1 p-10 space-y-6">
          <div className="flex items-center gap-2 text-[#002147] font-black uppercase tracking-widest text-[10px]">
            <FileSearch size={16} />
            Severity Classification (Cobb Scale)
          </div>
          <h3 className="text-3xl font-black text-[#002147] leading-tight uppercase tracking-tighter">Expert System Diagnostics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <p className="text-emerald-600 font-black uppercase tracking-widest text-xs">Normal / Mild</p>
              <p className="text-[10px] text-emerald-600/60 mt-1 font-bold uppercase tracking-widest leading-tight">&lt; 25°: Routine monitoring and core stability exercises like Bird-Dog.</p>
            </div>
            <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
              <p className="text-amber-600 font-black uppercase tracking-widest text-xs">Moderate</p>
              <p className="text-[10px] text-amber-600/60 mt-1 font-bold uppercase tracking-widest leading-tight">25° - 45°: May require bracing and specialized physiotherapy (Schroth method).</p>
            </div>
            <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
              <p className="text-red-600 font-black uppercase tracking-widest text-xs">Severe</p>
              <p className="text-[10px] text-red-600/60 mt-1 font-bold uppercase tracking-widest leading-tight">&gt; 45°: Surgical evaluation and intensive orthopedic management.</p>
            </div>
            <div className="p-4 bg-[#002147]/5 rounded-2xl border border-[#002147]/10">
              <p className="text-[#002147] font-black uppercase tracking-widest text-xs">Database Logic</p>
              <p className="text-[10px] text-[#002147]/40 mt-1 font-bold uppercase tracking-widest leading-tight">SQLite integration for long-term patient history tracking and trend analysis.</p>
            </div>
          </div>
        </div>
        <div className="lg:w-1/3 bg-[#002147] flex flex-col items-center justify-center p-12 relative overflow-hidden text-center border-l border-[#002147]/10">
           <div className="absolute inset-0 opacity-20">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000&auto=format&fit=crop" 
                alt="Spine Research" 
                className="w-full h-full object-cover grayscale"
                referrerPolicy="no-referrer"
              />
           </div>
           <div className="relative space-y-4">
              <div className="w-16 h-16 bg-[#FFFBF2]/10 rounded-2xl flex items-center justify-center text-[#FFFBF2] mx-auto mb-4">
                <GraduationCap size={32} />
              </div>
              <p className="text-[#FFFBF2]/60 text-[10px] font-black uppercase tracking-[0.2em]">Academic Project</p>
              <h4 className="text-[#FFFBF2] font-black text-2xl leading-tight uppercase tracking-tighter">MCA Final Year Research</h4>
              <button className="text-[#FFFBF2]/80 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 justify-center mt-4 hover:text-[#FFFBF2] transition-colors">
                Download PDF Report
                <ExternalLink size={14} />
              </button>
           </div>
        </div>
      </div>

      <div className="bg-[#FFF8E7] p-8 rounded-3xl border border-[#002147]/10 flex items-center justify-between flex-wrap gap-6">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-[#002147]/5 rounded-xl shadow-sm flex items-center justify-center text-[#002147]">
              <LinkIcon size={24} />
           </div>
           <div>
              <h4 className="font-black text-[#002147] uppercase tracking-tighter">System Architecture</h4>
              <p className="text-xs font-bold text-[#002147]/40 uppercase tracking-widest">Built using React, Gemini AI, and Tailwind CSS</p>
           </div>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-3 bg-[#002147]/5 border border-[#002147]/10 text-[#002147] rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-[#002147]/10 transition-all">
             Open Documentation
          </button>
          <button className="px-5 py-3 bg-[#002147] text-[#FFFBF2] rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-[#003366] transition-all">
             Source Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutView;
