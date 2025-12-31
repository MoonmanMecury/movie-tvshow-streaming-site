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
      ? "Terminate all active sessions across all devices?" 
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
    { label: 'Identity', value: user?.email },
    { label: 'Access Level', value: 'Premium / 4K HDR' },
    { label: 'Status', value: 'Active Protocol', color: 'text-green-500' },
    { label: 'Member Since', value: new Date(user?.created_at).toLocaleDateString() },
  ];

  return (
    <div className="min-h-screen bg-brand-black text-white font-sans">
      <Nav />
      
      <main className="pt-24 md:pt-32 px-6 md:px-16 max-w-6xl mx-auto pb-20">
        <header className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter"
          >
            User <span className="text-brand-red">Dossier</span>
          </motion.h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-2">
            System Configuration & Security
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: QUICK STATS */}
          <div className="space-y-4">
            {dossierData.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-6 rounded-3xl border border-white/5 flex flex-col gap-1"
              >
                <span className="text-[8px] uppercase tracking-widest text-gray-600 font-black">
                  {item.label}
                </span>
                <span className={`text-sm font-bold uppercase tracking-wider ${item.color || 'text-white'}`}>
                  {item.value}
                </span>
              </motion.div>
            ))}
          </div>

          {/* RIGHT: SETTINGS HUB */}
          <div className="lg:col-span-2 space-y-6">
            <section className="glass p-8 md:p-10 rounded-[40px] border border-white/5 backdrop-blur-3xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-8 border-b border-white/5 pb-4">
                Security Controls
              </h3>

              <div className="space-y-6">
                {/* Change Password */}
                <div className="flex items-center justify-between group">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-tight">Access Key</h4>
                    <p className="text-[10px] text-gray-500 uppercase mt-1">Update your encryption password</p>
                  </div>
                  <button 
                    onClick={() => navigate('/update-password')}
                    className="px-6 py-2 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                  >
                    Modify
                  </button>
                </div>

                <div className="h-[1px] bg-white/5" />

                {/* Local Logout */}
                <div className="flex items-center justify-between group">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-tight text-brand-red">Terminate Session</h4>
                    <p className="text-[10px] text-gray-500 uppercase mt-1">Exit current browser environment</p>
                  </div>
                  <button 
                    onClick={() => handleLogout('local')}
                    className="px-6 py-2 bg-brand-red/10 border border-brand-red/20 text-brand-red rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all"
                  >
                    Logout
                  </button>
                </div>

                <div className="h-[1px] bg-white/5" />

                {/* Global Logout */}
                <div className="flex items-center justify-between group">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-tight text-brand-red">Global Kill-Switch</h4>
                    <p className="text-[10px] text-gray-500 uppercase mt-1 text-brand-red/60 italic">Emergency: Log out of all devices</p>
                  </div>
                  <button 
                    onClick={() => handleLogout('global')}
                    className="px-6 py-2 border border-brand-red/50 text-brand-red rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all"
                  >
                    Purge All
                  </button>
                </div>
              </div>
            </section>

            {/* FLAVOR TEXT / FOOTER */}
            <p className="text-[9px] text-center text-gray-700 uppercase tracking-[0.5em] mt-10 leading-loose">
              Noir Protocol Encrypted Link <br />
              End-to-End Delivery Active
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;