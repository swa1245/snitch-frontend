import React, { useState, useEffect } from 'react';
import fashionHero from '../../../assets/fashion-hero.png';
import { useAuth } from '../hook/useAuth';
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const { handelRegsiter } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    password: '',
    isSeller: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handelRegsiter(formData)
    navigate('/')
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row font-sans selection:bg-[#FFD700] selection:text-black">

      {/* Left Column: Visual Brand Identity */}
      <div className="hidden lg:flex lg:w-1/2 relative h-screen overflow-hidden group">
        <img
          src={fashionHero}
          alt="Snitch Fashion Hero"
          className="absolute inset-0 w-full h-full object-cover grayscale-20 group-hover:scale-105 transition-transform duration-3000 ease-out"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-transparent to-black/40"></div>

        {/* Brand Overlay */}
        <div className="absolute top-12 left-12">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">
            Snitch<span className="text-[#FFD700]">.</span>
          </h1>
          <p className="text-[10px] tracking-[0.4em] text-white/60 font-mono mt-1 uppercase">BENGALURU • MUMBAI • DELHI</p>
        </div>

        <div className="absolute bottom-12 left-12 space-y-2">
          <p className="text-4xl font-bold tracking-tight max-w-sm leading-[0.9]">
            REDEFINING <br /> <span className="text-[#FFD700]">INDIAN</span> LUXURY.
          </p>
          <p className="text-xs text-white/40 font-mono">001 - BHARATIYA DESIGN HOUSE</p>
        </div>

        {/* Vertical Marquee */}
        <div className="absolute right-6 top-0 bottom-0 flex items-center overflow-hidden pointer-events-none">
          <div className="whitespace-nowrap vertical-text animate-marquee-vertical text-[10px] font-sans tracking-widest text-white/10 uppercase opacity-50">
            MADE IN INDIA • LIMITED DROP • SNITCH EXCLUSIVE • DESI STREETWEAR • &nbsp;
          </div>
        </div>
      </div>

      {/* Right Column: Minimalist Registration */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-20 relative overflow-hidden bg-[#0A0A0A]">

        {/* Decorative elements */}
        <div className="absolute top-10 right-10 hidden md:block">
          <p className="text-[10px] font-mono text-[#FFD700]/40">MOD: RG-0410</p>
        </div>

        <div className="w-full max-w-sm space-y-12 z-10">

          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight flex items-center">
              Sign Up
              <span className="ml-4 h-px grow bg-white/10"></span>
            </h2>
            <p className="text-gray-500 text-sm tracking-wide">
              Secure your spot in the next collection drop.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-8">

              {/* Field 1 */}
              <div className="group space-y-1">
                <label className="text-[9px] font-sans font-medium tracking-[0.3em] text-[#FFD700] uppercase transition-opacity">
                  Citizen Identity / Full Name
                </label>
                <input
                  name="fullName"
                  type="text"
                  required
                  placeholder="E.G. ARJUN MALHOTRA"
                  className="w-full bg-transparent border-b border-white/20 py-3 text-sm focus:outline-none focus:border-[#FFD700] transition-colors placeholder:text-white/20 uppercase font-medium"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              {/* Field 2 */}
              <div className="group space-y-1">
                <label className="text-[9px] font-sans font-medium tracking-[0.3em] text-[#FFD700] uppercase transition-opacity">
                  Digital Portal / Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="CLIENT@DOMAIN.COM"
                  className="w-full bg-transparent border-b border-white/20 py-3 text-sm focus:outline-none focus:border-[#FFD700] transition-colors placeholder:text-white/20 uppercase font-medium"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Field 3 */}
              <div className="group space-y-1">
                <label className="text-[9px] font-sans font-medium tracking-[0.3em] text-[#FFD700] uppercase transition-opacity">
                  National Link / Contact
                </label>
                <input
                  name="contactNumber"
                  type="tel"
                  required
                  placeholder="+91 00000 00000"
                  className="w-full bg-transparent border-b border-white/20 py-3 text-sm focus:outline-none focus:border-[#FFD700] transition-colors placeholder:text-white/20 uppercase font-medium"
                  value={formData.contactNumber}
                  onChange={handleChange}
                />
              </div>

              {/* Field 4 */}
              <div className="group space-y-1">
                <label className="text-[9px] font-sans font-medium tracking-[0.3em] text-[#FFD700] uppercase transition-opacity">
                  Verification Code / Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-transparent border-b border-white/20 py-3 text-sm focus:outline-none focus:border-[#FFD700] transition-colors placeholder:text-white/20 uppercase font-medium"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {/* Seller Toggle */}
              <label className="flex items-center space-x-4 cursor-pointer group/check">
                <div className="relative">
                  <input
                    name="isSeller"
                    type="checkbox"
                    className="peer hidden"
                    checked={formData.isSeller}
                    onChange={handleChange}
                  />
                  <div className="w-10 h-5 bg-white/10 border border-white/20 rounded-full transition-colors peer-checked:bg-[#FFD700]/30 peer-checked:border-[#FFD700]"></div>
                  <div className="absolute top-1 left-1 w-3 h-3 bg-white/60 rounded-full transition-transform peer-checked:translate-x-5 peer-checked:bg-[#FFD700]"></div>
                </div>
                <span className="text-[9px] font-mono tracking-widest text-white/60 group-hover/check:text-white uppercase transition-colors">
                  Join as a Swadeshi Merchant
                </span>
              </label>
            </div>

            <div className="pt-6 space-y-6">
              <button
                type="submit"
                className="w-full bg-[#FFD700] hover:bg-white text-black font-extrabold text-[11px] uppercase tracking-[0.4em] py-4 transition-all duration-500 hover:tracking-[0.6em] active:scale-[0.98] shadow-2xl brand-font"
              >
                Sign Up
              </button>

              <div className="flex items-center gap-4 py-2">
                <div className="h-px grow bg-white/5"></div>
                <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">or</span>
                <div className="h-px grow bg-white/5"></div>
              </div>

              <a
                href="/api/auth/google"
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-white/90 text-gray-700 transition-all duration-300 py-2.5 shadow-md group border border-transparent"
              >
                <div className="bg-white p-2 rounded-sm mr-1">
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
                    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
                    <path fill="#FBBC05" d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.712s.102-1.173.282-1.712V4.956H.957C.347 6.173 0 7.548 0 9s.347 2.827.957 4.044l3.007-2.332z" />
                    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.582C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.956L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" />
                  </svg>
                </div>
                <span className="text-[11px] font-sans font-medium text-[#1f1f1f]">Continue with Google</span>
              </a>
              <p className="mt-8 text-center text-[8px] font-mono text-white/40 tracking-[0.3em] uppercase">
                By joining, you agree to our <a href="#" className="border-b border-white/20 hover:text-white transition-colors">House Terms</a>
              </p>
            </div>
          </form>

          {/* Footer Mobile Only */}
          <div className="lg:hidden text-center pt-10">
            <h1 className="text-xl font-black tracking-tighter uppercase italic">
              Snitch<span className="text-[#FFD700]">.</span>
            </h1>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee-vertical {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-marquee-vertical {
          animation: marquee-vertical 20s linear infinite;
        }
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}} />
    </div>
  );
};

export default Register;