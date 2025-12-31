import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from '../components/Nav';

const Watchpage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  
  // State for TV Show protocols
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const isSeries = type === 'tv';

  // Construct the secure stream link
  // Using vidsrc.to for a clean, fast connection
  const streamUrl = isSeries 
    ? `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`
    : `https://vidsrc.to/embed/movie/${id}`;

  return (
    <div className="min-h-screen bg-[#020000] text-white selection:bg-red-600 overflow-x-hidden">
      <Nav />
      
      {/* 1. ATMOSPHERIC BACKDROP */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50vh] bg-red-600/5 blur-[120px] rounded-full opacity-60" />
      </div>

      <main className="relative z-10 pt-20 md:pt-28 pb-20">
        
        {/* THE PLAYER ENGINE */}
        <section className="w-full max-w-[1440px] mx-auto px-0 md:px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full aspect-video bg-black shadow-[0_0_100px_rgba(0,0,0,0.8)] md:rounded-[32px] overflow-hidden border border-white/5"
          >
            <iframe
              src={streamUrl}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              frameBorder="0"
              title="Noir Protocol Stream"
            />
          </motion.div>
        </section>

        {/* METADATA & CONTROL PANEL */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-12 mt-12 md:mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* LEFT: Identity & Selectors */}
            <div className="lg:col-span-8 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="bg-red-600/10 border border-red-600/20 text-red-600 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em]">
                    Uplink Active
                  </span>
                  <span className="text-gray-600 text-[9px] font-black uppercase tracking-[0.4em]">
                    Mode: {isSeries ? 'Series' : 'Feature'} // ID: {id}
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
                  Live <span className="text-red-600 text-glow">Transmission</span>
                </h1>
              </div>

              {/* EPISODE SELECTOR (Only shows for TV) */}
              {isSeries && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-wrap gap-6 p-8 bg-white/[0.02] border border-white/5 rounded-[32px] backdrop-blur-md"
                >
                  <div className="space-y-3">
                    <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1">Protocol (Season)</label>
                    <div className="relative">
                      <select 
                        value={season}
                        onChange={(e) => setSeason(e.target.value)}
                        className="bg-black border border-white/10 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest outline-none focus:border-red-600 transition-all appearance-none cursor-pointer pr-12"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Level {s}</option>)}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">▼</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-1">Sequence (Episode)</label>
                    <input 
                      type="number"
                      min="1"
                      value={episode}
                      onChange={(e) => setEpisode(e.target.value)}
                      className="bg-black border border-white/10 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest outline-none focus:border-red-600 transition-all w-32"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* RIGHT: System Actions */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white/[0.03] backdrop-blur-3xl p-8 md:p-10 rounded-[40px] border border-white/5 shadow-2xl">
                <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-600 mb-8 flex items-center gap-4">
                  Actions <div className="flex-1 h-[1px] bg-white/5" />
                </h3>
                
                <div className="space-y-4">
                  <button className="w-full py-5 bg-white text-black font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl hover:bg-red-600 hover:text-white transition-all transform active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                    Secure to Vault
                  </button>
                  
                  <button 
                    onClick={() => navigate('/browse')}
                    className="w-full py-5 bg-transparent border border-white/10 text-white font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl hover:bg-white/5 transition-all"
                  >
                    Return to Base
                  </button>
                </div>
              </div>

              <p className="text-[8px] text-center text-gray-800 uppercase tracking-[0.6em] px-10 leading-loose font-bold">
                Warning: Unauthorized distribution of this signal will terminate clearance.
              </p>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
};

export default Watchpage;