import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-black text-white relative overflow-x-hidden font-sans">
      
      {/* 1. DREAMY BACKGROUND AESTHETIC */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-10%] w-[80%] md:w-[50%] h-[50%] bg-brand-red/10 blur-[80px] md:blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-10%] w-[60%] md:w-[40%] h-[40%] bg-brand-red/5 blur-[80px] md:blur-[100px] rounded-full" />
      </div>

      {/* 2. NAVIGATION */}
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-16 py-6 md:py-8">
        <h1 className="text-lg md:text-2xl font-black italic tracking-tighter uppercase">
          APRIL <span className="text-brand-red">STREAM</span>
        </h1>
        <div className="flex items-center gap-4 md:gap-8 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">
          {/* Hidden on small mobile to save space */}
          <span className="hidden sm:block hover:text-brand-red cursor-pointer transition-colors">Learn More</span>
          <button 
            onClick={() => navigate('/login')}
            className="bg-white text-black px-4 py-2 md:px-6 md:py-2 rounded-full hover:bg-brand-red hover:text-white transition-all text-[8px] md:text-[10px]"
          >
            Login
          </button>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-8 md:pt-12 px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mb-12"
        >
          <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase italic leading-[0.95] md:leading-[0.9] tracking-tighter mb-6">
            WATCH EVERYTHING.<br />
            FEEL <span className="text-brand-red text-glow">NOTHING</span> LESS.
          </h2>
          <p className="text-[8px] md:text-xs text-gray-500 font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] max-w-xs md:max-w-none mx-auto mt-6">
            Curated Cinema. Encrypted Delivery. Your Private Screen.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10 w-full max-w-md mx-auto sm:max-w-none">
            <button 
              onClick={() => navigate('/signup')}
              className="w-full sm:w-auto bg-brand-black border border-white/20 text-white px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all"
            >
              Join The Protocol
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto bg-brand-red text-white px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(229,9,20,0.3)]"
            >
              Browse Gallery
            </button>
          </div>
        </motion.div>

        {/* 4. THE COMMAND CENTER (DYNAMIC RESOLUTION CARD) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-5xl glass-dark border border-white/5 rounded-[24px] md:rounded-[40px] p-4 md:p-10 mb-20 shadow-2xl relative overflow-hidden backdrop-blur-3xl"
        >
          {/* Dashboard UI Simulation - Stacks on Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 opacity-60">
            {/* Visualizer 1 */}
            <div className="h-32 md:h-48 bg-white/5 rounded-2xl border border-white/5 p-4 relative overflow-hidden">
               <div className="flex justify-between items-start mb-4">
                 <div className="w-6 h-6 md:w-10 md:h-10 bg-brand-red/20 rounded-full" />
                 <div className="text-[6px] md:text-[8px] uppercase tracking-widest font-bold">V-NODE ENCRYPTED</div>
               </div>
               <div className="absolute bottom-0 left-0 w-full h-12 md:h-24 bg-gradient-to-t from-brand-red/20 to-transparent" />
            </div>
            {/* Visualizer 2 */}
            <div className="h-32 md:h-48 bg-white/5 rounded-2xl border border-white/5 p-4 flex items-end gap-1 md:gap-2">
               {[40, 70, 45, 90, 65, 80, 30, 50, 85].map((h, i) => (
                 <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-brand-red/40 rounded-t-sm" />
               ))}
            </div>
          </div>
          
          {/* Sub-labeling - Scrollable on very small screens */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-6 md:mt-8">
            {['Ultrawide Ready', 'No Ads', '4K HDR'].map((text, i) => (
              <span key={i} className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-600">
                {text}
              </span>
            ))}
          </div>
        </motion.div>

        {/* 5. SYSTEM FEATURES (Responsive Grid) */}
        <section className="relative z-10 px-2 md:px-16 py-12 md:py-32 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { title: "Encrypted Stream", desc: "End-to-end delivery of 4K content through the Noir Protocol.", tag: "01" },
              { title: "The Private Vault", desc: "Curate your own personal collection of cinematic masterpieces.", tag: "02" },
              { title: "Ultra-Wide Sync", desc: "Natively formatted for cinematic displays and immersive viewing.", tag: "03" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-4"
              >
                <span className="text-brand-red font-black text-[9px] md:text-[10px] tracking-[0.5em] mb-3 md:mb-4 block">
                  LEVEL_{feature.tag}
                </span>
                <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter mb-4 group-hover:text-brand-red transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-widest leading-relaxed">
                  {feature.desc}
                </p>
                <div className="w-12 h-[2px] bg-white/10 mt-6 group-hover:w-full transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* 6. CALL TO ACTION FOOTER */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="relative z-10 py-24 md:py-40 text-center border-t border-white/5 w-full"
        >
          <h2 className="text-3xl md:text-6xl font-black uppercase italic tracking-tighter mb-8 px-4">
            Ready to <span className="text-brand-red text-glow-small">Enter?</span>
          </h2>
          <button 
            onClick={() => navigate('/signup')}
            className="w-[80%] max-w-xs sm:w-auto bg-white text-black px-12 py-5 rounded-2xl font-black uppercase text-[10px] md:text-[12px] tracking-[0.3em] md:tracking-[0.4em] hover:bg-brand-red hover:text-white transition-all active:scale-95"
          >
            Initialize Connection
          </button>
        </motion.section>
      </main>

      {/* Background Branding Footer */}
      <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none w-full text-center">
        <p className="text-[6px] md:text-[7px] font-black uppercase tracking-[1.5em] md:tracking-[2em]">Noir Digital Systems</p>
      </div>
    </div>
  );
};

export default LandingPage;