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

  // 2. Fetch Episodes
  useEffect(() => {
    if (type === 'tv') {
      async function fetchSeasonData() {
        try {
          const { data } = await tmdb.get(`/tv/${id}/season/${season}`);
          setEpisodesList(data.episodes);
        } catch (e) {
          console.error("Season access denied");
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
      className="bg-brand-black min-h-screen text-white relative overflow-x-hidden"
    >
      {/* Ambient Backdrop */}
      <div className="fixed inset-0 z-0 opacity-20 blur-[120px] scale-125 pointer-events-none"
        style={{ backgroundImage: `url(${getImagePath(details?.poster_path)})`, backgroundSize: 'cover' }} />
      
      <Nav />

      {/* Main Container - Changed pt-24 to pt-16 for mobile to save space */}
      <main className="relative z-10 pt-16 md:pt-24 px-4 md:px-16 max-w-[1800px] mx-auto pb-20">
        
        {/* Responsive Grid: Column on Mobile, 4-cols on Desktop */}
        <div className="flex flex-col xl:grid xl:grid-cols-4 gap-6 md:gap-12">
          
          {/* PLAYER & INFO AREA */}
          <div className="xl:col-span-3 space-y-6 md:space-y-8">
            {/* Aspect Ratio Box - Ensures Video is never cut off */}
            <div className="glass rounded-2xl md:rounded-[40px] overflow-hidden shadow-2xl aspect-video border border-white/5 bg-black/40">
              <iframe src={streamUrl} className="w-full h-full" allowFullScreen title="Noir Player" />
            </div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-3 md:space-y-4 px-2 md:px-0">
              <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-tight md:leading-none">
                {details?.title || details?.name}
              </h1>
              <div className="flex flex-wrap gap-4 md:gap-6 text-[9px] md:text-[10px] font-black text-brand-red tracking-[0.2em] md:tracking-[0.3em] uppercase">
                <span>{details?.release_date?.split('-')[0] || details?.first_air_date?.split('-')[0]}</span>
                <span>{type === 'movie' ? `${details?.runtime}m` : `${details?.number_of_seasons} Seasons`}</span>
                <span className="text-white/40">HD • 4K</span>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-4xl text-sm md:text-lg line-clamp-3 md:line-clamp-none">
                {details?.overview}
              </p>
            </motion.div>
          </div>

          {/* HUB SIDEBAR - Moves below player on mobile */}
          <div className="glass rounded-3xl md:rounded-[40px] p-6 md:p-8 border border-white/5 h-auto xl:h-[80vh] flex flex-col bg-black/20 backdrop-blur-3xl">
            <h3 className="text-[9px] tracking-[0.5em] uppercase font-black text-gray-500 mb-6">Navigation Hub</h3>
            
            <div className="space-y-4 overflow-y-auto no-scrollbar flex-1">
              {/* Feature/Trailer Toggles (Horizontal on Mobile) */}
              <div className="grid grid-cols-2 xl:grid-cols-1 gap-3">
                <button 
                  onClick={() => setIsPlayingTrailer(true)}
                  className={`p-4 md:p-5 rounded-2xl transition-all border text-left ${isPlayingTrailer ? 'bg-brand-red border-transparent shadow-lg' : 'bg-white/5 border-white/10'}`}
                >
                  <p className="text-[9px] uppercase font-black tracking-widest leading-none">Trailer</p>
                  <p className="text-[7px] opacity-50 mt-1 hidden md:block">Direct Access</p>
                </button>

                {type === 'movie' && (
                  <button 
                    onClick={() => setIsPlayingTrailer(false)}
                    className={`p-4 md:p-5 rounded-2xl transition-all border text-left ${!isPlayingTrailer ? 'bg-brand-red border-transparent shadow-lg' : 'bg-white/5 border-white/10'}`}
                  >
                    <p className="text-[9px] uppercase font-black tracking-widest leading-none">Movie</p>
                    <p className="text-[7px] opacity-50 mt-1 hidden md:block">4K Stream</p>
                  </button>
                )}
              </div>

              {type === 'tv' && (
                <div className="space-y-6">
                  <div className="h-[1px] bg-white/10 my-4" />
                  
                  {/* Season Select */}
                  <div className="space-y-2">
                    <label className="text-[8px] uppercase tracking-widest text-gray-600 font-black ml-1">Season</label>
                    <select 
                      value={season}
                      onChange={(e) => { setSeason(e.target.value); setEpisode(1); setIsPlayingTrailer(false); }}
                      className="w-full bg-white/10 border border-white/10 p-3 md:p-4 rounded-xl md:rounded-2xl outline-none text-[10px] font-black uppercase tracking-widest appearance-none"
                    >
                      {[...Array(details?.number_of_seasons)].map((_, i) => (
                        <option key={i+1} value={i+1} className="bg-brand-black">Season {i+1}</option>
                      ))}
                    </select>
                  </div>

                  {/* Episodes - Now a Grid on mobile for better thumb reach */}
                  <div className="space-y-2">
                    <label className="text-[8px] uppercase tracking-widest text-gray-600 font-black ml-1">Episodes</label>
                    <div className="grid grid-cols-4 xl:grid-cols-1 gap-2">
                      <AnimatePresence mode="popLayout">
                        {episodesList.map((ep) => (
                          <motion.button 
                            layout
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            key={ep.id}
                            onClick={() => { setEpisode(ep.episode_number); setIsPlayingTrailer(false); }}
                            className={`p-3 md:p-4 rounded-xl border text-[10px] font-black transition-all flex items-center justify-center xl:justify-start ${!isPlayingTrailer && episode === ep.episode_number ? 'border-brand-red bg-brand-red/20 text-white' : 'border-white/5 bg-white/5 text-gray-400'}`}
                          >
                            <span className="xl:mr-2">
                               {ep.episode_number < 10 ? `0${ep.episode_number}` : ep.episode_number}
                            </span>
                            <span className="hidden xl:inline truncate">{ep.name}</span>
                          </motion.button>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </motion.div>
  );
};

export default PlayerPage;