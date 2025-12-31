import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthProvider';
import { motion } from 'framer-motion';
import Nav from '../components/Nav';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (scope = 'local') => {
    const message = scope === 'global' 
      ? "Execute Global Termination? All active nodes will be purged." 
      : "Terminate current session?";
      
    if (!window.confirm(message)) return;

    try {
      const { error } = await supabase.auth.signOut({ scope });
      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  const dossierData = [
    { label: 'Identity', value: user?.email || 'Unknown Entity' },
    { label: 'Access Level', value: 'Premium / 4K HDR' },
    { label: 'Status', value: 'Active Protocol', color: 'text-emerald-500' },
    { label: 'Member Since', value: user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Pending' },
  ];

  return (
    <div className="min-h-screen bg-[#050000] text-white font-sans relative overflow-x-hidden selection:bg-red-600 selection:text-white">
      <Nav />
      
      {/* 1. ATMOSPHERIC GLOWS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[100vw] md:w-[70vw] h-[50vh] bg-red-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[80vw] md:w-[50vw] h-[40vh] bg-red-900/10 blur-[100px] rounded-full" />
      </div>

      <main className="relative z-10 pt-24 md:pt-40 px-5 md:px-16 max-w-6xl mx-auto pb-20">
        
        {/* HEADER */}
        <header className="mb-10 md:mb-16 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
              User <span className="text-red-600 shadow-red-600/50" style={{ textShadow: '0 0 20px rgba(220, 38, 38, 0.4)' }}>Dossier</span>
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-4 mt-4 opacity-40">
               <div className="h-[1px] w-8 md:w-12 bg-red-600" />
               <p className="text-[9px] md:text-xs font-black uppercase tracking-[0.4em]">
                 Configuration & Security
               </p>
            </div>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* LEFT: STATUS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {dossierData.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/[0.03] backdrop-blur-md p-5 md:p-6 rounded-2xl border border-white/5 flex flex-col gap-2"
              >
                <span className="text-[7px] md:text-[8px] uppercase tracking-[0.3em] text-gray-500 font-black">
                  {item.label}
                </span>
                <span className={`text-xs md:text-sm font-black uppercase tracking-widest truncate ${item.color || 'text-white'}`}>
                  {item.value}
                </span>
              </motion.div>
            ))}
          </div>

          {/* RIGHT: COMMAND CENTER */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <section className="bg-white/[0.02] backdrop-blur-3xl p-6 md:p-12 rounded-[32px] md:rounded-[40px] border border-white/5 shadow-2xl">
              <h3 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] text-gray-600 mb-8 md:mb-12 flex items-center gap-4">
                <span className="text-red-600">01</span> Security Controls
                <div className="flex-1 h-[1px] bg-white/5" />
              </h3>

              <div className="space-y-8 md:space-y-10">
                {/* Actions Grid */}
                {[
                  { 
                    title: 'Access Key', 
                    desc: 'Update encryption password', 
                    btn: 'Modify', 
                    action: () => navigate('/update-password'),
                    theme: 'white' 
                  },
                  { 
                    title: 'Terminate Session', 
                    desc: 'Exit current browser environment', 
                    btn: 'Logout', 
                    action: () => handleLogout('local'),
                    theme: 'red' 
                  },
                  { 
                    title: 'Global Kill-Switch', 
                    desc: 'Purge all active device nodes', 
                    btn: 'Purge All', 
                    action: () => handleLogout('global'),
                    theme: 'red-outline' 
                  }
                ].map((ctrl, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 group">
                    <div className="max-w-xs">
                      <h4 className={`text-sm font-black uppercase tracking-widest transition-colors ${ctrl.theme.includes('red') ? 'text-red-600' : 'text-white group-hover:text-red-600'}`}>
                        {ctrl.title}
                      </h4>
                      <p className="text-[9px] text-gray-600 uppercase mt-1 tracking-widest font-bold">{ctrl.desc}</p>
                    </div>
                    
                    <button 
                      onClick={ctrl.action}
                      className={`w-full md:w-auto px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                        ctrl.theme === 'white' ? 'bg-white text-black hover:bg-red-600 hover:text-white' :
                        ctrl.theme === 'red' ? 'bg-red-600/10 border border-red-600/20 text-red-600 hover:bg-red-600 hover:text-white' :
                        'border border-red-600/40 text-red-600 hover:bg-red-600 hover:text-white'
                      }`}
                    >
                      {ctrl.btn}
                    </button>
                    {idx !== 2 && <div className="md:hidden w-full h-[1px] bg-white/5" />}
                  </div>
                ))}
              </div>
            </section>

            {/* DECORATIVE FOOTER */}
            <div className="mt-10 md:mt-12 opacity-30 flex flex-col items-center gap-4">
              <p className="text-[7px] md:text-[8px] text-center text-gray-500 uppercase tracking-[0.6em] font-black">
                Noir Protocol // 2025 encrypted connection
              </p>
              <div className="h-[1px] w-6 bg-red-600" />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;