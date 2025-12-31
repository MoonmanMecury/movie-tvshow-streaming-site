import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { motion } from 'framer-motion'; // Necessary for the dissolve

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
          // 1. Check if we are on Vercel or Local 
          // 2. Use the exact string that matches your Supabase 'Redirect URL' list
          emailRedirectTo: window.location.hostname === 'localhost' 
            ? 'http://localhost:5173/verify-success' 
            : 'https://movie-tvshow-streaming-site-xfwf.vercel.app/verify-success'
        }
      });
      
      if (error) throw error;
      
      // Notify the user to check their inbox
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
          redirectTo: `${window.location.origin}/update-password`,
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
      // This is the "Bake": It coordinates with the LandingPage exit
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="relative min-h-screen w-full flex bg-brand-black overflow-hidden font-sans"
    >
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0 bg-cover bg-center opacity-40 scale-105"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2000")' }} />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-brand-black via-brand-black/20 to-transparent" />

      {/* LEFT SIDE: Branding */}
      <div className="hidden lg:flex lg:w-3/5 relative z-10 flex-col justify-between p-20">
        <h1 onClick={() => navigate('/')} className="text-3xl font-black italic tracking-tighter text-white uppercase cursor-pointer">
          APRIL <span className="text-brand-red">STREAM</span>
        </h1>
        <div className="max-w-xl">
           <h2 className="text-5xl lg:text-7xl font-black text-white uppercase leading-[0.85] tracking-tighter italic">
            Watch Everything. <br /> Feel <span className="text-brand-red">Nothing</span> Less.
          </h2>
        </div>
        <div className="flex gap-8 text-[10px] tracking-widest uppercase font-bold text-gray-600">
          <span>Ultrawide Ready</span><span>No Ads</span><span>4K HDR</span>
        </div>
      </div>

      {/* RIGHT SIDE: The Form some thing has changed*/}
      <div className="w-full lg:w-2/5 relative z-20 flex items-center justify-center p-4 md:p-10">
        <div className="glass w-full max-w-md p-6 md:p-14 rounded-3xl md:rounded-[40px]. border border-white/10 shadow-2xl backdrop-blur-3xl">
          <header className="mb-10">
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">
              {mode === 'signup' ? 'Create Account' : mode === 'forgot' ? 'Recover Vault' : 'Welcome Back'}
            </h3>
            <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mt-2 font-bold">
              {mode === 'signup' ? 'Min. 8 characters required' : 'Curated Cinema Awaits'}
            </p>
          </header>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-black ml-1">Identity</label>
              <input 
                type="email" 
                placeholder="email@vault.com"
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:border-brand-red/50 focus:bg-white/10 transition-all text-sm outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-black ml-1">Access Key</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:border-brand-red/50 focus:bg-white/10 transition-all text-sm outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>
            )}

            <button disabled={loading} type="submit" className="w-full bg-white text-black font-black uppercase text-[10px] tracking-[0.3em] py-5 rounded-2xl hover:bg-brand-red hover:text-white transition-all transform active:scale-95 disabled:opacity-50 shadow-2xl">
              {loading ? 'Verifying...' : mode === 'signup' ? 'Begin Membership' : mode === 'forgot' ? 'Send Reset Link' : 'Enter The Stream'}
            </button>
          </form>

          <footer className="mt-8 flex flex-col gap-4 text-center">
            {mode === 'login' && (
              <button onClick={() => setMode('forgot')} className="text-[9px] text-gray-600 uppercase tracking-widest hover:text-white">
                Forgot Access Key?
              </button>
            )}
            <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">
              {mode === 'login' ? "New to the gallery?" : "Return to gallery?"} 
              <button 
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-brand-red ml-2 hover:text-white transition-colors uppercase"
              >
                {mode === 'login' ? 'Register' : 'Sign In'}
              </button>
            </p>
          </footer>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;