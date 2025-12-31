import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthProvider';
import { motion } from 'framer-motion';

const UpdatePasswordPage = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const navigate = useNavigate();

  // If there is no user session and no recovery token, this page shouldn't be accessible
  // But Supabase usually handles the session via the URL fragment automatically

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      // Logic for "Forgot Password" flow vs "Change Password" flow
      // If user is already logged in and currentPassword is provided, we re-auth
      if (currentPassword) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: user?.email,
          password: currentPassword,
        });
        if (signInError) throw new Error("Current Access Key is incorrect.");
      }

      // Update to the New Password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      setStatus({ type: 'success', msg: 'Protocol Updated. Security Key Active.' });
      setTimeout(() => navigate('/login'), 2000);
      
    } catch (error) {
      setStatus({ type: 'error', msg: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4 md:px-6 relative overflow-hidden font-sans text-white">
      
      {/* 1. DREAMY GLOWS - Adjusted for Mobile */}
      <div className="absolute top-[10%] left-[-10%] w-[70vw] h-[40vh] bg-brand-red/10 blur-[80px] md:blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[40vh] bg-brand-red/5 blur-[100px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] glass-dark p-8 md:p-12 rounded-[32px] md:rounded-[40px] border border-white/5 relative z-10 shadow-2xl"
      >
        <header className="mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter leading-none">
            Modify <span className="text-brand-red text-glow-small">Access Key</span>
          </h2>
          <p className="text-gray-500 text-[8px] md:text-[9px] uppercase tracking-[0.3em] mt-3 font-bold">
            Security Clearance Level: ALPHA
          </p>
        </header>

        <form onSubmit={handleUpdate} className="space-y-5 md:space-y-6">
          
          {/* CURRENT PASSWORD - Only show if user is already logged in (Settings Mode) */}
          {user && (
            <div className="space-y-2">
              <label className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-gray-500 font-black ml-1">Current Key</label>
              <input 
                type="password" 
                placeholder="Verify existing key"
                className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-xl md:rounded-2xl text-white focus:border-brand-red/50 focus:bg-white/[0.07] transition-all text-sm outline-none"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
          )}

          {/* NEW PASSWORD */}
          <div className="space-y-2">
            <label className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-gray-500 font-black ml-1">New Security Key</label>
            <input 
              type="password" 
              placeholder="Min. 8 characters"
              className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-xl md:rounded-2xl text-white focus:border-brand-red/50 focus:bg-white/[0.07] transition-all text-sm outline-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          <button 
            disabled={loading} 
            type="submit" 
            className="w-full bg-white text-black font-black uppercase text-[10px] tracking-[0.3em] py-4 md:py-5 rounded-xl md:rounded-2xl hover:bg-brand-red hover:text-white transition-all transform active:scale-95 disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(229,9,20,0.4)]"
          >
            {loading ? 'Processing...' : 'Authorize Override'}
          </button>
        </form>

        {status.msg && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className={`mt-6 p-4 rounded-xl border text-[9px] md:text-[10px] text-center font-bold uppercase tracking-widest ${
              status.type === 'success' 
                ? 'bg-green-500/10 border-green-500/20 text-green-500' 
                : 'bg-brand-red/10 border-brand-red/20 text-brand-red'
            }`}
          >
            {status.msg}
          </motion.div>
        )}
        
        {/* Decorative branding for mobile footer of the card */}
        <div className="mt-8 flex justify-center opacity-20">
            <div className="h-[1px] w-8 bg-white/50 self-center" />
            <span className="mx-4 text-[7px] font-black uppercase tracking-[0.5em]">System_v4.0</span>
            <div className="h-[1px] w-8 bg-white/50 self-center" />
        </div>
      </motion.div>
    </div>
  );
};

export default UpdatePasswordPage;