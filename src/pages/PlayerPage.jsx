import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import tmdb, { getImagePath } from '../services/tmdb';
import Nav from '../components/Nav';

const PlayerPage = () => {
  const { type, id } = useParams();
  const [details, setDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [episodesList, setEpisodesList] = useState([]);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(true);

  // 1. Fetch Main Metadata
  useEffect(() => {
    async function fetchMainData() {
      const { data } = await tmdb.get(`/${type}/${id}?append_to_response=videos`);
      setDetails(data);
      const trailer = data.videos?.results.find(v => v.type === "Trailer") || data.videos?.results[0];
      setTrailerKey(trailer?.key);
    }
    fetchMainData();
  }, [type, id]);

  // 2. Fetch Episodes (Triggered by Season Selection)
  useEffect(() => {
    if (type === 'tv') {
      async function fetchSeasonData() {
        try {
          const { data } = await tmdb.get(`/tv/${id}/season/${season}`);
          setEpisodesList(data.episodes);
        } catch (e) {
          console.error("Season access denied or not found");
        }
      }
      fetchSeasonData();
    }
  }, [id, season, type]);

  const streamUrl = isPlayingTrailer 
    ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`
    : type === 'tv' 
      ? `https://vidsrc.to/embed/tv/${id}/${season}/${episode}` 
      : `https://vidsrc.to/embed/movie/${id}`;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="bg-brand-black min-h-screen text-white relative overflow-hidden"
    >
      {/* Dynamic Ambient Blur */}
      <div className="fixed inset-0 z-0 opacity-30 blur-[120px] scale-125 pointer-events-none"
        style={{ backgroundImage: `url(${getImagePath(details?.poster_path)})`, backgroundSize: 'cover' }} />
      
      <Nav />

      <main className="relative z-10 pt-24 px-6 lg:px-16 max-w-[1800px] mx-auto pb-20">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
          
          {/* PLAYER & INFO */}
          <div className="xl:col-span-3 space-y-8">
            <div className="glass rounded-[40px] overflow-hidden shadow-2xl aspect-video border border-white/5 bg-black/40">
              <iframe src={streamUrl} className="w-full h-full" allowFullScreen title="Noir Player" />
            </div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-4">
              <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
                {details?.title || details?.name}
              </h1>
              <div className="flex gap-6 text-[10px] font-black text-brand-red tracking-[0.3em] uppercase">
                <span>{details?.release_date?.split('-')[0] || details?.first_air_date?.split('-')[0]}</span>
                <span>{type === 'movie' ? `${details?.runtime}m` : `${details?.number_of_seasons} Seasons`}</span>
                <span className="text-white/40">HD • 4K • 7.1</span>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-4xl text-lg">{details?.overview}</p>
            </motion.div>
          </div>

          {/* SIDEBAR: NAVIGATION & SELECTION */}
          <div className="glass rounded-[40px] p-8 border border-white/5 h-[80vh] flex flex-col bg-black/20 backdrop-blur-3xl">
            <h3 className="text-[9px] tracking-[0.5em] uppercase font-black text-gray-500 mb-8">Navigation Hub</h3>
            
            <div className="space-y-4 overflow-y-auto no-scrollbar flex-1">
              {/* Trailer Toggle */}
              <button 
                onClick={() => setIsPlayingTrailer(true)}
                className={`w-full text-left p-5 rounded-2xl transition-all border ${isPlayingTrailer ? 'bg-brand-red border-transparent shadow-[0_0_30px_rgba(255,0,0,0.2)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
              >
                <p className="text-[10px] uppercase font-black tracking-widest">Official Trailer</p>
                <p className="text-[8px] opacity-50 mt-1">Direct from the Archives</p>
              </button>

              <div className="h-[1px] bg-white/10 my-6" />

              {type === 'tv' && (
                <div className="space-y-6">
                  {/* THE SEASON SELECTOR (RESTORED) */}
                  <div className="space-y-2">
                    <label className="text-[8px] uppercase tracking-widest text-gray-600 font-black ml-1">Select Season</label>
                    <select 
                      value={season}
                      onChange={(e) => { setSeason(e.target.value); setEpisode(1); setIsPlayingTrailer(false); }}
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none text-[10px] font-black tracking-widest uppercase cursor-pointer focus:border-brand-red transition-colors appearance-none"
                    >
                      {[...Array(details?.number_of_seasons)].map((_, i) => (
                        <option key={i+1} value={i+1} className="bg-brand-black">Season {i+1}</option>
                      ))}
                    </select>
                  </div>

                  {/* EPISODE LIST WITH ANIMATION */}
                  <div className="space-y-2">
                    <label className="text-[8px] uppercase tracking-widest text-gray-600 font-black ml-1">Select Episode</label>
                    <div className="space-y-2">
                      <AnimatePresence mode="popLayout">
                        {episodesList.map((ep) => (
                          <motion.button 
                            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                            key={ep.id}
                            onClick={() => { setEpisode(ep.episode_number); setIsPlayingTrailer(false); }}
                            className={`w-full text-left p-4 rounded-2xl transition-all border text-[10px] font-black tracking-tighter ${!isPlayingTrailer && episode === ep.episode_number ? 'border-brand-red bg-brand-red/10 text-white' : 'border-white/5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                          >
                            <span className="text-brand-red/60 mr-2 italic">EP{ep.episode_number}</span>
                            {ep.name}
                          </motion.button>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              )}

              {type === 'movie' && (
                <button 
                  onClick={() => setIsPlayingTrailer(false)}
                  className={`w-full text-left p-5 rounded-2xl transition-all border ${!isPlayingTrailer ? 'bg-brand-red border-transparent shadow-[0_0_30px_rgba(255,0,0,0.2)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                >
                  <p className="text-[10px] uppercase font-black tracking-widest">Full Feature</p>
                  <p className="text-[8px] opacity-50 mt-1">4K High Fidelity</p>
                </button>
              )}
            </div>
          </div>

        </div>
      </main>
    </motion.div>
  );
};

export default PlayerPage;