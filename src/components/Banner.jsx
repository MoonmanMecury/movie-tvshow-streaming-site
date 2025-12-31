import { useState, useEffect } from 'react';
import tmdb, { getImagePath } from '../services/tmdb';
import requests from '../services/requests';

const Banner = () => {
  const [movies, setMovies] = useState([]); // Store the whole list
  const [currentMovie, setCurrentMovie] = useState(null); // The one currently on screen
  const [index, setIndex] = useState(0);

  // 1. Fetch the data once
  useEffect(() => {
    async function fetchData() {
      try {
        const request = await tmdb.get(requests.fetchNetflixOriginals);
        const results = request.data.results;
        setMovies(results);
        setCurrentMovie(results[0]); // Set initial movie
      } catch (error) {
        console.error("Banner Fetch Error:", error);
      }
    }
    fetchData();
  }, []);

  // 2. THE AUTO-SCROLL LOGIC
  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prevIndex) => {
        const nextIndex = prevIndex + 1 >= movies.length ? 0 : prevIndex + 1;
        setCurrentMovie(movies[nextIndex]);
        return nextIndex;
      });
    }, 8000); // Cycles every 8 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [movies]);

  if (!currentMovie) return <div className="h-[55vh] bg-brand-black" />;

  return (
    <header 
      className="relative text-white overflow-hidden transition-all duration-1000 ease-in-out"
      style={{
        backgroundSize: "cover",
        backgroundImage: `url(${getImagePath(currentMovie?.backdrop_path)})`,
        backgroundPosition: "center center",
        height: "55vh", 
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 768px) {
          header { height: 85vh !important; }
        }
      `}} />

      {/* Noir Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent z-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-black/90 to-transparent z-0" />

      {/* Content Container: Lifted using justify-end + pb-24 */}
      <div className="relative z-10 pt-20 pb-24 md:pb-36 px-6 md:px-12 h-full flex flex-col justify-end max-w-4xl">
        
        <h1 className="text-3xl md:text-6xl font-black italic tracking-tighter uppercase leading-none mb-3 drop-shadow-2xl">
          {currentMovie?.title || currentMovie?.name || currentMovie?.original_name}
        </h1>

        <p className="text-[10px] md:text-lg text-gray-300 font-medium max-w-[220px] md:max-w-xl line-clamp-2 drop-shadow-lg mb-4">
          {currentMovie?.overview}
        </p>

        <div className="flex gap-3">
          <button className="bg-white text-black px-5 py-2 md:px-10 md:py-3 rounded-full text-[9px] md:text-xs font-black uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all shadow-xl active:scale-95">
            Play
          </button>
          <button className="bg-white/10 backdrop-blur-md border border-white/10 text-white px-5 py-2 md:px-10 md:py-3 rounded-full text-[9px] md:text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all active:scale-95">
            Vault
          </button>
        </div>
      </div>
    </header>
  );
};

export default Banner;