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
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 px-4 md:px-12 py-4 flex items-center justify-between ${show || isSearchOpen ? 'bg-brand-black/95 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'}`}>
      
      {/* LEFT: Branding & Links */}
      <div className="flex items-center gap-8">
        <h1 onClick={() => navigate('/browse')} className="text-xl md:text-2xl font-black italic tracking-tighter text-white uppercase cursor-pointer">
          APRIL <span className="text-brand-red">STREAM</span>
        </h1>
        <div className="hidden md:flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          <span onClick={() => navigate('/browse')} className="hover:text-white cursor-pointer transition-colors">Gallery</span>
          <span onClick={() => navigate('/my-list')} className="hover:text-white cursor-pointer transition-colors">The Vault</span>
        </div>
      </div>

      {/* RIGHT: Search Toggle & Profile */}
      <div className="flex items-center gap-4">
        
        {/* Animated Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.form 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "200px", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              onSubmit={handleSearchSubmit}
              className="relative flex items-center"
            >
              <input 
                autoFocus
                type="text"
                placeholder="Search Noir..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/10 border border-white/20 text-white text-xs px-4 py-2 rounded-full w-full outline-none focus:border-brand-red transition-all"
              />
            </motion.form>
          )}
        </AnimatePresence>

        {/* Search Icon Toggle */}
        <button 
          onClick={() => setIsSearchOpen(!isSearchOpen)} 
          className={`transition-colors ${isSearchOpen ? 'text-brand-red' : 'text-white hover:text-brand-red'}`}
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {/* User Profile (Tap for Menu) */}
        <div className="relative" ref={menuRef}>
          <img 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} 
            className={`w-8 h-8 md:w-10 md:h-10 rounded-xl border cursor-pointer transition-all ${isMenuOpen ? 'border-brand-red scale-90' : 'border-white/10'}`}
            alt="User"
          />
          
          {/* Dropdown Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-4 w-56 glass rounded-[24px] border border-white/10 p-3 shadow-2xl overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-white/5 mb-2">
                   <p className="text-[8px] uppercase tracking-widest text-gray-500 font-bold">Identified As</p>
                   <p className="text-[10px] text-white truncate font-black">{user?.email}</p>
                </div>

                {/* --- ADDED PROFILE LINK HERE --- */}
                <button onClick={() => {navigate('/profile'); setIsMenuOpen(false);}} className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 rounded-xl transition-colors">
                  Dossier (Profile)
                </button>

                <button onClick={() => {navigate('/my-list'); setIsMenuOpen(false);}} className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 rounded-xl transition-colors">
                  The Vault
                </button>
                
                <button onClick={signOut} className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-brand-red hover:bg-brand-red/10 rounded-xl transition-colors mt-1">
                  Terminate Session
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Nav;