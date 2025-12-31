import { useState, useEffect } from 'react';
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
  const [isRecovery, setIsRecovery] = useState(false); // THE FIX
  const navigate = useNavigate();

  useEffect(() => {
    // Detect if the user clicked the link from the "Forgot Password" email
    if (window.location.hash.includes('type=recovery')) {
      setIsRecovery(true);
    }
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      // 1. Re-auth only if we are NOT in recovery mode (user is logged in and just changing settings)
      if (!isRecovery && user) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: currentPassword,
        });
        if (signInError) throw new Error("Current Access Key is incorrect.");
      }

      // 2. Update to the New Password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      setStatus({ type: 'success', msg: 'Protocol Updated. Security Key Active.' });
      
      // Redirect based on how they got here
      setTimeout(() => navigate(isRecovery ? '/login' : '/browse'), 2000);
      
    } catch (error) {
      setStatus({ type: 'error', msg: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4 md:px-6 relative overflow-hidden font-sans text-white">
      
      {/* DREAMY GLOWS */}
      <div className="absolute top-[10%] left-[-10%] w-[70vw] h-[40vh] bg-brand-red/10 blur-[80px] md:blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[40vh] bg-brand-red/5 blur-[100px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] glass-dark p-8 md:p-12 rounded-[32px] md:rounded-[40px] border border-white/5 relative z-10 shadow-2xl"
      >
        <header className="mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter leading-none">
            {isRecovery ? 'Reset' : 'Modify'} <span className="text-brand-red text-glow-small">Access Key</span>
          </h2>
          <p className="text-gray-500 text-[8px] md:text-[9px] uppercase tracking-[0.3em] mt-3 font-bold">
            {isRecovery ? 'Recovery Protocol Active' : 'Security Clearance Level: ALPHA'}
          </p>
        </header>

        <form onSubmit={handleUpdate} className="space-y-5 md:space-y-6">
          
          {/* CURRENT PASSWORD - Only show if it's NOT a recovery flow */}
          {!isRecovery && (
            <div className="space-y-2">
              <label className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-gray-500 font-black ml-1">Current Key</label>
              <input 
                type="password" 
                placeholder="Verify existing key"
                className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-xl md:rounded-2xl text-white focus:border-brand-red/50 focus:bg-white/[0.07] transition-all text-sm outline-none"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required={!isRecovery}
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
            {loading ? 'Processing...' : isRecovery ? 'Set New Key' : 'Authorize Override'}
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
      </motion.div>
    </div>
  );
};

export default UpdatePasswordPage;