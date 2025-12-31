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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      // 1. Re-authenticate the user first to verify the "Current Password"
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error("Current Access Key is incorrect.");
      }

      // 2. If re-auth is successful, update to the "New Password"
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      setStatus({ type: 'success', msg: 'Protocol Updated. Redirecting...' });
      setTimeout(() => navigate('/profile'), 2000);
      
    } catch (error) {
      setStatus({ type: 'error', msg: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-6 relative overflow-hidden font-sans text-white">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-red/10 blur-[150px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass max-w-md w-full p-10 rounded-[40px] border border-white/10 relative z-10"
      >
        <header className="mb-10">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter">
            Modify <span className="text-brand-red">Access Key</span>
          </h2>
          <p className="text-gray-500 text-[9px] uppercase tracking-[0.3em] mt-3 font-bold">
            Security Clearance Required
          </p>
        </header>

        <form onSubmit={handleUpdate} className="space-y-6">
          {/* CURRENT PASSWORD */}
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-black ml-1">Current Key</label>
            <input 
              type="password" 
              placeholder="Confirm existing key"
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:border-brand-red/50 focus:bg-white/10 transition-all text-sm outline-none"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          {/* NEW PASSWORD */}
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-black ml-1">New Key</label>
            <input 
              type="password" 
              placeholder="Minimum 8 characters"
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:border-brand-red/50 focus:bg-white/10 transition-all text-sm outline-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          <button 
            disabled={loading} 
            type="submit" 
            className="w-full bg-white text-black font-black uppercase text-[10px] tracking-[0.3em] py-5 rounded-2xl hover:bg-brand-red hover:text-white transition-all transform active:scale-95 disabled:opacity-50 shadow-2xl"
          >
            {loading ? 'Authenticating...' : 'Authorize Change'}
          </button>
        </form>

        {status.msg && (
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className={`text-[10px] text-center font-bold uppercase tracking-widest mt-6 ${status.type === 'success' ? 'text-green-500' : 'text-brand-red'}`}
          >
            {status.msg}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default UpdatePasswordPage;