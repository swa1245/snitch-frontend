import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '../hook/useProduct';
import Navbar from '../../../components/Navbar';

const ProductFeed = () => {
  const navigate = useNavigate();
  const { allProducts, loading, handleFetchAllProducts } = useProduct();

  useEffect(() => {
    handleFetchAllProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1A1A1A] font-sans pt-24 pb-20 selection:bg-black selection:text-white">
      <Navbar />
      {/* Dynamic Header */}
      <div className="max-w-7xl mx-auto px-8 mb-12 flex items-end justify-between border-b border-gray-200 pb-8">
        <div className="space-y-2">
          <p className="text-[10px] font-mono text-[#FFD700] tracking-[0.5em] uppercase">COLLECTION • 001</p>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter" style={{ fontFamily: '"Playfair Display", serif' }}>
            The Global <span className="text-gray-300 cursor-pointer">Desi</span> Edit
          </h2>
        </div>
        <p className="text-[10px] font-mono text-gray-400 hidden md:block">TOTAL ITEMS: {allProducts?.length || 0}</p>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-8">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
             <div className="animate-spin h-6 w-6 border-2 border-[#FFD700] border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            {allProducts?.map((product) => (
              <div 
                key={product._id} 
                className="group cursor-pointer space-y-4"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                {/* Image Container */}
                <div className="relative aspect-3/4 overflow-hidden bg-white border border-gray-100 rounded-sm">
                  <img
                    src={product.images?.[0]?.url || 'https://placehold.co/600x800?text=SNITCH+LUXURY'}
                    alt={product.title}
                    className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 text-[8px] font-mono text-white tracking-[0.2em] uppercase">
                    New Drop
                  </div>
                  {/* Subtle Gold Border Hover */}
                  <div className="absolute inset-0 border-0 group-hover:border border-[#FFD700]/30 transition-all duration-300 pointer-events-none" />
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold tracking-tight uppercase group-hover:text-[#FFD700] transition-colors duration-300 truncate max-w-[200px]">
                      {product.title}
                    </h3>
                    <p className="text-xs font-mono font-bold">
                      {product.price?.currency || 'USD'} {product.price?.amount}
                    </p>
                  </div>
                  <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase truncate">
                    {product.seller?.fullName || 'SNITCH EXCLUSIVE'} • LIMITED EDITION
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* No Products State */}
      {!loading && allProducts?.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <p className="text-gray-400 italic text-sm">The house is currently empty. More drops coming soon.</p>
        </div>
      )}
    </div>
  );
};

export default ProductFeed;
