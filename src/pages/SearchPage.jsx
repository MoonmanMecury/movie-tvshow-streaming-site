import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import tmdb, { getImagePath } from '../services/tmdb';
import Nav from '../components/Nav';
import { motion } from 'framer-motion';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const query = searchParams.get('q');

  useEffect(() => {
    if (!query) return;
    
    setLoading(true);
    const fetchSearch = async () => {
      try {
        const { data } = await tmdb.get(`/search/multi?query=${encodeURIComponent(query)}`);
        // Filter to keep only items with posters
        const validResults = data.results.filter(item => item.poster_path);
        setResults(validResults);
      } catch (error) {
        console.error("Search failure:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [query]);

  return (
    <div className="bg-[#050000] min-h-screen text-white selection:bg-red-600">
      <Nav />
      
      {/* ATMOSPHERIC BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-red-600/5 blur-[120px] rounded-full opacity-50" />
      </div>

      <main className="relative z-10 pt-32 px-6 md:px-16 pb-20 max-w-[1600px] mx-auto">
        
        {/* Header Section */}
        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-red-600 text-[10px] tracking-[0.5em] uppercase font-black mb-4 flex items-center gap-4">
              Search Discovery <div className="h-[1px] w-12 bg-red-600/30" />
            </p>
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
              Identified <span className="text-gray-500">"{query}"</span>
            </h1>
          </motion.div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 space-y-6">
            <div className="w-12 h-[2px] bg-red-600 animate-pulse" />
            <p className="text-[9px] tracking-[0.4em] text-gray-600 uppercase font-black animate-pulse">Scanning Archives...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-12">
            {results.map((item, index) => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/watch/${item.media_type || 'movie'}/${item.id}`)}
                className="group relative cursor-pointer"
              >
                {/* Poster Wrapper */}
                <div className="relative overflow-hidden rounded-[24px] border border-white/5 bg-white/5 shadow-2xl transition-all duration-500 group-hover:border-red-600/40">
                  <img
                    src={getImagePath(item.poster_path)}
                    alt={item.title || item.name}
                    className="w-full aspect-[2/3] object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <button className="bg-white text-black text-[9px] font-black uppercase py-3 rounded-xl tracking-[0.2em] w-full transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-2xl">
                      Stream Signal
                    </button>
                  </div>
                </div>

                {/* Metadata */}
                <div className="mt-5 px-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[8px] font-black text-red-600 uppercase tracking-widest border border-red-600/20 px-2 py-0.5 rounded">
                      {item.media_type === 'tv' ? 'Series' : 'Feature'}
                    </span>
                    <span className="text-[9px] text-gray-700 font-bold uppercase tracking-widest">
                      {new Date(item.release_date || item.first_air_date).getFullYear() || 'N/A'}
                    </span>
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-wider truncate text-gray-400 group-hover:text-white transition-colors">
                    {item.title || item.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 bg-white/[0.02] rounded-[40px] border border-dashed border-white/10">
            <h2 className="text-xl font-black uppercase tracking-[0.4em] text-gray-700">No Titles Found</h2>
            <p className="text-gray-800 text-[10px] uppercase font-bold mt-4 tracking-widest">Protocol failed to match query</p>
            <button 
              onClick={() => navigate('/browse')}
              className="mt-10 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-white text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:border-red-600 transition-all"
            >
              Return to Base
            </button>
          </div>
        )}
      </main>

      <footer className="py-20 text-center opacity-20">
        <p className="text-[8px] text-gray-500 font-black uppercase tracking-[0.8em]">End of Transmission</p>
      </footer>
    </div>
  );
};

export default SearchPage;