import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import tmdb, { getImagePath } from '../services/tmdb';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthProvider';

const Row = ({ title, fetchUrl }) => {
  const [movies, setMovies] = useState([]);
  const [showArrows, setShowArrows] = useState(false);
  const [myListIds, setMyListIds] = useState(new Set());
  const rowRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        const request = await tmdb.get(fetchUrl);
        setMovies(request.data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }
    fetchData();
  }, [fetchUrl]);

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
      const { error } = await supabase.from('favorites').delete().eq('movie_id', movie.id).eq('user_id', user.id);
      if (!error) {
        const updatedSet = new Set(myListIds);
        updatedSet.delete(movie.id);
        setMyListIds(updatedSet);
      }
    } else {
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
      className="ml-4 md:ml-8 mb-6 md:mb-10 text-white relative z-10 group"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <h2 className="text-[10px] md:text-sm uppercase tracking-[0.4em] text-gray-400 font-black mb-2 md:mb-6 italic">
        {title}
      </h2>

      {/* Navigation Arrows (Desktop Only) */}
      <button 
        onClick={() => slide('left')} 
        className={`hidden md:flex absolute left-0 top-[140px] z-[60] h-32 w-12 glass items-center justify-center rounded-r-xl transition-all duration-300 ${showArrows ? "opacity-100" : "opacity-0 -translate-x-full"}`}
      >
        ‹
      </button>
      <button 
        onClick={() => slide('right')} 
        className={`hidden md:flex absolute right-8 top-[140px] z-[60] h-32 w-12 glass items-center justify-center rounded-l-xl transition-all duration-300 ${showArrows ? "opacity-100" : "opacity-0 translate-x-full"}`}
      >
        ›
      </button>

      {/* Row Container */}
      <div 
        ref={rowRef} 
        className="flex overflow-x-scroll py-2 md:py-4 no-scrollbar gap-2 md:gap-4 scroll-smooth"
      >
        {movies.map((movie) => {
          const isSaved = myListIds.has(movie.id);
          
          return (
            <div 
              key={movie.id} 
              className="relative flex-none transition-all duration-700 md:hover:scale-110 md:hover:z-50 group/item w-[31%] md:w-56"
            >
              <img
                className="rounded-lg md:rounded-xl cursor-pointer object-cover shadow-2xl transition-all duration-300 h-auto md:h-80 w-full brightness-90 md:brightness-75 md:group-hover/item:brightness-100 border border-white/5"
                src={getImagePath(movie.poster_path)}
                alt={movie?.title || movie?.name}
              />

              {/* ACTION OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-0 md:group-hover/item:opacity-100 transition-all duration-300 rounded-lg md:rounded-xl flex flex-col justify-end p-2 md:p-4">
                <div className="flex flex-col gap-1 md:gap-2 transform md:translate-y-4 md:group-hover/item:translate-y-0 transition-transform duration-500">
                  
                  <button 
                    onClick={() => handleWatch(movie)}
                    className="bg-white text-black py-2 md:py-3 rounded-md md:rounded-lg flex items-center justify-center gap-1 md:gap-2 hover:bg-brand-red hover:text-white transition-all shadow-xl active:scale-95"
                  >
                    <svg className="w-3 h-3 md:w-4 md:h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    <span className="text-[7px] md:text-[9px] font-black uppercase tracking-widest">Watch</span>
                  </button>

                  <button 
                    onClick={(e) => toggleMyList(e, movie)}
                    className={`glass text-white py-2 md:py-3 rounded-md md:rounded-lg flex items-center justify-center transition-all active:scale-95 ${isSaved ? 'bg-brand-red/40 border-brand-red' : 'hover:bg-white/20 border-white/10'}`}
                  >
                    {isSaved ? (
                      <svg className="w-3 h-3 md:w-4 md:h-4 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
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