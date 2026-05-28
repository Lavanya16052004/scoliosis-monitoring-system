import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { User } from '../types';

interface LoginViewProps {
  onLogin: (user: User) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (identifier && password) {
      const derivedName = identifier.includes('@') 
        ? identifier.split('@')[0].charAt(0).toUpperCase() + identifier.split('@')[0].slice(1)
        : 'Medical User';

      onLogin({
        name: derivedName,
        designation: 'Medical Practitioner',
        department: 'Scoliosis Diagnostic Wing'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF2] flex flex-col lg:flex-row font-sans overflow-hidden">
      {/* Left Side: Spinal Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#002147] relative items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img 
            src="https://tse4.mm.bing.net/th/id/OIP.vXXcvV8SvIcdUEY3MY6YGAHaJQ?pid=ImgDet&w=178&h=221&c=7&dpr=1.5&o=7&rm=3" 
            alt="Spinal Analysis" 
            className="w-full h-full object-cover opacity-40 grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#002147] via-transparent to-[#002147]/20"></div>
        </motion.div>
        
        <div className="relative z-10 text-center p-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="w-20 h-20 bg-[#FFFBF2] rounded-3xl flex items-center justify-center text-[#002147] mx-auto mb-8 shadow-2xl">
              <ShieldCheck size={40} />
            </div>
            <h1 className="text-5xl font-black text-[#FFFBF2] tracking-tighter mb-4 uppercase">ScolioVision AI</h1>
            <p className="text-[#FFFBF2]/60 font-bold uppercase tracking-[0.3em] text-xs">Advanced Spinal Analysis </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Simple Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 bg-[#FFFBF2]">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="mb-12">
            <h2 className="text-4xl font-black text-[#002147] tracking-tighter mb-2">Welcome</h2>
            <p className="text-[#002147]/40 font-bold uppercase tracking-widest text-[10px]">Secure Clinical Access Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-[#002147]/40 uppercase tracking-widest ml-1"> Enter Email</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[#002147]/20 group-focus-within:text-[#002147] transition-colors" size={18} />
                <input
                  required
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Email or Clinical ID"
                  className="w-full bg-[#002147]/5 border border-[#002147]/10 rounded-2xl px-14 py-5 focus:ring-2 focus:ring-[#002147] transition-all font-bold text-[#002147] placeholder:text-[#002147]/20 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-[#002147]/40 uppercase tracking-widest">Access Key</label>
                <button type="button" className="text-[10px] font-black text-[#002147]/40 hover:text-[#002147] uppercase tracking-widest transition-colors">Forgot?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-[#002147]/20 group-focus-within:text-[#002147] transition-colors" size={18} />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#002147]/5 border border-[#002147]/10 rounded-2xl px-14 py-5 focus:ring-2 focus:ring-[#002147] transition-all font-bold text-[#002147] placeholder:text-[#002147]/20 outline-none"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#002147]/20 hover:text-[#002147] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full py-6 bg-[#002147] text-[#FFFBF2] rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-xl shadow-[#002147]/10 hover:bg-[#003366] transition-all"
            >
              Sign In
              <ArrowRight size={18} />
            </motion.button>
          </form>

          <div className="mt-12 pt-8 border-t border-[#002147]/5 text-center">
            <p className="text-[10px] text-[#002147]/30 font-black uppercase tracking-widest">
              Authorized Personnel Only  
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginView;
