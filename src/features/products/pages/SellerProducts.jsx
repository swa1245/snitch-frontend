import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '../hook/useProduct';

const currencySymbols = { USD: '$', EUR: '€', GBP: '£' };

const SellerProducts = () => {
  const navigate = useNavigate();
  const { sellerProducts, loading, error, handleFetchSellerProducts } = useProduct();

  useEffect(() => {
    handleFetchSellerProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1A1A1A] font-sans selection:bg-black selection:text-white">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <h1
          className="text-xl font-black tracking-tighter uppercase italic cursor-pointer"
          onClick={() => navigate('/')}
        >
          Snitch<span className="text-[#FFD700]">.</span>
        </h1>
        <div className="flex items-center gap-6">
          <p className="text-[10px] font-mono text-gray-400 tracking-[0.3em] uppercase hidden md:block">
            CONSOLA : SELLER
          </p>
          <button
            onClick={() => navigate('/seller/products/create')}
            className="bg-black hover:bg-gray-800 text-white font-extrabold text-[10px] uppercase tracking-[0.3em] px-5 py-2.5 transition-all duration-300 rounded-sm shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            + Initiate Drop
          </button>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6 md:px-16 lg:px-24">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <p className="text-[10px] font-mono text-[#FFD700] tracking-[0.4em] uppercase font-bold">
              Your Marketplace Universe
            </p>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter" style={{ fontFamily: '"Playfair Display", serif' }}>
              My Drops
            </h2>
            <p className="text-gray-500 text-sm max-w-md leading-relaxed">
              Managing your luxury catalog with clinical precision. Every drop is a statement of style and craftsmanship.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-12 border-l border-gray-200 pl-8 h-fit">
            <div className="space-y-1">
              <p className="text-[9px] font-mono text-gray-400 tracking-widest uppercase">Total Assets</p>
              <p className="text-2xl font-bold">{sellerProducts.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-mono text-gray-400 tracking-widest uppercase">Live Status</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-2xl font-bold">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* States */}
        {loading && (
          <div className="flex items-center justify-center py-40">
            <div className="flex flex-col items-center gap-6">
              <div className="w-12 h-12 border-[3px] border-gray-100 border-t-[#FFD700] rounded-full animate-spin" />
              <p className="text-[10px] font-mono text-[#FFD700] tracking-[0.4em] uppercase font-bold">
                Synchronizing Catalog...
              </p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="mb-8 px-6 py-4 border border-red-200 bg-red-50 text-red-600 text-xs font-mono tracking-widest uppercase rounded-sm">
            {error}
          </div>
        )}

        {!loading && !error && sellerProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-gray-200 rounded-lg gap-8">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl grayscale">
              📦
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-xl font-bold tracking-tight">The catalog is empty</h3>
              <p className="text-gray-400 text-sm max-w-xs mx-auto">
                Begin your journey by creating your first exclusive fashion drop.
              </p>
            </div>
            <button
              onClick={() => navigate('/seller/products/create')}
              className="bg-black hover:bg-gray-800 text-white font-extrabold text-[10px] uppercase tracking-[0.3em] px-8 py-4 transition-all duration-300 rounded-sm"
            >
              + Create First Drop
            </button>
          </div>
        )}

        {/* Product Grid - Staggered Feel */}
        {!loading && sellerProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {sellerProducts.map((product, idx) => (
              <ProductCard key={product._id} product={product} index={idx} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const ProductCard = ({ product, index }) => {
  const symbol = currencySymbols[product.price?.currency] || '$';
  const thumbnail = product.images?.[0]?.url;

  return (
    <div 
      className="group relative flex flex-col transition-all duration-700 hover:-translate-y-2"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Visual Identity */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-2xl transition-all duration-700">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200 text-6xl">
            🧥
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
        
        {/* Drop Details on Hover */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <button className="bg-white text-black py-3 text-[9px] uppercase tracking-[0.2em] font-bold hover:bg-[#FFD700] transition-colors">
            Edit Drop
          </button>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-md px-3 py-1 text-[8px] font-bold tracking-[0.2em] uppercase shadow-sm border border-gray-100">
            Live Drop
          </span>
        </div>
      </div>

      {/* Content Identity */}
      <div className="pt-4 space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#1A1A1A] truncate max-w-[70%]">
            {product.title}
          </h3>
          <span className="text-black font-black text-sm font-mono">
            {symbol}{Number(product.price?.amount).toLocaleString()}
          </span>
        </div>
        
        <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed uppercase font-medium tracking-tight">
          {product.description}
        </p>

        <div className="h-px w-0 bg-[#FFD700] group-hover:w-full transition-all duration-700" />
      </div>
    </div>
  );
};

export default SellerProducts;
