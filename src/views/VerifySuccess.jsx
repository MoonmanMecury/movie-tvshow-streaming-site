import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const VerifySuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Countdown logic
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Redirect after 5 seconds
    const redirect = setTimeout(() => {
      navigate('/login');
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-red/20 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass max-w-md w-full p-10 rounded-[40px] border border-white/5 text-center relative z-10"
      >
        {/* Success Icon */}
        <div className="w-20 h-20 bg-brand-red/10 border border-brand-red/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <motion.svg 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
            className="w-10 h-10 text-brand-red" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </motion.svg>
        </div>

        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-4">
          Access <span className="text-brand-red">Granted</span>
        </h1>
        
        <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] leading-relaxed mb-8">
          Identity Verified. <br />
          Your Noir Protocol connection is now active.
        </p>

        <div className="space-y-4">
          <button 
            onClick={() => navigate('/login')}
            className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-red hover:text-white transition-all active:scale-95 shadow-2xl"
          >
            Enter System Now
          </button>
          
          <p className="text-[9px] text-gray-600 uppercase tracking-widest">
            Automatic redirect in <span className="text-white">{countdown}s</span>
          </p>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="absolute bottom-10 left-0 w-full text-center">
        <p className="text-[8px] text-gray-800 uppercase tracking-[1em] font-black">
          Noir encrypted communication
        </p>
      </div>
    </div>
  );
};

export default VerifySuccess;