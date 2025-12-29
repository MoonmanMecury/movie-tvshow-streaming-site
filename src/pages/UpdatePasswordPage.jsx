import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

const UpdatePasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return alert("Access keys do not match.");
    }

    setLoading(true);

    try {
      // Supabase automatically handles the session from the recovery link
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });

      if (error) throw error;

      alert("Access Key updated successfully. Re-entering the vault...");
      navigate('/browse');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-brand-black flex items-center justify-center p-6 relative">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-brand-red/10 via-transparent to-brand-red/5 pointer-events-none" />
      
      <div className="glass w-full max-w-md p-10 md:p-14 rounded-[40px] border border-white/10 shadow-2xl backdrop-blur-3xl relative z-10 animate-fade-in">
        <header className="mb-10 text-center">
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">
            Reset <span className="text-brand-red">Access Key</span>
          </h1>
          <p className="text-gray-500 text-[9px] uppercase tracking-[0.3em] mt-3 font-bold">
            Define your new security credential
          </p>
        </header>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-black ml-1">New Access Key</label>
            <input 
              type="password" 
              placeholder="Min. 8 characters"
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:border-brand-red/50 focus:bg-white/10 transition-all text-sm outline-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-black ml-1">Confirm Access Key</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:border-brand-red/50 focus:bg-white/10 transition-all text-sm outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          <button 
            disabled={loading} 
            type="submit" 
            className="w-full bg-white text-black font-black uppercase text-[10px] tracking-[0.3em] py-5 rounded-2xl hover:bg-brand-red hover:text-white transition-all transform active:scale-95 disabled:opacity-50 shadow-2xl"
          >
            {loading ? 'Securing Vault...' : 'Update & Enter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;