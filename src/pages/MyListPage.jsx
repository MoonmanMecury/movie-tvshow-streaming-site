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

  // 1. Fetch Favorites from Supabase
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

  // 2. Remove from Favorites Logic
  const removeFavorite = async (e, movieId) => {
    e.stopPropagation(); // Prevent navigating to the player
    
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('movie_id', movieId)
      .eq('user_id', user.id);

    if (!error) {
      // Smoothly remove from local state
      setFavorites(favorites.filter(fav => fav.movie_id !== movieId));
    }
  };

  const handleWatch = (movie) => {
    const type = movie.media_type || (movie.first_air_date ? 'tv' : 'movie');
    navigate(`/watch/${type}/${movie.id}`);
  };

  return (
    <div className="min-h-screen bg-brand-black text-white">
      <Nav />

      <main className="pt-24 md:pt-32 px-4 md:px-12 pb-20">
        <header className="mb-10 md:mb-16">
          <h1 className="text-3xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
            The <span className="text-brand-red">Vault</span>
          </h1>
          <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-[0.4em] mt-2">
            {favorites.length} Encrypted Titles Secured
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center pt-20">
            <div className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          /* RESPONSIVE GRID: 3 columns on mobile, matching the Row look */
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-6">
            <AnimatePresence>
              {favorites.map((fav) => {
                const movie = fav.movie_data;
                return (
                  <motion.div
                    key={fav.movie_id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    className="relative group cursor-pointer"
                    onClick={() => handleWatch(movie)}
                  >
                    {/* Poster Image */}
                    <img
                      src={getImagePath(movie.poster_path)}
                      alt={movie.title}
                      className="rounded-lg md:rounded-2xl w-full h-auto object-cover border border-white/5 shadow-2xl transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Remove Button (Visible always on mobile, hover on desktop) */}
                    <button
                      onClick={(e) => removeFavorite(e, fav.movie_id)}
                      className="absolute -top-2 -right-2 w-8 h-8 md:w-10 md:h-10 bg-brand-red text-white rounded-full flex items-center justify-center shadow-xl z-30 border-2 border-brand-black active:scale-75 transition-transform"
                      title="Remove from Vault"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    {/* Bottom Label (Desktop only for clean mobile look) */}
                    <div className="hidden md:block mt-3">
                      <p className="text-[10px] font-black uppercase truncate tracking-widest text-gray-400 group-hover:text-white transition-colors">
                        {movie.title || movie.name}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {!loading && favorites.length === 0 && (
          <div className="text-center py-40">
            <p className="text-gray-600 font-black uppercase tracking-[0.5em] text-xs">The Vault is Empty</p>
            <button 
              onClick={() => navigate('/browse')}
              className="mt-6 text-brand-red font-black uppercase tracking-widest text-[10px] hover:underline"
            >
              Go Acquire Content
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyList;