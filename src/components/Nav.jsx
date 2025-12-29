import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';

const Nav = () => {
  const [show, handleShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const scrollHandler = () => handleShow(window.scrollY > 50);
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <nav className={`fixed top-0 w-full z-[100] px-6 md:px-12 py-4 flex justify-between items-center transition-all duration-700 ${
      show ? "glass py-3" : "bg-transparent"
    }`}>
      <div className="flex items-center gap-10">
        <h1 
          onClick={() => navigate('/browse')}
          className="text-brand-red text-2xl font-black tracking-tighter cursor-pointer hover:opacity-80 transition-opacity"
        >
          APRIL<span className="text-white">STREAM</span>
        </h1>
        <div className="hidden md:flex gap-8">
          {['Browse', 'My List'].map((item) => (
            <button
              key={item}
              onClick={() => navigate(item === 'Browse' ? '/browse' : '/my-list')}
              className={`text-xs uppercase tracking-[0.2em] transition-all hover:text-brand-red ${
                location.pathname.includes(item.toLowerCase().replace(' ', '-')) ? "text-brand-red font-bold" : "text-gray-400"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <form onSubmit={handleSearch} className="relative group">
          <input 
            type="text"
            placeholder="Search Titles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/5 border border-white/10 text-white text-xs py-2 pl-10 pr-4 w-48 focus:w-72 focus:bg-white/10 transition-all duration-500 rounded-full outline-none focus:border-brand-red"
          />
          <svg className="w-4 h-4 absolute left-4 top-2.5 text-gray-500 group-focus-within:text-brand-red transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </form>
        <button 
          onClick={() => signOut()}
          className="text-[10px] border border-white/20 hover:border-brand-red hover:text-brand-red px-4 py-2 rounded-full transition-all uppercase tracking-widest font-bold"
        >
          Exit
        </button>
      </div>
    </nav>
  );
};

export default Nav;