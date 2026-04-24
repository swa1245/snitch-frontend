import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../features/auth/hook/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);

  return (
    <div className="w-full flex flex-col z-50 fixed top-0 left-0 right-0">
      {/* Top Utility Bar */}
      <div className="bg-black text-white py-1.5 px-4 flex justify-between items-center text-[10px] font-medium tracking-tight">
        <div className="flex gap-4">
          <p>Conquer Your Style on the Overlays App</p>
          <span className="text-gray-500">New Here? Get 10% Off | OLAFP10 | ★ 4.5</span>
        </div>
        <button className="bg-orange-500 px-3 py-0.5 rounded-sm font-bold uppercase text-[9px]">Install</button>
      </div>

      {/* Main Navbar */}
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        {/* Left Links */}
        <nav className="flex items-center gap-6">
          {['Shop By Category', 'Fit Guide'].map((link) => (
            <button
              key={link}
              onClick={() => navigate(link === 'Fit Guide' ? '/shop?fitguide=true' : '/shop')}
              className="text-[11px] font-bold text-gray-500 hover:text-black uppercase transition-colors cursor-pointer"
            >
              {link}
            </button>
          ))}
        </nav>

        {/* Center Logo */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="flex flex-col items-center">
            {/* Minimalist abstract flame logo similar to reference */}
            <div className="w-6 h-6 bg-orange-500 rounded-tr-full rounded-bl-full rotate-45 mb-0.5 shadow-lg group-hover:bg-orange-600 transition-colors" />
            <h1 className="text-sm font-black tracking-tighter uppercase italic">Snitch</h1>
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-6">
          <button className="p-1 hover:text-orange-500 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
          
          <div className="relative group">
            <button className="p-1 hover:text-orange-500 transition-colors cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </button>
            {/* User Dropdown - Refined Editorial Style */}
            <div className="absolute right-0 top-full mt-4 w-64 bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-3 rounded-2xl z-[100] overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 mb-1 bg-gray-50/30">
                <p className="text-[11px] font-black text-black uppercase tracking-widest mb-1">{user?.fullName || 'Guest'}</p>
                <p className="text-[9px] text-gray-400 font-medium tracking-tight break-all">{user?.email}</p>
              </div>
              <div className="px-2">
                <button 
                  onClick={handleLogout} 
                  className="w-full text-left px-4 py-3 text-[10px] text-red-500 font-black hover:bg-red-50 rounded-xl transition-all uppercase tracking-[0.2em] flex items-center justify-between group/logout"
                >
                  <span>Sign Out</span>
                  <svg className="w-3.5 h-3.5 transform group-hover/logout:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
              </div>
            </div>
          </div>

          <button 
            onClick={() => navigate('/cart')}
            className="p-1 hover:text-orange-500 transition-colors cursor-pointer relative"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[8px] flex items-center justify-center rounded-full font-bold">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Announcement Bar */}
      <div className="bg-orange-500 text-white py-2 overflow-hidden border-b border-orange-400">
        <div className="flex whitespace-nowrap animate-marquee">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="flex items-center mx-12 gap-12 text-[9px] font-bold uppercase tracking-[0.25em] ui-font">
              <span>1,70,000+ Happy Customers</span>
              <span className="opacity-30">•</span>
              <span>Get Flat ₹100 OFF on ₹999+ orders | INSTANT100</span>
              <span className="opacity-30">•</span>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}} />
    </div>
  );
};

export default Navbar;


