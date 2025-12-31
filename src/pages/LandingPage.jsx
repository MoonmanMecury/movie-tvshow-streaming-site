import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-black text-white relative overflow-hidden font-sans">
      
      {/* 1. DREAMY BACKGROUND AESTHETIC */}
      {/* Animated Gradient Orbs for that "Dreamy" feel */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-red/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-red/5 blur-[100px] rounded-full" />
      </div>

      {/* 2. NAVIGATION */}
      <nav className="relative z-50 flex items-center justify-between px-8 md:px-16 py-8">
        <h1 className="text-2xl font-black italic tracking-tighter uppercase">
          APRIL <span className="text-brand-red">STREAM</span>
        </h1>
        <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em]">
          <span className="hover:text-brand-red cursor-pointer transition-colors">Learn More</span>
          <span className="hover:text-brand-red cursor-pointer transition-colors">Contact</span>
          <button 
            onClick={() => navigate('/login')}
            className="bg-white text-black px-6 py-2 rounded-full hover:bg-brand-red hover:text-white transition-all shadow-xl"
          >
            Login
          </button>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-12 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mb-12"
        >
          <h2 className="text-5xl md:text-7xl font-black uppercase italic leading-[0.9] tracking-tighter mb-4">
            WATCH EVERYTHING.<br />
            FEEL <span className="text-brand-red text-glow">NOTHING</span> LESS.
          </h2>
          <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-[0.4em] mt-6">
            Curated Cinema. Encrypted Delivery. Your Private Screen.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <button 
              onClick={() => navigate('/signup')}
              className="bg-brand-black border border-white/20 text-white px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all"
            >
              Join The Protocol
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="bg-brand-red text-white px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(229,9,20,0.3)]"
            >
              Browse Gallery
            </button>
          </div>
        </motion.div>

        {/* 4. THE COMMAND CENTER (REFERENCE CARD) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-5xl glass-dark border border-white/5 rounded-[40px] p-6 md:p-10 mb-20 shadow-2xl relative overflow-hidden backdrop-blur-3xl"
        >
          {/* Dashboard UI Simulation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60">
            {/* Visualizer 1 */}
            <div className="h-48 bg-white/5 rounded-2xl border border-white/5 p-4 relative overflow-hidden">
               <div className="flex justify-between items-start mb-4">
                 <div className="w-10 h-10 bg-brand-red/20 rounded-full" />
                 <div className="text-[8px] uppercase tracking-widest font-bold">V-NODE ENCRYPTED</div>
               </div>
               <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-brand-red/20 to-transparent" />
            </div>
            {/* Visualizer 2 */}
            <div className="h-48 bg-white/5 rounded-2xl border border-white/5 p-4 flex items-end gap-2">
               {[40, 70, 45, 90, 65, 80, 30].map((h, i) => (
                 <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-brand-red/40 rounded-t-sm" />
               ))}
            </div>
          </div>
          
          {/* Sub-labeling */}
          <div className="flex justify-center gap-12 mt-8">
            {['Ultrawide Ready', 'No Ads', '4K HDR'].map((text, i) => (
              <span key={i} className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-600">
                {text}
              </span>
            ))}
          </div>
        </motion.div>
        {/* 5. SYSTEM FEATURES (Scroll Reveal) */}
<section className="relative z-10 px-6 md:px-16 py-32 max-w-7xl mx-auto">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
    {[
      {
        title: "Encrypted Stream",
        desc: "End-to-end delivery of 4K content through the Noir Protocol.",
        tag: "01"
      },
      {
        title: "The Private Vault",
        desc: "Curate your own personal collection of cinematic masterpieces.",
        tag: "02"
      },
      {
        title: "Ultra-Wide Sync",
        desc: "Natively formatted for cinematic displays and immersive viewing.",
        tag: "03"
      }
    ].map((feature, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.2 }}
        className="group"
      >
        <span className="text-brand-red font-black text-[10px] tracking-[0.5em] mb-4 block">
          LEVEL_{feature.tag}
        </span>
        <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4 group-hover:text-brand-red transition-colors">
          {feature.title}
        </h3>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
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
  className="relative z-10 py-40 text-center border-t border-white/5"
>
  <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-8">
    Ready to <span className="text-brand-red">Enter?</span>
  </h2>
  <button 
    onClick={() => navigate('/signup')}
    className="bg-white text-black px-12 py-5 rounded-2xl font-black uppercase text-[12px] tracking-[0.4em] hover:bg-brand-red hover:text-white transition-all active:scale-95"
  >
    Initialize Connection
  </button>
</motion.section>
      </main>

      {/* Background Branding Footer */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none">
        <p className="text-[7px] font-black uppercase tracking-[2em]">Noir Digital Systems</p>
      </div>
    </div>
  );
};

export default LandingPage;