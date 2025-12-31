import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = ({ initialMode = 'login' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState(initialMode);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { 
            emailRedirectTo: 'https://movie-tvshow-streaming-site-xfwf.vercel.app/verify-success'
          }
        });
        if (error) throw error;
        alert("Transmission Sent. Check your inbox to verify your identity.");
        setMode('login'); 
      }
      else if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/browse');
      } 
      else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: 'https://movie-tvshow-streaming-site-xfwf.vercel.app/update-password',
        });
        if (error) throw error;
        alert("Recovery link sent! Access your email to reset your key.");
        setMode('login');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="relative min-h-screen w-full flex bg-brand-black overflow-hidden font-sans text-white"
    >
      {/* 1. CINEMATIC BACKGROUND & DREAMY GLOWS */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 md:opacity-40 scale-105"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2000")' }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-brand-black via-brand-black/60 md:via-brand-black/20 to-transparent" />
        
        {/* Animated Orbs for the "Dreamy" effect */}
        <div className="absolute top-[-10%] left-[-10%] w-[80vw] h-[50vh] bg-brand-red/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[40vh] bg-brand-red/5 blur-[80px] rounded-full" />
      </div>

      {/* 2. LEFT SIDE: Branding (Hidden on Mobile, or shown as a header) */}
      <div className="hidden lg:flex lg:w-3/5 relative z-10 flex-col justify-between p-20">
        <h1 onClick={() => navigate('/')} className="text-2xl font-black italic tracking-tighter uppercase cursor-pointer hover:text-brand-red transition-colors">
          APRIL <span className="text-brand-red">STREAM</span>
        </h1>
        <div className="max-w-xl">
           <h2 className="text-7xl font-black uppercase leading-[0.85] tracking-tighter italic">
            Watch Everything. <br /> Feel <span className="text-brand-red text-glow">Nothing</span> Less.
          </h2>
        </div>
        <div className="flex gap-8 text-[10px] tracking-[0.4em] uppercase font-black text-gray-600">
          <span>Ultrawide Ready</span><span>No Ads</span><span>4K HDR</span>
        </div>
      </div>

      {/* 3. RIGHT SIDE: THE FORM (Mobile Optimized) */}
      <div className="w-full lg:w-2/5 relative z-20 flex flex-col items-center justify-center p-6 md:p-10">
        
        {/* Mobile-Only Logo */}
        <div className="lg:hidden mb-12 text-center">
             <h1 onClick={() => navigate('/')} className="text-xl font-black italic tracking-tighter uppercase">
                APRIL <span className="text-brand-red">STREAM</span>
             </h1>
        </div>

        <motion.div 
          layout
          className="glass-dark w-full max-w-md p-8 md:p-14 rounded-[32px] md:rounded-[40px] border border-white/5 shadow-2xl backdrop-blur-3xl"
        >
          <header className="mb-8 md:mb-10">
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic leading-none">
              {mode === 'signup' ? 'Create Account' : mode === 'forgot' ? 'Recover Vault' : 'Welcome Back'}
            </h3>
            <p className="text-gray-500 text-[8px] md:text-[9px] uppercase tracking-[0.3em] mt-3 font-bold">
              {mode === 'signup' ? 'Access Protocol Initiation' : 'Curated Cinema Awaits'}
            </p>
          </header>

          <form onSubmit={handleAuth} className="space-y-5 md:space-y-6">
            <div className="space-y-2">
              <label className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-gray-500 font-black ml-1">Identity</label>
              <input 
                type="email" 
                placeholder="email@vault.com"
                className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-xl md:rounded-2xl text-white focus:border-brand-red/50 focus:bg-white/[0.08] transition-all text-sm outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-2">
                <label className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-gray-500 font-black ml-1">Access Key</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-xl md:rounded-2xl text-white focus:border-brand-red/50 focus:bg-white/[0.08] transition-all text-sm outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>
            )}

            <button 
              disabled={loading} 
              type="submit" 
              className="w-full bg-white text-black font-black uppercase text-[10px] tracking-[0.3em] py-4 md:py-5 rounded-xl md:rounded-2xl hover:bg-brand-red hover:text-white transition-all transform active:scale-95 disabled:opacity-50 shadow-2xl hover:shadow-[0_0_30px_rgba(229,9,20,0.3)]"
            >
              {loading ? 'Verifying...' : mode === 'signup' ? 'Begin Membership' : mode === 'forgot' ? 'Send Reset Link' : 'Enter The Stream'}
            </button>
          </form>

          <footer className="mt-8 flex flex-col gap-4 text-center">
            {mode === 'login' && (
              <button onClick={() => setMode('forgot')} className="text-[9px] text-gray-600 uppercase tracking-widest hover:text-white transition-colors">
                Forgot Access Key?
              </button>
            )}
            <p className="text-gray-500 text-[9px] md:text-[10px] uppercase tracking-widest font-bold">
              {mode === 'login' ? "New to the gallery?" : "Return to gallery?"} 
              <button 
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-brand-red ml-2 hover:text-white transition-colors uppercase"
              >
                {mode === 'login' ? 'Register' : 'Sign In'}
              </button>
            </p>
          </footer>
        </motion.div>
        
        {/* Mobile Footer Branding */}
        <div className="mt-12 opacity-10 lg:hidden">
             <p className="text-[6px] font-black uppercase tracking-[1.5em]">Noir Digital Systems</p>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;