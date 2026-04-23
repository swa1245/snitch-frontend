import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../../auth/hook/useAuth';
import Navbar from '../../../components/Navbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const user = useSelector((state) => state.auth.user);
  const isSeller = user?.role === 'seller';

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1A1A1A] font-sans selection:bg-black selection:text-white">
      <Navbar />

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6 text-center">
        {/* Background noise texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.02)_0%,transparent_70%)]" />

        {/* Decorative lines */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200 hidden lg:block" />
        <div className="absolute right-8 top-0 bottom-0 w-px bg-gray-200 hidden lg:block" />

        <div className="z-10 space-y-8 max-w-2xl">
          <p className="text-[10px] font-mono text-gray-400 tracking-[0.5em] uppercase">
            001 — BHARATIYA DESIGN HOUSE
          </p>
          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
            REDEFINING <br />
            <span className="text-gray-300">INDIAN</span> LUXURY
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed font-medium">
            The marketplace forged in Bengaluru, for those who dare to wear their culture with pride.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {user ? (
              isSeller ? (
                <>
                  <button
                    onClick={() => navigate('/seller/products/create')}
                    className="bg-black hover:bg-gray-800 text-white font-extrabold text-[11px] uppercase tracking-[0.4em] px-8 py-4 transition-all duration-500 hover:tracking-[0.6em] active:scale-[0.98] brand-font rounded-sm shadow-xl cursor-pointer"
                  >
                    + New Drop
                  </button>
                  <button
                    onClick={() => navigate('/seller/products')}
                    className="border border-gray-300 hover:border-black text-gray-400 hover:text-black font-mono text-[10px] uppercase tracking-[0.3em] px-8 py-4 transition-all duration-300 rounded-sm cursor-pointer"
                  >
                    View My Drops
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/shop')}
                  className="bg-black hover:bg-gray-800 text-white font-extrabold text-[11px] uppercase tracking-[0.4em] px-8 py-4 transition-all duration-500 hover:tracking-[0.6em] active:scale-[0.98] brand-font rounded-sm shadow-xl cursor-pointer"
                >
                  Explore Collection
                </button>
              )
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="bg-black hover:bg-gray-800 text-white font-extrabold text-[11px] uppercase tracking-[0.4em] px-8 py-4 transition-all duration-500 hover:tracking-[0.6em] active:scale-[0.98] brand-font rounded-sm shadow-xl cursor-pointer"
              >
                Enter The House
              </button>
            )}
          </div>
        </div>

        {/* Bottom cities */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <p className="text-[9px] font-mono text-gray-300 tracking-[0.5em] uppercase">
            BENGALURU • MUMBAI • DELHI • CHENNAI
          </p>
        </div>
      </section>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
