import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hook/useCart';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../../components/Navbar';

const Cart = () => {
  const navigate = useNavigate();
  const { items, loading, updatingItemId, handleFetchCart, handleRemoveFromCart, handleUpdateQuantity } = useCart();

  useEffect(() => {
    handleFetchCart();
  }, []);

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      if (!item.product || typeof item.product !== 'object') return total;
      const variant = item.variantIndex !== undefined ? item.product.variants?.[item.variantIndex] : null;
      const price = variant?.price?.amount || item.product.price?.amount || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        <div className="animate-spin h-6 w-6 border-2 border-black border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] pt-32 pb-20 px-6 md:px-12 selection:bg-black selection:text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 border-b border-gray-100 pb-8 flex justify-between items-end">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.5em] mb-4 italic">Your Cart</p>
            <h1 className="text-6xl font-black italic tracking-tighter uppercase" style={{ fontFamily: '"Playfair Display", serif' }}>
              The Cart
            </h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.3em]">Items</p>
            <p className="text-2xl font-bold tracking-tighter">{items.length}</p>
          </div>
        </header>

        {items.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-400 italic mb-8 uppercase tracking-widest text-[10px]">Your collection is empty</p>
            <button 
              onClick={() => navigate('/shop')}
              className="text-[10px] font-mono uppercase tracking-[0.4em] border-b border-black pb-1 hover:tracking-[0.6em] transition-all duration-500"
            >
              Explore Objects
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-12">
              <AnimatePresence mode="popLayout">
                {items.map((item, idx) => {
                  const product = item.product;
                  if (!product) return null;
                  
                  const isPopulated = typeof product === 'object' && product._id;
                  const productId = isPopulated ? product._id : product;
                  const itemKey = productId + (item.variantIndex || '');
                  const isUpdating = updatingItemId === itemKey;
                  
                  const variant = (isPopulated && item.variantIndex !== undefined) ? product.variants?.[item.variantIndex] : null;
                  const displayImage = variant?.images?.[0]?.url || (isPopulated ? product.images?.[0]?.url : 'https://placehold.co/400x600?text=SYNCING');
                  const price = variant?.price?.amount || (isPopulated ? product.price?.amount : 0);
                  const currency = variant?.price?.currency || (isPopulated ? product.price?.currency : 'USD');
                  const attrs = variant?.attributes;
                  const attrsObj = attrs instanceof Map ? Object.fromEntries(attrs) : attrs;

                  return (
                    <motion.div 
                      key={`${productId}-${item.variantIndex || 'base'}-${idx}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`flex gap-8 group ${isUpdating ? 'opacity-50 pointer-events-none' : ''} transition-opacity duration-300`}
                    >
                      <div className="w-32 h-44 bg-[#F5F5F7] overflow-hidden rounded-sm shrink-0 shadow-sm transition-transform duration-500 group-hover:scale-[1.02]">
                        <img src={displayImage} alt={isPopulated ? product.title : 'Product'} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" />
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between py-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[8px] font-mono text-gray-400 uppercase tracking-widest mb-1">Serial NO: SN-{(productId || '').toString().slice(-6).toUpperCase()}</p>
                            <h3 className="text-xl font-bold uppercase tracking-tight mb-2">
                              {isPopulated ? product.title : (
                                <span className="animate-pulse text-gray-300 italic">Syncing...</span>
                              )}
                            </h3>
                            {variant && (
                              <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                                {attrsObj?.color && `Color: ${attrsObj.color}`} {attrsObj?.size && `| Size: ${attrsObj.size}`}
                              </p>
                            )}
                          </div>
                          <button 
                            onClick={() => handleRemoveFromCart(productId, item.variantIndex)}
                            className="text-[9px] font-mono text-gray-300 hover:text-black uppercase tracking-widest transition-colors"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="flex justify-between items-end">
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => handleUpdateQuantity(productId, item.variantIndex, Math.max(1, item.quantity - 1))}
                              disabled={isUpdating}
                              className="w-8 h-8 flex items-center justify-center border border-gray-100 hover:border-black disabled:border-gray-50 transition-all text-xs"
                            >
                              -
                            </button>
                            <div className="relative">
                              <span className={`text-[10px] font-mono font-bold w-4 text-center transition-opacity ${isUpdating ? 'opacity-20' : 'opacity-100'}`}>
                                {item.quantity}
                              </span>
                              {isUpdating && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-2 h-2 border border-black border-t-transparent rounded-full animate-spin" />
                                </div>
                              )}
                            </div>
                            <button 
                              onClick={() => handleUpdateQuantity(productId, item.variantIndex, item.quantity + 1)}
                              disabled={isUpdating}
                              className="w-8 h-8 flex items-center justify-center border border-gray-100 hover:border-black disabled:border-gray-50 transition-all text-xs"
                            >
                              +
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-[8px] font-mono text-gray-400 uppercase mb-1">Unit Price</p>
                            <p className="text-lg font-black tracking-tight">{currency} {price}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="relative">
              <div className="sticky top-40 bg-[#F9F9F9] p-8 rounded-sm space-y-8">
                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.4em] font-bold italic">Order Protocol</p>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] uppercase tracking-widest text-gray-500">Subtotal</span>
                    <span className="text-sm font-bold">USD {calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] uppercase tracking-widest text-gray-500">Shipping</span>
                    <span className="text-[10px] font-mono uppercase">Complimentary</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200 flex justify-between items-end">
                    <span className="text-[10px] font-bold uppercase tracking-widest">Total Valuation</span>
                    <span className="text-2xl font-black tracking-tighter">USD {calculateTotal()}</span>
                  </div>
                </div>

                <button className="w-full bg-[#1A1A1A] hover:bg-black text-white font-extrabold text-[11px] uppercase tracking-[0.5em] py-5 transition-all duration-500 hover:tracking-[0.7em] active:scale-[0.98] shadow-xl rounded-sm">
                  Proceed to Checkout
                </button>

                <p className="text-[8px] font-mono text-gray-400 uppercase leading-relaxed text-center">
                  By proceeding, you agree to our tailoring protocols and digital dharma.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
