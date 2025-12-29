import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthProvider';
import { getImagePath } from '../services/tmdb';
import Nav from '../components/Nav';

const MyListPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetchFavorites = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('favorites').select('*').eq('user_id', user.id);
      if (!error) setFavorites(data || []);
      setLoading(false);
    };
    fetchFavorites();
  }, [user]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.6 }}
      className="bg-brand-black min-h-screen text-white relative overflow-x-hidden font-sans"
    >
      <Nav />
      <main className="relative z-10 pt-32 px-6 md:px-12 pb-20 max-w-[1600px] mx-auto">
        <header className="mb-16">
          <p className="text-brand-red text-[10px] tracking-[0.6em] uppercase font-black mb-2">Personal Collection</p>
          <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase">The Vault</h1>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <AnimatePresence>
            {favorites.map((fav) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                key={fav.id}
                onClick={() => navigate(`/watch/${fav.movie_data.first_air_date ? 'tv' : 'movie'}/${fav.movie_data.id}`)}
                className="group relative cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl border border-white/5 transition-all group-hover:scale-105">
                  <img src={getImagePath(fav.movie_data.poster_path)} className="w-full aspect-[2/3] object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <span className="text-[10px] font-black uppercase tracking-widest">Enter Archive</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </motion.div>
  );
};

export default MyListPage;