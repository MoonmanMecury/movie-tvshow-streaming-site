import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Nav from '../components/Nav';
import Banner from '../components/Banner';
import Row from '../components/Row';
import requests from '../services/requests';

const BrowsePage = () => {
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const [timeTheme, setTimeTheme] = useState({ 
    color: '#050000', 
    glow: 'rgba(229, 9, 20, 0.12)', // Increased opacity for better glow
    accent: 'text-brand-red' 
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setTimeTheme({ color: '#03080d', glow: 'rgba(56, 189, 248, 0.1)', accent: 'text-sky-400' });
    } else if (hour >= 12 && hour < 18) {
      setTimeTheme({ color: '#0a0a0a', glow: 'rgba(255, 255, 255, 0.05)', accent: 'text-white' });
    } else {
      setTimeTheme({ color: '#050000', glow: 'rgba(229, 9, 20, 0.12)', accent: 'text-brand-red' });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Smoother transition for the background glows
      const opacity = Math.min(window.scrollY / 700, 1);
      setScrollOpacity(opacity);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      className="min-h-screen transition-colors duration-[2000ms] overflow-x-hidden selection:bg-brand-red selection:text-white" 
      style={{ backgroundColor: timeTheme.color }}
    >
      <Nav />

      {/* 1. DREAMY AMBIENT OVERLAY (The "Smoke" Effect) */}
      <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000" style={{ opacity: scrollOpacity }}>
        {/* Top Left Orb */}
        <div 
          className="absolute -top-[10%] -left-[10%] w-[120vw] md:w-[70vw] h-[60vh] rounded-full blur-[100px] md:blur-[150px] mix-blend-screen animate-pulse opacity-60" 
          style={{ background: `radial-gradient(circle, ${timeTheme.glow} 0%, transparent 70%)` }} 
        />
        {/* Bottom Right Orb */}
        <div 
          className="absolute bottom-[-10%] -right-[10%] w-[100vw] md:w-[60vw] h-[50vh] rounded-full blur-[120px] md:blur-[180px] opacity-40" 
          style={{ background: `radial-gradient(circle, ${timeTheme.glow} 0%, transparent 70%)`, animationDelay: '3s' }} 
        />
      </div>

      <div className="relative z-10">
        <Banner />

        {/* 2. THE CONTENT STACK */}
        <motion.div 
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
          className="relative mt-2 md:-mt-32 z-20 pb-20 md:pb-32 px-4 md:px-0 space-y-8 md:space-y-12"
        >
          {/* We wrap rows in a container that adds a subtle shadow to separate them from the banner on mobile */}
          <div className="space-y-10 md:space-y-16">
            <Row title="April Originals" fetchUrl={requests.fetchNetflixOriginals} isLargeRow />
            <Row title="Trending Now" fetchUrl={requests.fetchTrending} />
            <Row title="Critically Acclaimed" fetchUrl={requests.fetchTopRated} />
            <Row title="Adrenaline & Action" fetchUrl={requests.fetchActionMovies} />
            <Row title="Late Night Comedy" fetchUrl={requests.fetchComedyMovies} />
            <Row title="Chills & Horror" fetchUrl={requests.fetchHorrorMovies} />
          </div>
        </motion.div>
      </div>

      {/* 3. NOIR FOOTER */}
      <footer className="relative z-10 py-16 md:py-24 text-center border-t border-white/5 bg-gradient-to-b from-transparent to-black/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-6">
          <div className="h-[1px] w-12 bg-brand-red shadow-[0_0_10px_rgba(229,9,20,0.8)]" />
          <p className={`text-[8px] md:text-[10px] tracking-[0.6em] md:tracking-[0.8em] uppercase font-black ${timeTheme.accent} opacity-80`}>
            Noir Digital Protocol // 2025
          </p>
          <p className="text-gray-700 text-[6px] md:text-[7px] uppercase tracking-[0.4em] font-bold">
            Curated Cinema • Encrypted Stream
          </p>
        </div>
      </footer>
    </motion.div>
  );
};

export default BrowsePage;