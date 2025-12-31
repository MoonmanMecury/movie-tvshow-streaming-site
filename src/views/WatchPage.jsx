import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
      
      {/* ATMOSPHERIC BACKDROP */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-red-600/5 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-0 left-0 w-[30vw] h-[30vh] bg-red-600/5 blur-[100px] rounded-full opacity-30" />
      </div>

      <main className="relative z-10 pt-20 md:pt-28 px-4 md:px-12 max-w-[1800px] mx-auto pb-20">
        
        {/* RESPONSIVE GRID: Column on Mobile, 4-cols on Desktop */}
        <div className="flex flex-col xl:grid xl:grid-cols-4 gap-8 md:gap-12">
          
          {/* LEFT: PLAYER & INFO AREA */}
          <div className="xl:col-span-3 space-y-8">
            {/* The Player Box */}
            <div className="glass rounded-[24px] md:rounded-[40px] overflow-hidden shadow-2xl aspect-video border border-white/5 bg-black/40 backdrop-blur-sm">
              <iframe src={streamUrl} className="w-full h-full" allowFullScreen title="Noir Player" />
            </div>

            {/* Metadata Section */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6 px-2 md:px-0">
              <div className="flex items-center gap-4">
                 <span className="bg-red-600/10 border border-red-600/20 text-red-600 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em]">
                    Active Signal
                  </span>
                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">
                  {details?.release_date?.split('-')[0] || details?.first_air_date?.split('-')[0]} // {details?.runtime || details?.number_of_seasons} units
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
                {details?.title || details?.name}<span className="text-red-600">.</span>
              </h1>
              
              <p className="text-gray-400 leading-relaxed max-w-4xl text-sm md:text-lg font-medium">
                {details?.overview}
              </p>

              {/* ACTIONS */}
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
            </motion.div>
          </div>

          {/* RIGHT: NAVIGATION HUB (The Sidebar) */}
          {isSeries && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="xl:col-span-1"
            >
              <div className="glass rounded-[32px] md:rounded-[40px] p-6 md:p-8 border border-white/10 h-auto xl:h-[80vh] flex flex-col bg-black/20 backdrop-blur-3xl sticky top-28">
                <h3 className="text-[9px] tracking-[0.5em] uppercase font-black text-gray-500 mb-8 flex items-center gap-4">
                  Navigation Hub <div className="h-[1px] flex-1 bg-white/5" />
                </h3>
                
                <div className="space-y-8 overflow-y-auto no-scrollbar flex-1">
                  {/* Season Select */}
                  <div className="space-y-3">
                    <label className="text-[8px] uppercase tracking-[0.4em] text-gray-600 font-black ml-1 block">Protocol (Season)</label>
                    <div className="relative">
                      <select 
                        value={season}
                        onChange={(e) => { setSeason(e.target.value); setEpisode(1); }}
                        className="w-full bg-black/60 border border-white/10 p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none focus:border-red-600 appearance-none cursor-pointer"
                      >
                        {[...Array(details?.number_of_seasons)].map((_, i) => (
                          <option key={i+1} value={i+1} className="bg-brand-black">Season {i+1}</option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-red-600 text-[10px]">▼</div>
                    </div>
                  </div>

                  {/* Episode Select - Grid for Mobile / List for Desktop */}
                  <div className="space-y-3">
                    <label className="text-[8px] uppercase tracking-[0.4em] text-gray-600 font-black ml-1 block">Sequence (Episodes)</label>
                    <div className="grid grid-cols-4 xl:grid-cols-1 gap-2 pr-1 custom-scrollbar overflow-y-auto max-h-[40vh] xl:max-h-full">
                      {episodesList.map((ep) => (
                        <button 
                          key={ep.id}
                          onClick={() => setEpisode(ep.episode_number)}
                          className={`p-4 rounded-xl border text-[10px] font-black transition-all flex items-center justify-center xl:justify-start ${episode === ep.episode_number ? 'border-red-600 bg-red-600/20 text-white shadow-[0_0_20px_rgba(220,38,38,0.2)]' : 'border-white/5 bg-white/5 text-gray-500 hover:text-white'}`}
                        >
                          <span className={`${episode === ep.episode_number ? 'text-red-600' : 'text-gray-700'} xl:mr-4 font-black`}>
                            {ep.episode_number.toString().padStart(2, '0')}
                          </span>
                          <span className="hidden xl:inline truncate opacity-80">{ep.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
};

export default WatchPage;