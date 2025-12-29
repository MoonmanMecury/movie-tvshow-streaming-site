import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import tmdb, { getImagePath } from '../services/tmdb';
import Nav from '../components/Nav';

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
        // Filter to keep only items with posters (removes low-quality results/profiles)
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
    <div className="bg-brand-black min-h-screen text-white">
      <Nav />
      
      <main className="pt-32 px-6 md:px-12 pb-20 max-w-[1600px] mx-auto">
        {/* Header Section */}
        <header className="mb-12 animate-fade-in">
          <p className="text-brand-red text-[10px] tracking-[0.5em] uppercase font-black mb-2">
            Search Discovery
          </p>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase">
            Showing Results For <span className="text-gray-500">"{query}"</span>
          </h1>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="w-12 h-12 border-t-2 border-brand-red rounded-full animate-spin"></div>
            <p className="text-[10px] tracking-widest text-gray-500 uppercase font-bold">Scanning Archives...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-12">
            {results.map((item, index) => (
              <div 
                key={item.id} 
                onClick={() => navigate(`/watch/${item.media_type || 'movie'}/${item.id}`)}
                className="group relative cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Poster Wrapper with Glass Effect */}
                <div className="relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_40px_rgba(255,62,62,0.2)]">
                  <img
                    src={getImagePath(item.poster_path)}
                    alt={item.title || item.name}
                    className="w-full aspect-[2/3] object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <button className="bg-white text-black text-[8px] font-black uppercase py-2 rounded-full tracking-[0.2em] w-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      View Details
                    </button>
                  </div>
                </div>

                {/* Metadata */}
                <div className="mt-4 px-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-black text-brand-red uppercase tracking-widest">
                      {item.media_type === 'tv' ? 'Series' : 'Feature'}
                    </span>
                    <span className="text-[9px] text-gray-500 font-bold">
                      {new Date(item.release_date || item.first_air_date).getFullYear() || 'N/A'}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider truncate text-gray-200 group-hover:text-white transition-colors">
                    {item.title || item.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 glass rounded-3xl border-dashed border-white/10">
            <svg className="w-16 h-16 text-gray-700 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 className="text-xl font-bold uppercase tracking-widest text-gray-400">No Titles Found</h2>
            <p className="text-gray-600 text-xs mt-2 italic">Try checking for typos or use more general keywords.</p>
            <button 
              onClick={() => navigate('/browse')}
              className="mt-8 text-[10px] text-brand-red font-black uppercase tracking-[0.3em] hover:text-white transition-colors"
            >
              Return to Browse
            </button>
          </div>
        )}
      </main>

      <footer className="py-20 text-center">
        <div className="h-[1px] w-20 bg-brand-red mx-auto mb-8 opacity-30"></div>
        <p className="text-[9px] text-gray-700 uppercase tracking-[0.6em]">End of Results</p>
      </footer>
    </div>
  );
};

export default SearchPage;