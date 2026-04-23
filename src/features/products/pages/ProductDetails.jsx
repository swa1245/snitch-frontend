import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../hook/useProduct';
import { useCart } from '../../cart/hook/useCart';
import Navbar from '../../../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../../components/Toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { productDetails, loading, handleFetchProductDetails } = useProduct();
  const { handleAddToCart } = useCart();
  const { showToast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const onAddToCart = async () => {
    setIsAdding(true);
    const variantIndex = productDetails.variants?.indexOf(selectedVariant);
    try {
      await handleAddToCart(id, variantIndex !== -1 ? variantIndex : undefined);
      showToast('Product added to your selection successfully', 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to add product to cart. Please try again.', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    if (id) {
      handleFetchProductDetails(id);
    }
  }, [id]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedVariant]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7]">
        <div className="animate-spin h-6 w-6 border-2 border-[#FFD700] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!productDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F7]">
        <p className="text-gray-400 italic mb-4 uppercase tracking-widest text-[10px]">Asset Offline</p>
        <button onClick={() => navigate('/shop')} className="text-[10px] font-mono uppercase tracking-[0.4em] border-b border-black pb-1">Return to House</button>
      </div>
    );
  }

  const images = (selectedVariant?.images && selectedVariant.images.length > 0)
    ? selectedVariant.images
    : (productDetails.images && productDetails.images.length > 0
      ? productDetails.images
      : [{ url: 'https://placehold.co/800x1200?text=SNITCH+PRODUCT' }]);


  const currentPrice = selectedVariant?.price?.amount || productDetails.price?.amount;
  const currentCurrency = selectedVariant?.price?.currency || productDetails.price?.currency || 'USD';
  const currentStock = selectedVariant ? selectedVariant.stock : 'Limited';

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] font-sans pt-24 selection:bg-black selection:text-white">
      <Navbar />

      {/* Floating Back Button */}
      <button
        onClick={() => (window.history.length > 2 ? navigate(-1) : navigate('/shop'))}
        className="fixed top-28 left-6 md:left-12 z-50 group flex items-center gap-4 text-gray-400 hover:text-black transition-all cursor-pointer"
      >
        <span className="w-8 h-px bg-gray-200 group-hover:w-12 group-hover:bg-black transition-all duration-500" />
        <span className="text-[9px] font-mono uppercase tracking-[0.4em]">Back</span>
      </button>

      {/* Main Layout */}
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row min-h-screen">

        {/* Left Column: Visual Manifest (Scrollable) */}
        <div className="lg:w-1/2 p-6 md:p-12 lg:pr-12 space-y-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-3 mb-10 text-[8px] font-mono text-gray-400 uppercase tracking-[0.3em]">
            <span className="cursor-pointer hover:text-black uppercase tracking-widest" onClick={() => navigate('/')}>Home</span>
            <span>/</span>
            <span className="cursor-pointer hover:text-black uppercase tracking-widest" onClick={() => navigate('/shop')}>Shop</span>
            <span>/</span>
            <span className="text-black font-bold uppercase tracking-widest">{productDetails.title}</span>
          </nav>

          <div className="grid grid-cols-1 gap-6 max-w-[650px] mx-auto lg:ml-auto lg:mr-0">
            {/* Primary Visual Slider */}
            <div className="aspect-3/2 bg-[#F5F5F7] overflow-hidden rounded-sm group relative max-h-[380px] shadow-sm">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={images[currentIndex]?.url || images[0]?.url}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: "anticipate" }}
                  className="w-full h-full object-cover grayscale-[0.2]"
                />
              </AnimatePresence>

              {/* Navigation Controls */}
              <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <button
                  onClick={prevImage}
                  className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white pointer-events-auto hover:bg-[#FFD700] hover:text-black transition-all"
                >
                  ←
                </button>
                <button
                  onClick={nextImage}
                  className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white pointer-events-auto hover:bg-[#FFD700] hover:text-black transition-all"
                >
                  →
                </button>
              </div>

              {/* Index Indicator */}
              <div className="absolute bottom-4 right-8 mix-blend-difference">
                <p className="text-[10px] font-mono text-white/50 tracking-[0.5em] uppercase">
                  {currentIndex + 1} / {images.length}
                </p>
              </div>
            </div>

            {/* Secondary Visuals - Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 pt-2">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`shrink-0 w-24 aspect-3/2 bg-[#F5F5F7] overflow-hidden rounded-sm cursor-pointer transition-all duration-500 ${currentIndex === idx ? 'ring-1 ring-[#FFD700] ring-offset-2 scale-[1.05]' : 'opacity-40 hover:opacity-100'}`}
                  >
                    <img src={img.url} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Protocol & Utility (Sticky) */}
        <div className="lg:w-1/2 lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] p-6 md:p-12 lg:pl-12 overflow-y-auto no-scrollbar">
          <div className="max-w-md space-y-12">

            {/* Header Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="bg-black text-white px-2 py-0.5 text-[7px] font-bold uppercase tracking-widest">Desi Luxury</span>
                <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Serial No: SN-{(id || '').toString().slice(-6).toUpperCase()}</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter leading-[0.85] text-pretty" style={{ fontFamily: '"Playfair Display", serif' }}>
                {productDetails.title}
              </h1>

              <div className="flex items-end justify-between border-b-2 border-black pb-8">
                <div className="space-y-1">
                  <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Valuation</p>
                  <p className="text-4xl font-black tracking-tighter">
                    {currentCurrency} {currentPrice}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-[#FFD700] uppercase tracking-widest">
                    {selectedVariant ? (selectedVariant.stock > 0 ? 'In Stock' : 'Out of Stock') : 'Limited Stock'}
                  </p>
                  <p className="text-[8px] font-mono text-gray-300 uppercase">
                    {typeof currentStock === 'number' ? `${currentStock} Units Available` : 'Limited Quantity'}
                  </p>
                </div>
              </div>
            </div>

            {/* Variant Selection */}
            {productDetails.variants?.length > 0 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.4em] font-bold italic">Select Configuration</p>
                  <div className="grid grid-cols-2 gap-4">
                    {productDetails.variants.map((variant, idx) => {
                      const attrs = variant.attributes instanceof Map ? Object.fromEntries(variant.attributes) : variant.attributes;
                      const isSelected = selectedVariant === variant;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedVariant(isSelected ? null : variant)}
                          className={`flex flex-col items-start p-4 border transition-all duration-500 rounded-sm ${isSelected ? 'border-black bg-black text-white shadow-xl scale-[1.02]' : 'border-gray-200 bg-white hover:border-black'
                            }`}
                        >
                          <span className="text-[10px] font-bold uppercase tracking-widest mb-1">
                            {attrs.color || 'Standard'} / {attrs.size || 'N/A'}
                          </span>
                          <span className={`text-[8px] font-mono uppercase tracking-[0.2em] ${isSelected ? 'text-[#FFD700]' : 'text-gray-400'}`}>
                            {variant.price?.amount ? `${variant.price.currency} ${variant.price.amount}` : 'Base Pricing'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Narrative */}
            <div className="space-y-4">
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.4em] font-bold italic">The Narrative</p>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                {productDetails.description}
              </p>
            </div>

            {/* Action Protocol */}
            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                <button
                  disabled={selectedVariant && selectedVariant.stock === 0}
                  className="w-full bg-[#1A1A1A] hover:bg-black text-white font-extrabold text-[11px] uppercase tracking-[0.5em] py-6 transition-all duration-500 hover:tracking-[0.7em] active:scale-[0.98] shadow-2xl brand-font rounded-sm relative group overflow-hidden disabled:opacity-50 disabled:grayscale cursor-pointer"
                >
                  <span className="relative z-10">
                    {selectedVariant && selectedVariant.stock === 0 ? 'Unit Offline' : 'BUY NOW'}
                  </span>
                  <div className="absolute inset-0 bg-[#FFD700]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </button>

                <button 
                  onClick={onAddToCart}
                  disabled={isAdding}
                  className="w-full border-2 border-black hover:bg-black hover:text-white text-black font-extrabold text-[11px] uppercase tracking-[0.5em] py-5 transition-all duration-500 active:scale-[0.98] brand-font rounded-sm cursor-pointer"
                >
                  {isAdding ? 'Adding...' : 'ADD TO CART'}
                </button>
              </div>

              <div className="pt-6 grid grid-cols-2 gap-8 border-t border-gray-100">
                <div className="space-y-2">
                  <p className="text-[8px] font-mono text-gray-400 uppercase">Provider</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest">{productDetails.seller?.fullName || 'SNITCH HOUSE'}</p>
                </div>
                <div className="space-y-2 text-right">
                  <p className="text-[8px] font-mono text-gray-400 uppercase">Origin</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest">BHARAT NETWORK</p>
                </div>
              </div>
            </div>

            {/* Protocols Accordion */}
            <div className="space-y-0 border-y border-gray-100 divide-y divide-gray-100">
              {['Material Composition', 'Tailoring Protocol', 'Digital Dharma'].map((item) => (
                <div key={item} className="py-4 flex items-center justify-between group cursor-pointer">
                  <span className="text-[10px] font-mono text-gray-400 group-hover:text-black uppercase tracking-[0.3em] transition-colors">{item}</span>
                  <span className="text-xs text-gray-300 group-hover:text-black transition-colors">+</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};

export default ProductDetails;
