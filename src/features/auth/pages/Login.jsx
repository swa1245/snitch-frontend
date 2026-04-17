import React, { useState } from 'react';
import fashionHero from '../../../assets/vibrant-hero.png';
import { useAuth } from '../hook/useAuth';
import { useNavigate, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Login = () => {
  const { handelLogin } = useAuth();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handelLogin(formData);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1A1A1A] flex flex-col lg:flex-row font-sans selection:bg-black selection:text-white">

      {/* Left Column: Visual Brand Identity */}
      <div className="hidden lg:flex lg:w-1/2 relative h-screen overflow-hidden group">
        <img
          src={fashionHero}
          alt="Snitch Fashion Hero"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-3000 ease-out font-sans"
        />
        {/* Subtle gradient to keep text readable on bottom left */}
        <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent"></div>

        {/* Brand Overlay */}
        <div className="absolute top-12 left-12">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white drop-shadow-lg">
            Snitch<span className="text-[#FFD700]">.</span>
          </h1>
          <p className="text-[10px] tracking-[0.4em] text-white/90 font-mono mt-1 uppercase">AUTHENTICATION • BHARAT NETWORK</p>
        </div>

        <div className="absolute bottom-12 left-12 space-y-2">
          <p className="text-4xl font-bold tracking-tight max-w-sm leading-[0.9] text-white drop-shadow-xl">
            WELCOME <br /> <span className="text-[#FFD700]">BACK</span> TO THE HAVELI.
          </p>
          <p className="text-xs text-white/80 font-mono uppercase tracking-widest">Global Desi Network</p>
        </div>

        {/* Vertical Marquee */}
        <div className="absolute right-6 top-0 bottom-0 flex items-center overflow-hidden pointer-events-none">
          <div className="whitespace-nowrap vertical-text animate-marquee-vertical text-[10px] font-sans tracking-widest text-white/30 uppercase">
            AUTHENTICATE • ACCESS • DESI EXCLUSIVE • LEGACY COLLECTION • &nbsp;
          </div>
        </div>
      </div>

      {/* Right Column: Minimalist Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-20 relative overflow-hidden bg-white">

        {/* Decorative elements */}
        <div className="absolute top-10 right-10 hidden md:block">
          <p className="text-[10px] font-mono text-gray-400">SESSION: LG-0410</p>
        </div>

        <div className="w-full max-w-sm space-y-12 z-10">

          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight flex items-center text-[#FFD700]" style={{ fontFamily: '"Playfair Display", serif' }}>
              Login
              <span className="ml-4 h-px grow bg-gray-100"></span>
            </h2>
            <p className="text-gray-600 text-sm tracking-wide">
              Access your personalized collection and order history.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-8">

              {/* Email */}
              <div className="group space-y-1">
                <label className="text-[9px] font-sans font-medium tracking-[0.3em] text-[#FFD700] uppercase transition-opacity">
                  National Identity / Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="CLIENT@DOMAIN.COM"
                  className="w-full bg-transparent border-b border-gray-200 py-3 text-sm focus:outline-none focus:border-black transition-colors placeholder:text-gray-500 uppercase font-medium text-black"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Password */}
              <div className="group space-y-1">
                <label className="text-[9px] font-sans font-medium tracking-[0.3em] text-[#FFD700] uppercase transition-opacity">
                  Security Code / Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-transparent border-b border-gray-200 py-3 text-sm focus:outline-none focus:border-black transition-colors placeholder:text-gray-500 uppercase font-medium text-black"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="pt-6 space-y-6">
              <button
                type="submit"
                className="w-full bg-[#1A1A1A] hover:bg-black text-white font-extrabold text-[11px] uppercase tracking-[0.4em] py-4 transition-all duration-500 hover:tracking-[0.6em] active:scale-[0.98] shadow-2xl brand-font rounded-sm"
              >
                Login
              </button>

              <div className="flex items-center gap-4 py-2">
                <div className="h-px grow bg-gray-100"></div>
                <span className="text-[8px] font-mono text-gray-500 uppercase tracking-[0.2em]">or</span>
                <div className="h-px grow bg-gray-100"></div>
              </div>

              <a
                href="/api/auth/google"
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-all duration-300 py-2.5 group rounded-sm"
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

              <div className="mt-10 space-y-4">
                <p className="text-center text-[8px] font-mono text-gray-600 tracking-[0.3em] uppercase">
                  New to the brand?{' '}
                  <a href="/register" className="text-[#FFD700] hover:underline transition-colors ml-1 font-bold">
                    Register Now
                  </a>
                </p>
                <p className="text-center text-[8px] font-mono text-gray-500 tracking-widest uppercase">
                  By logging in, you accept our <a href="#" className="hover:text-black transition-colors">Digital Dharma</a>
                </p>
              </div>
            </div>
          </form>

          {/* Footer Mobile Only */}
          <div className="lg:hidden text-center pt-10">
            <h1 className="text-xl font-black tracking-tighter uppercase italic">
              Snitch<span className="text-gray-400">.</span>
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
          animation: marquee-vertical 25s linear infinite;
        }
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}} />
    </div>
  );
};

export default Login;
