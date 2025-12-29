import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import tmdb, { getImagePath } from '../services/tmdb';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthProvider';

const Row = ({ title, fetchUrl }) => {
  const [movies, setMovies] = useState([]);
  const [showArrows, setShowArrows] = useState(false);
  const [myListIds, setMyListIds] = useState(new Set()); // To track saved movies efficiently
  const rowRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // 1. Fetch Movie Data
  useEffect(() => {
    async function fetchData() {
      const request = await tmdb.get(fetchUrl);
      setMovies(request.data.results);
    }
    fetchData();
  }, [fetchUrl]);

  // 2. Sync "My List" status for this row
  useEffect(() => {
    if (!user) return;
    const fetchMyListStatus = async () => {
      const { data } = await supabase
        .from('favorites')
        .select('movie_id')
        .eq('user_id', user.id);
      
      if (data) {
        setMyListIds(new Set(data.map(item => item.movie_id)));
      }
    };
    fetchMyListStatus();
  }, [user]);

  const slide = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.8 
        : scrollLeft + clientWidth * 0.8;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleWatch = (movie) => {
    const type = movie.media_type || (movie.first_air_date ? 'tv' : 'movie');
    navigate(`/watch/${type}/${movie.id}`);
  };

  const toggleMyList = async (e, movie) => {
    e.stopPropagation();
    if (!user) return alert("Sign in to save titles!");

    const isCurrentlySaved = myListIds.has(movie.id);

    if (isCurrentlySaved) {
      // REMOVE logic
      const { error } = await supabase.from('favorites').delete().eq('movie_id', movie.id).eq('user_id', user.id);
      if (!error) {
        const updatedSet = new Set(myListIds);
        updatedSet.delete(movie.id);
        setMyListIds(updatedSet);
      }
    } else {
      // ADD logic
      const { error } = await supabase.from('favorites').insert([
        { user_id: user.id, movie_id: movie.id, movie_data: movie }
      ]);
      if (!error) {
        setMyListIds(new Set([...myListIds, movie.id]));
      }
    }
  };

  return (
    <div 
      className="ml-8 mb-10 text-white relative group"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <h2 className="text-sm uppercase tracking-[0.4em] text-gray-500 font-black mb-6 italic">{title}</h2>

      {/* Navigation Arrows */}
      <button onClick={() => slide('left')} className={`absolute left-0 top-[140px] z-[60] h-32 w-12 glass flex items-center justify-center rounded-r-xl transition-all duration-300 ${showArrows ? "opacity-100" : "opacity-0 -translate-x-full"}`}>‹</button>
      <button onClick={() => slide('right')} className={`absolute right-8 top-[140px] z-[60] h-32 w-12 glass flex items-center justify-center rounded-l-xl transition-all duration-300 ${showArrows ? "opacity-100" : "opacity-0 translate-x-full"}`}>›</button>

      {/* Row Container */}
      <div ref={rowRef} className="flex overflow-x-scroll py-6 no-scrollbar gap-4 scroll-smooth">
        {movies.map((movie) => {
          const isSaved = myListIds.has(movie.id);
          
          return (
            <div 
              key={movie.id} 
              className="relative flex-none transition-all duration-700 hover:scale-110 hover:z-50 group/item"
            >
              <img
                className="rounded-xl cursor-pointer object-cover shadow-2xl transition-all duration-300 h-80 w-56 brightness-75 group-hover/item:brightness-100 border border-white/5"
                src={getImagePath(movie.poster_path)}
                alt={movie.name}
              />

              {/* ACTION OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-all duration-300 rounded-xl flex flex-col justify-end p-4">
                <div className="flex flex-col gap-2 transform translate-y-4 group-hover/item:translate-y-0 transition-transform duration-500">
                  
                  {/* Play Button */}
                  <button 
                    onClick={() => handleWatch(movie)}
                    className="bg-white text-black py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-brand-red hover:text-white transition-all shadow-xl active:scale-95"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    <span className="text-[9px] font-black uppercase tracking-widest">Watch Now</span>
                  </button>

                  {/* Toggle Button (Save/Remove) */}
                  <button 
                    onClick={(e) => toggleMyList(e, movie)}
                    className={`glass text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${isSaved ? 'bg-brand-red/40 border-brand-red' : 'hover:bg-white/20 border-white/10'}`}
                  >
                    {isSaved ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-[9px] font-black uppercase tracking-widest text-brand-red">Saved</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-[9px] font-black uppercase tracking-widest">Vault</span>
                      </>
                    )}
                  </button>

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Row;