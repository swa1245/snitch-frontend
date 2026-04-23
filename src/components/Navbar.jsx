import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../features/auth/hook/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);
  const isSeller = user?.role === 'seller';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <h1 className="text-xl font-black tracking-tighter uppercase italic cursor-pointer" onClick={() => navigate('/')}>
        Snitch<span className="text-gray-400">.</span>
      </h1>
      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate('/shop')}
          className="text-[10px] font-mono text-gray-400 hover:text-black uppercase tracking-[0.3em] transition-colors cursor-pointer"
        >
          The Shop
        </button>
        <button
          onClick={() => navigate('/cart')}
          className="text-[10px] font-mono text-gray-400 hover:text-black uppercase tracking-[0.3em] transition-colors cursor-pointer relative"
        >
          Selection
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-3 w-4 h-4 bg-black text-white text-[7px] flex items-center justify-center rounded-full font-bold">
              {cartItems.length}
            </span>
          )}
        </button>
        {isSeller && (
          <button
            onClick={() => navigate('/seller/products')}
            className="text-[10px] font-mono text-gray-400 hover:text-black uppercase tracking-[0.3em] transition-colors cursor-pointer"
          >
            My Drops
          </button>
        )}
        <div className="flex flex-col items-end pl-4 border-l border-gray-100">
          <p className="text-[10px] font-mono text-gray-400 tracking-[0.3em] uppercase hidden md:block">
            {user?.fullName || 'SNITCH USER'}
          </p>
          <button
            onClick={handleLogout}
            className="text-[8px] font-mono text-red-500/60 hover:text-red-500 uppercase tracking-widest transition-colors cursor-pointer"
          >
            End Session [X]
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
