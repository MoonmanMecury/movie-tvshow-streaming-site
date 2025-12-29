import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import tmdb, { getImagePath } from '../services/tmdb';
import requests from '../services/requests';

const Banner = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const request = await tmdb.get(requests.fetchNetflixOriginals);
      setMovies(request.data.results);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (movies.length === 0 || isHovered) {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 8000);
    return () => clearInterval(timerRef.current);
  }, [movies, isHovered]);

  const movie = movies[currentIndex];
  const truncate = (string, n) => string?.length > n ? string.substr(0, n - 1) + "..." : string;

  if (!movie) return <div className="h-[85vh] bg-brand-black" />;

  return (
    <header
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative h-[90vh] text-white overflow-hidden transition-all duration-1000 ease-in-out"
      style={{
        backgroundSize: "cover",
        backgroundImage: `url("${getImagePath(movie?.backdrop_path)}")`,
        backgroundPosition: "center 10%", // Shift image up slightly
      }}
    >
      {/* Cinematic Vignette Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/20 to-transparent opacity-90" />
      
      {/* Deepened bottom gradient to blend perfectly with Rows */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-100" />
      
      {/* Content Container - Raised and strictly positioned */}
      <div className="relative z-10 pt-28 ml-8 md:ml-16 h-full flex flex-col justify-start max-w-2xl animate-fade-in">
        <div className="glass w-fit px-4 py-1 rounded-full mb-4 shadow-xl border-white/5">
          <span className="text-[9px] tracking-[0.5em] uppercase font-black text-brand-red">
            Now Trending
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.9] drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>

        <div className="flex gap-4 mt-6">
          <button 
            onClick={() => navigate(`/watch/${movie.media_type || 'tv'}/${movie.id}`)}
            className="bg-white text-black px-10 py-3.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-red hover:text-white transition-all shadow-2xl active:scale-95"
          >
            Stream Now
          </button>
          <button className="glass px-10 py-3.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-black hover:bg-white/10 transition-all active:scale-95">
             Details
          </button>
        </div>

        <p className="mt-6 text-gray-300 text-sm md:text-base leading-relaxed font-medium drop-shadow-lg max-w-lg">
          {truncate(movie?.overview, 160)}
        </p>

        {/* Progress Indicator Dots */}
        <div className="mt-8 flex gap-2">
          {movies.slice(0, 5).map((_, idx) => (
            <div 
              key={idx}
              className={`h-1 rounded-full transition-all duration-500 ${
                idx === currentIndex % 5 ? "w-10 bg-brand-red shadow-[0_0_10px_#ff3e3e]" : "w-2 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </header>
  );
};

export default Banner;
