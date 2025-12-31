import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';

const Nav = () => {
  const [show, handleShow] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const menuRef = useRef();

  // 1. Close menu when clicking outside
  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  // 2. Scroll Background logic
  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 50) handleShow(true);
      else handleShow(false);
    };
    window.addEventListener("scroll", scrollListener);
    return () => window.removeEventListener("scroll", scrollListener);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 px-6 md:px-16 py-5 flex items-center justify-between ${
      show || isSearchOpen 
        ? 'bg-[#050000]/80 backdrop-blur-2xl border-b border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' 
        : 'bg-transparent'
    }`}>
      
      {/* LEFT: Branding & Links */}
      <div className="flex items-center gap-10">
        <h1 
          onClick={() => navigate('/browse')} 
          className="text-xl md:text-2xl font-black italic tracking-tighter text-white uppercase cursor-pointer group"
        >
          APRIL <span className="text-red-600 group-hover:text-white transition-colors duration-500">STREAM</span>
        </h1>
        
        <div className="hidden md:flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.4em] text-gray-500">
          <span 
            onClick={() => navigate('/browse')} 
            className="hover:text-white cursor-pointer transition-all hover:tracking-[0.5em]"
          >
            Gallery
          </span>
          <span 
            onClick={() => navigate('/my-list')} 
            className="hover:text-white cursor-pointer transition-all hover:tracking-[0.5em]"
          >
            The Vault
          </span>
        </div>
      </div>

      {/* RIGHT: Search Toggle & Profile */}
      <div className="flex items-center gap-6">
        
        {/* Animated Search Bar */}
        <div className="flex items-center">
          <AnimatePresence>
            {isSearchOpen && (
              <motion.form 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "220px", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                onSubmit={handleSearchSubmit}
                className="overflow-hidden"
              >
                <input 
                  autoFocus
                  type="text"
                  placeholder="Identify content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/[0.05] border border-white/10 text-white text-[10px] uppercase font-bold tracking-widest px-5 py-2.5 rounded-full w-full outline-none focus:border-red-600/50 transition-all placeholder:text-gray-700"
                />
              </motion.form>
            )}
          </AnimatePresence>

          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)} 
            className={`ml-3 p-2 transition-all duration-300 ${isSearchOpen ? 'text-red-600 rotate-90' : 'text-white hover:text-red-600'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* User Profile */}
        <div className="relative" ref={menuRef}>
          <div className="relative group">
            <img 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} 
              className={`w-9 h-9 md:w-11 md:h-11 rounded-2xl border-2 cursor-pointer transition-all duration-500 object-cover bg-[#111] ${
                isMenuOpen ? 'border-red-600 scale-90 shadow-[0_0_20px_rgba(220,38,38,0.3)]' : 'border-white/5 hover:border-white/20'
              }`}
              alt="User"
            />
          </div>
          
          {/* Dropdown Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                className="absolute right-0 top-full mt-5 w-64 bg-[#0a0a0a]/95 backdrop-blur-3xl rounded-[32px] border border-white/5 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-white/5 mb-2">
                   <p className="text-[7px] uppercase tracking-[0.4em] text-gray-600 font-black mb-1">Authenticated Node</p>
                   <p className="text-[10px] text-white truncate font-black tracking-wider uppercase">{user?.email}</p>
                </div>

                <div className="space-y-1">
                  <button onClick={() => {navigate('/profile'); setIsMenuOpen(false);}} className="w-full text-left px-5 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                    Dossier (Profile)
                  </button>

                  <button onClick={() => {navigate('/my-list'); setIsMenuOpen(false);}} className="w-full text-left px-5 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                    The Vault
                  </button>
                  
                  <div className="h-[1px] bg-white/5 mx-4 my-2" />

                  <button onClick={signOut} className="w-full text-left px-5 py-4 text-[9px] font-black uppercase tracking-[0.3em] text-red-600 hover:bg-red-600 hover:text-white rounded-2xl transition-all shadow-sm">
                    Terminate Session
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Nav;