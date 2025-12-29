import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(20px)", scale: 1.1 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      onClick={() => navigate('/login')}
      className="relative min-h-screen w-full flex items-center justify-center bg-black cursor-pointer overflow-hidden"
    >
      {/* Background with pulsating mesh */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-red/30 via-purple-900/20 to-black animate-pulse" />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] bg-brand-red/5 rounded-full blur-[120px]" 
        />
      </div>

      <div className="relative z-20 text-center select-none group">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-7xl md:text-9xl font-black italic tracking-tighter text-white uppercase"
        >
          APRIL <span className="text-brand-red">STREAM</span>
        </motion.h1>
        <p className="mt-6 text-[10px] tracking-[0.8em] text-gray-500 uppercase font-black animate-pulse">
          Click to dissolve into cinema
        </p>
      </div>
    </motion.div>
  );
};

export default LandingPage;