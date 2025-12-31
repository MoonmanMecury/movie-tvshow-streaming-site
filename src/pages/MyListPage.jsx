import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthProvider';
import { getImagePath } from '../services/tmdb';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from '../components/Nav';

const MyList = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetchFavorites = async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) setFavorites(data);
      setLoading(false);
    };
    fetchFavorites();
  }, [user]);

  const removeFavorite = async (e, movieId) => {
    e.stopPropagation();
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('movie_id', movieId)
      .eq('user_id', user.id);

    if (!error) {
      setFavorites(favorites.filter(fav => fav.movie_id !== movieId));
    }
  };

  // UPDATED: Navigation logic for the Watcher
  const handleWatch = (movie) => {
    // Determine type: explicitly check media_type, then fallback to property sniffing
    const type = movie.media_type || (movie.first_air_date ? 'tv' : 'movie');
    navigate(`/watch/${type}/${movie.id}`);
  };

  return (
    <div className="min-h-screen bg-[#050000] text-white relative overflow-hidden">
      <Nav />

      {/* 1. DREAMY BACKGROUND GLOWS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[70vw] h-[50vh] bg-red-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[50vh] bg-red-600/5 blur-[150px] rounded-full" />
      </div>

      <main className="relative z-10 pt-28 md:pt-40 px-6 md:px-16 pb-20 max-w-[1600px] mx-auto">
        
        <header className="mb-12 md:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
              The <span className="text-red-600 shadow-red-600/20" style={{ textShadow: '0 0 20px rgba(220, 38, 38, 0.4)' }}>Vault</span>
            </h1>
            <div className="flex items-center gap-4 mt-4">
               <div className="h-[1px] w-12 bg-red-600/50" />
               <p className="text-[9px] md:text-[10px] text-gray-500 font-black uppercase tracking-[0.4em]">
                 {favorites.length} Encrypted Titles Secured
               </p>
            </div>
          </motion.div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center pt-20 gap-4">
            <div className="w-12 h-[2px] bg-red-600 animate-pulse" />
            <p className="text-[8px] uppercase tracking-widest text-gray-600 animate-pulse">Decrypting Access...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-8">
            <AnimatePresence mode='popLayout'>
              {favorites.map((fav, index) => {
                const movie = fav.movie_data;
                return (
                  <motion.div
                    key={fav.movie_id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ delay: index * 0.05 }}
                    className="relative group cursor-pointer"
                    onClick={() => handleWatch(movie)}
                  >
                    <div className="relative overflow-hidden rounded-xl md:rounded-2xl border border-white/5 bg-white/5 shadow-2xl transition-all duration-500 group-hover:border-red-600/30">
                      <img
                        src={getImagePath(movie.poster_path)}
                        alt={movie.title}
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <button
                        onClick={(e) => removeFavorite(e, fav.movie_id)}
                        className="absolute top-2 right-2 md:top-4 md:right-4 w-8 h-8 md:w-10 md:h-10 bg-black/60 backdrop-blur-md text-white rounded-full flex items-center justify-center border border-white/10 hover:bg-red-600 transition-all active:scale-90 z-30"
                      >
                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-4 px-1">
                      <p className="text-[10px] font-black uppercase truncate tracking-widest text-gray-500 group-hover:text-red-600 transition-colors">
                        {movie.title || movie.name}
                      </p>
                      <p className="text-[7px] text-gray-700 font-bold uppercase tracking-[0.2em] mt-1">
                        {movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0]} // 4K HDR
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {!loading && favorites.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-40 text-center"
          >
            <div className="w-16 h-[1px] bg-white/10 mb-8" />
            <p className="text-gray-600 font-black uppercase tracking-[0.6em] text-[10px]">The Vault is Empty</p>
            <button 
              onClick={() => navigate('/browse')}
              className="mt-8 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-white font-black uppercase tracking-widest text-[9px] hover:bg-red-600 transition-all"
            >
              Acquire Content
            </button>
          </motion.div>
        )}
      </main>

      <footer className="mt-20 py-10 text-center opacity-20">
         <p className="text-[8px] font-black uppercase tracking-[0.5em]">Noir Archive Protocol</p>
      </footer>
    </div>
  );
};

export default MyList;