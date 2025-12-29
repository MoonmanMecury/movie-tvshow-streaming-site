import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Nav from '../components/Nav';
import Banner from '../components/Banner';
import Row from '../components/Row';
import requests from '../services/requests';

const BrowsePage = () => {
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const [timeTheme, setTimeTheme] = useState({ color: '#050000', glow: 'rgba(185, 28, 28, 0.08)' });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeTheme({ color: '#050a0f', glow: 'rgba(56, 189, 248, 0.08)' });
    else if (hour >= 12 && hour < 18) setTimeTheme({ color: '#0a0a0a', glow: 'rgba(255, 255, 255, 0.03)' });
    else setTimeTheme({ color: '#050000', glow: 'rgba(185, 28, 28, 0.08)' });
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollOpacity(Math.min(window.scrollY / 500, 1));
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen transition-colors duration-1000 overflow-x-hidden" 
      style={{ backgroundColor: timeTheme.color }}
    >
      <Nav />
      <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-700" style={{ opacity: scrollOpacity }}>
        <div className="absolute top-[20%] -left-20 w-[600px] h-[600px] rounded-full blur-[150px] animate-pulse" style={{ backgroundColor: timeTheme.glow }} />
        <div className="absolute bottom-[10%] -right-20 w-[800px] h-[800px] rounded-full blur-[180px]" style={{ backgroundColor: timeTheme.glow, animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        <Banner />
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="relative -mt-24 z-20 pb-32"
        >
          <Row title="April Originals" fetchUrl={requests.fetchNetflixOriginals} />
          <Row title="Trending Now" fetchUrl={requests.fetchTrending} />
          <Row title="Critically Acclaimed" fetchUrl={requests.fetchTopRated} />
          <Row title="Adrenaline & Action" fetchUrl={requests.fetchActionMovies} />
          <Row title="Late Night Comedy" fetchUrl={requests.fetchComedyMovies} />
          <Row title="Chills & Horror" fetchUrl={requests.fetchHorrorMovies} />
        </motion.div>
      </div>

      <footer className="relative z-10 p-20 text-center border-t border-white/5 bg-black/40 backdrop-blur-md">
        <p className="text-gray-700 text-[9px] tracking-[0.6em] uppercase font-black">Curated Cinema • April Stream 2025</p>
      </footer>
    </motion.div>
  );
};

export default BrowsePage;