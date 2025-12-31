import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import tmdb, { getImagePath } from '../services/tmdb';
import Nav from '../components/Nav';

const WatchPage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  
  const [details, setDetails] = useState(null);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [episodesList, setEpisodesList] = useState([]);
  const isSeries = type === 'tv';

  useEffect(() => {
    async function fetchMainData() {
      try {
        const { data } = await tmdb.get(`/${type}/${id}`);
        setDetails(data);
      } catch (error) { console.error("Signal lost", error); }
    }
    fetchMainData();
  }, [type, id]);

  useEffect(() => {
    if (isSeries) {
      async function fetchSeasonData() {
        try {
          const { data } = await tmdb.get(`/tv/${id}/season/${season}`);
          setEpisodesList(data.episodes);
        } catch (e) { console.error("Sequence blocked"); }
      }
      fetchSeasonData();
    }
  }, [id, season, isSeries]);

  const streamUrl = isSeries 
    ? `https://vidsrc.to/embed/tv/${id}/${season}/${episode}` 
    : `https://vidsrc.to/embed/movie/${id}`;

  return (
    <div className="bg-[#050000] min-h-screen text-white selection:bg-red-600 overflow-x-hidden">
      <Nav />
      
      {/* 1. ATMOSPHERIC BACKDROP (The Glows) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Top Center Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[40vh] bg-red-600/10 blur-[120px] rounded-full opacity-50" />
        {/* Side Accent */}
        <div className="absolute bottom-0 right-0 w-[40vw] h-[40vh] bg-red-600/5 blur-[100px] rounded-full" />
      </div>

      <main className="relative z-10 pt-20 md:pt-28 px-4 md:px-8 max-w-[1300px] mx-auto pb-20">
        
        {/* COMPACT PLAYER ENGINE */}
        <div className="w-full space-y-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative glass rounded-[24px] md:rounded-[40px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] aspect-video border border-white/10 bg-black/40 backdrop-blur-sm"
          >
            <iframe 
              src={streamUrl} 
              className="absolute inset-0 w-full h-full" 
              allowFullScreen 
              title="Noir Player" 
            />
          </motion.div>

          {/* INFORMATION & CONTROLS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 px-2">
            
            {/* LEFT: Metadata & Identity */}
            <div className={`space-y-6 ${isSeries ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-4">
                  <span className="bg-red-600/10 border border-red-600/20 text-red-600 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em]">
                    Signal Locked
                  </span>
                  <span className="text-gray-600 text-[9px] font-black uppercase tracking-[0.4em]">
                    {details?.release_date?.split('-')[0] || details?.first_air_date?.split('-')[0]} // {details?.runtime || details?.number_of_seasons} units
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
                  {details?.title || details?.name} <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">.</span>
                </h1>
              </motion.div>
              
              <p className="text-gray-400 text-sm md:text-lg leading-relaxed max-w-3xl font-medium">
                {details?.overview}
              </p>

              {/* ACTIONS: Secure to Vault / Return */}
              <div className="flex flex-wrap gap-4 pt-4">
                <button className="flex-1 md:flex-none px-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-xl active:scale-95">
                  Secure to Vault
                </button>
                <button 
                  onClick={() => navigate('/browse')}
                  className="flex-1 md:flex-none px-10 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all"
                >
                  Return to Base
                </button>
              </div>
            </div>

            {/* RIGHT: Series Navigation Hub */}
            {isSeries && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-4"
              >
                <div className="bg-white/[0.03] backdrop-blur-xl p-6 md:p-8 rounded-[32px] border border-white/10 shadow-2xl">
                  <div className="mb-8">
                    <label className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-black mb-4 block">Protocol (Season)</label>
                    <div className="relative">
                      <select 
                        value={season}
                        onChange={(e) => { setSeason(e.target.value); setEpisode(1); }}
                        className="w-full bg-black/60 border border-white/10 p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none focus:border-red-600 appearance-none cursor-pointer transition-colors"
                      >
                        {[...Array(details?.number_of_seasons)].map((_, i) => (
                          <option key={i+1} value={i+1} className="bg-[#050000]">Season {i+1}</option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-red-600 text-[10px]">▼</div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-black mb-4 block">Sequence (Episode)</label>
                    <div className="grid grid-cols-4 lg:grid-cols-1 gap-2 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                      {episodesList.map((ep) => (
                        <button 
                          key={ep.id}
                          onClick={() => setEpisode(ep.episode_number)}
                          className={`p-4 rounded-xl border text-[10px] font-black transition-all flex items-center justify-center lg:justify-start ${episode === ep.episode_number ? 'border-red-600 bg-red-600/20 text-white shadow-[0_0_20px_rgba(220,38,38,0.2)]' : 'border-white/5 bg-white/5 text-gray-500 hover:text-white hover:bg-white/10'}`}
                        >
                          <span className={`${episode === ep.episode_number ? 'text-red-600' : 'text-gray-700'} lg:mr-4`}>
                            {ep.episode_number.toString().padStart(2, '0')}
                          </span>
                          <span className="hidden lg:inline truncate opacity-80">{ep.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WatchPage;