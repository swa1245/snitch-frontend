import React, { useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../../components/Navbar';
import { useProduct } from '../hook/useProduct';

const ProductFeed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedCategory = searchParams.get('category');
  const { allProducts, handleFetchAllProducts, loading } = useProduct();

  useEffect(() => {
    handleFetchAllProducts();
    window.scrollTo(0, 0);
  }, []);

  const [sortBy, setSortBy] = React.useState('default');
  const [activeFilter, setActiveFilter] = React.useState(null);
  const [priceRange, setPriceRange] = React.useState('all');
  const [activeType, setActiveType] = React.useState('all');
  const [activeSize, setActiveSize] = React.useState('any');

  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    let result = [...allProducts];

    // URL Category Filter
    if (selectedCategory) {
      result = result.filter(p =>
        p.category === selectedCategory ||
        p.brandCollection === selectedCategory ||
        p.occasion === selectedCategory
      );
    }

    // Dynamic Product Type Filter
    if (activeType !== 'all') {
      result = result.filter(p => p.category === activeType);
    }

    // Size Filter Logic
    if (activeSize !== 'any') {
      result = result.filter(p =>
        p.variants?.some(v => v.size === activeSize && (v.stock || 0) > 0)
      );
    }

    // Price Range Filter
    if (priceRange === 'under-1500') {
      result = result.filter(p => (p.price?.amount || 0) < 1500);
    } else if (priceRange === '1500-2500') {
      result = result.filter(p => (p.price?.amount || 0) >= 1500 && (p.price?.amount || 0) <= 2500);
    } else if (priceRange === 'above-2500') {
      result = result.filter(p => (p.price?.amount || 0) > 2500);
    }

    // Sorting Logic
    if (sortBy === 'price-low-high') {
      result.sort((a, b) => (a.price?.amount || 0) - (b.price?.amount || 0));
    } else if (sortBy === 'price-high-low') {
      result.sort((a, b) => (b.price?.amount || 0) - (a.price?.amount || 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'az') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (sortBy === 'za') {
      result.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    } else if (sortBy === 'best-selling') {
      result.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
    }

    return result;
  }, [allProducts, selectedCategory, sortBy, priceRange, activeType, activeSize]);
  const [showFitGuide, setShowFitGuide] = React.useState(false);
  const [fitTab, setFitTab] = React.useState('tshirt');

  // Auto-open fit guide if search param is present
  React.useEffect(() => {
    if (searchParams.get('fitguide') === 'true') {
      setShowFitGuide(true);
    }
  }, [searchParams]);

  const FilterDropdown = ({ label, options, value, onChange, filterId, variant = 'filter' }) => {
    const isOpen = activeFilter === filterId;

    return (
      <div className="relative">
        <div
          onClick={() => setActiveFilter(isOpen ? null : filterId)}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <span className={`text-[12px] font-semibold tracking-tight transition-all duration-300 ${isOpen ? 'text-black' : 'text-gray-500 group-hover:text-black'}`}>
            {label}
          </span>
          <motion.svg
            animate={{ rotate: isOpen ? 180 : 0 }}
            className={`w-3 h-3 transition-colors ${isOpen ? 'text-black' : 'text-gray-400 group-hover:text-black'}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </motion.svg>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className={`absolute top-full ${variant === 'sort' ? 'right-0' : 'left-0'} mt-5 w-64 bg-white border border-gray-100 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] z-50 p-3 rounded-[24px]`}
            >
              <div className="flex flex-col gap-0.5">
                {options.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setActiveFilter(null);
                    }}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl cursor-pointer transition-all duration-200 ${value === opt.value ? 'bg-gray-50 text-black' : 'hover:bg-gray-50/80 text-gray-500 hover:text-black'}`}
                  >
                    <div className="w-5 flex items-center justify-center">
                      {value === opt.value && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </motion.svg>
                      )}
                    </div>
                    <span className="text-[13px] font-medium tracking-tight">
                      {opt.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Dynamic Header Content
  const headerContent = useMemo(() => {
    const defaultHeader = {
      title: "ALL COLLECTIONS",
      subtitle: "The definitive archive of Snitch luxury.",
      img: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1920&q=80"
    };

    const configs = {
      'T-shirts': {
        title: "ESSENTIAL TEES",
        subtitle: "Heavyweight fabrics. Unmatched silhouettes.",
        img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1920&q=80"
      },
      'Jeans': {
        title: "DENIM ARCHIVE",
        subtitle: "Luxury Italian selvedge. Forged for character.",
        img: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1920&q=80"
      },
      'Jackets': {
        title: "OUTERWEAR SERIES",
        subtitle: "Technical protection meets high-fashion tailoring.",
        img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1920&q=80"
      },
      'Oversized T-Shirts': {
        title: "OVERSIZED DROP",
        subtitle: "The original boxy silhouette. Heavy 240GSM.",
        img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1920&q=80"
      }
    };

    return configs[selectedCategory] || defaultHeader;
  }, [selectedCategory]);

  if (loading && (!allProducts || allProducts.length === 0)) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-[10px] font-black uppercase tracking-[1em]"
        >
          Loading Collection...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-orange-500 selection:text-white" onClick={() => activeFilter && setActiveFilter(null)}>
      <Navbar />

      {/* Editorial Hero Header */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden flex items-center justify-center pt-20">
        <motion.div
          key={headerContent.img}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img src={headerContent.img} className="w-full h-full object-cover grayscale-[0.3]" alt="Category Hero" />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-white" />
        </motion.div>

        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="backdrop-blur-md bg-white/10 p-8 md:p-12 border border-white/20 rounded-sm inline-block"
          >
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-4">
              {headerContent.title}
            </h1>
            <div className="w-20 h-1 bg-orange-500 mx-auto mb-6" />
            <p className="text-white/80 text-sm md:text-lg font-medium tracking-widest uppercase">
              {headerContent.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Stats Bar - Retail Professional Style */}
      <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100 py-4 px-8" onClick={(e) => e.stopPropagation()}>
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex gap-10 items-center">
            <FilterDropdown
              label="Price"
              filterId="price"
              value={priceRange}
              onChange={setPriceRange}
              options={[
                { label: 'All Prices', value: 'all' },
                { label: 'Under ₹1500', value: 'under-1500' },
                { label: '₹1500 - ₹2500', value: '1500-2500' },
                { label: 'Above ₹2500', value: 'above-2500' }
              ]}
            />
            <FilterDropdown
              label="Product type"
              filterId="type"
              value={activeType}
              onChange={setActiveType}
              options={[
                { label: 'All Types', value: 'all' },
                { label: 'T-shirts', value: 'T-shirts' },
                { label: 'Jeans', value: 'Jeans' },
                { label: 'Hoodies', value: 'Hoodies' },
                { label: 'Jackets', value: 'Jackets' }
              ]}
            />
            <FilterDropdown
              label="Size"
              filterId="size"
              value={activeSize}
              onChange={setActiveSize}
              options={[
                { label: 'All Sizes', value: 'any' },
                { label: 'Extra Small (XS)', value: 'XS' },
                { label: 'Small (S)', value: 'S' },
                { label: 'Medium (M)', value: 'M' },
                { label: 'Large (L)', value: 'L' },
                { label: 'Extra Large (XL)', value: 'XL' },
                { label: 'Double Extra Large (XXL)', value: 'XXL' }
              ]}
            />
            <div className="w-px h-4 bg-gray-100 mx-2" />
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowFitGuide(true);
              }}
              className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors underline underline-offset-4 decoration-gray-200 hover:decoration-black"
            >
              Fit Guide
            </button>
          </div>

          <div className="flex items-center gap-10">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">{filteredProducts.length} items</span>
            <FilterDropdown
              label="Sort"
              filterId="sort"
              variant="sort"
              value={sortBy}
              onChange={setSortBy}
              options={[
                { label: 'Featured', value: 'default' },
                { label: 'Most relevant', value: 'relevant' },
                { label: 'Best selling', value: 'best-selling' },
                { label: 'Alphabetically, A-Z', value: 'az' },
                { label: 'Alphabetically, Z-A', value: 'za' },
                { label: 'Price, low to high', value: 'price-low-high' },
                { label: 'Price, high to low', value: 'price-high-low' },
                { label: 'Date, old to new', value: 'oldest' },
                { label: 'Date, new to old', value: 'newest' }
              ]}
            />
            <div className="flex gap-1">
              <div className="w-4 h-4 border border-black grid grid-cols-2 gap-0.5 p-0.5 opacity-100">
                {[...Array(4)].map((_, i) => <div key={i} className="bg-black" />)}
              </div>
              <div className="w-4 h-4 border border-gray-200 grid grid-cols-3 gap-0.5 p-0.5 opacity-40">
                {[...Array(9)].map((_, i) => <div key={i} className="bg-gray-200" />)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid - High Fidelity Cards */}
      <main className="max-w-[1600px] mx-auto py-12 px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-12"
          >
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % 5) * 0.05 }}
                viewport={{ once: true }}
                className="group cursor-pointer flex flex-col"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <div className="relative aspect-3/4 bg-[#f6f6f6] mb-4 overflow-hidden rounded-sm">
                  <img
                    src={product.images?.[0]?.url}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                    alt={product.title}
                  />

                  {/* Badge: Top Left */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-[1px] flex items-center gap-1 shadow-sm">
                    <span className="text-[8px] font-black uppercase tracking-tighter">New Arrival</span>
                    <span className="text-[8px]">🚀</span>
                  </div>

                  {/* Badge: Top Right */}
                  <div className="absolute top-3 right-3 text-right">
                    <p className="text-[9px] font-black uppercase leading-tight tracking-tighter text-black/80">
                      {product.brandCollection?.split(' ').join('\n') || 'SNITCH\nORIGINAL'}
                    </p>
                  </div>

                  {/* Quick Add Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button className="w-full bg-black text-white py-2 text-[10px] font-bold uppercase tracking-widest shadow-2xl hover:bg-orange-500 transition-colors">
                      + Quick Add
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-[11px] font-medium text-gray-600 uppercase tracking-tight truncate leading-tight">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-[12px] font-black tracking-tight text-black">
                      ₹{product.price?.amount || '0.00'}
                    </p>
                    <p className="text-[10px] font-bold text-gray-300 line-through">
                      ₹{Math.round((product.price?.amount || 0) * 1.5)}
                    </p>
                  </div>

                  {/* Size Bubbles with Clear Visibility for All States */}
                  <div className="flex gap-2 pt-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => {
                      const isAvailable = product.variants?.some(v => v.size === size && (v.stock || 0) > 0);

                      return (
                        <div
                          key={size}
                          className={`relative w-8 h-6 flex items-center justify-center border text-[10px] font-bold transition-all rounded-[1px] ${isAvailable
                              ? 'border-gray-300 text-black group-hover:border-black'
                              : 'border-gray-200 text-gray-400'
                            }`}
                        >
                          {size}
                          {!isAvailable && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="w-[120%] h-px bg-gray-500 rotate-45" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredProducts.length === 0 && (
          <div className="py-40 text-center">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-gray-200">No Items Found</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4">Try checking another collection</p>
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="border-t border-gray-100 py-20 px-8 bg-gray-50/30">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h2 className="text-8xl md:text-[12rem] font-black text-gray-100 uppercase tracking-tighter leading-none pointer-events-none mb-10">SNITCH</h2>
          <div className="flex gap-12">
            {['Instagram', 'Support'].map(item => (
              <a key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* Global Fit Guide Modal - High Priority Rendering */}
      <AnimatePresence>
        {showFitGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-9999 flex items-center justify-center p-4 md:p-8"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFitGuide(false)} />
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter">Technical Fit Guide</h2>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Master the Snitch Silhouette</p>
                  </div>
                </div>
                <button onClick={() => setShowFitGuide(false)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="flex flex-col md:flex-row h-full max-h-[70vh] overflow-y-auto">
                {/* Left Side: The Blueprint */}
                <div className="flex-1 p-8 bg-gray-50/50 border-r border-gray-100">
                  <div className="flex gap-2 mb-8">
                    {['tshirt', 'jeans'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setFitTab(tab)}
                        className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${fitTab === tab ? 'bg-black text-white' : 'bg-white border border-gray-100 text-gray-400'}`}
                      >
                        {tab === 'tshirt' ? 'T-Shirt Blueprint' : 'Denim Blueprint'}
                      </button>
                    ))}
                  </div>

                  {/* SVG Technical Drawing */}
                  <div className="aspect-square bg-white rounded-2xl border border-gray-100 p-8 flex items-center justify-center relative mb-8">
                    {fitTab === 'tshirt' ? (
                      <svg className="w-full h-full max-w-[280px]" viewBox="0 0 200 200" fill="none">
                        <path d="M40 50L60 30H140L160 50V90L140 80V170H60V80L40 90V50Z" stroke="black" strokeWidth="2" strokeLinejoin="round" />
                        <line x1="60" y1="80" x2="140" y2="80" stroke="#FF5722" strokeWidth="1.5" strokeDasharray="4 4" />
                        <text x="145" y="83" className="text-[10px] font-black" fill="#FF5722">A</text>
                        <line x1="100" y1="30" x2="100" y2="170" stroke="#FF5722" strokeWidth="1.5" strokeDasharray="4 4" />
                        <text x="105" y="150" className="text-[10px] font-black" fill="#FF5722">B</text>
                        <line x1="40" y1="50" x2="160" y2="50" stroke="#FF5722" strokeWidth="1.5" strokeDasharray="4 4" />
                        <text x="165" y="53" className="text-[10px] font-black" fill="#FF5722">C</text>
                      </svg>
                    ) : (
                      <svg className="w-full h-full max-w-[280px]" viewBox="0 0 200 200" fill="none">
                        <path d="M60 30H140L150 170H110L100 80L90 170H50L60 30Z" stroke="black" strokeWidth="2" strokeLinejoin="round" />
                        <line x1="60" y1="35" x2="140" y2="35" stroke="#FF5722" strokeWidth="1.5" strokeDasharray="4 4" />
                        <text x="145" y="38" className="text-[10px] font-black" fill="#FF5722">A</text>
                        <line x1="100" y1="30" x2="110" y2="170" stroke="#FF5722" strokeWidth="1.5" strokeDasharray="4 4" />
                        <text x="115" y="150" className="text-[10px] font-black" fill="#FF5722">B</text>
                        <line x1="110" y1="80" x2="150" y2="80" stroke="#FF5722" strokeWidth="1.5" strokeDasharray="4 4" />
                        <text x="155" y="83" className="text-[10px] font-black" fill="#FF5722">C</text>
                      </svg>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-black">How to Measure</h3>
                    <div className="space-y-3">
                      {fitTab === 'tshirt' ? (
                        <>
                          <div className="flex gap-3"><span className="text-orange-500 font-black">A</span><p className="text-[11px] text-gray-500 leading-relaxed"><span className="text-black font-bold">Chest:</span> Measure around the fullest part of your chest, keeping the tape horizontal.</p></div>
                          <div className="flex gap-3"><span className="text-orange-500 font-black">B</span><p className="text-[11px] text-gray-500 leading-relaxed"><span className="text-black font-bold">Length:</span> Measure from the highest point of the shoulder down to the bottom hem.</p></div>
                          <div className="flex gap-3"><span className="text-orange-500 font-black">C</span><p className="text-[11px] text-gray-500 leading-relaxed"><span className="text-black font-bold">Shoulder:</span> Measure from one shoulder point to the other across the back.</p></div>
                        </>
                      ) : (
                        <>
                          <div className="flex gap-3"><span className="text-orange-500 font-black">A</span><p className="text-[11px] text-gray-500 leading-relaxed"><span className="text-black font-bold">Waist:</span> Measure around your natural waistline where you wear your pants.</p></div>
                          <div className="flex gap-3"><span className="text-orange-500 font-black">B</span><p className="text-[11px] text-gray-500 leading-relaxed"><span className="text-black font-bold">Length:</span> Measure from the waist down to the bottom of the leg.</p></div>
                          <div className="flex gap-3"><span className="text-orange-500 font-black">C</span><p className="text-[11px] text-gray-500 leading-relaxed"><span className="text-black font-bold">Thigh:</span> Measure around the fullest part of your thigh.</p></div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side: The Data */}
                <div className="flex-1 p-8">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-black mb-6">Size Matrix (Inches)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b-2 border-black">
                          <th className="py-3 text-[10px] font-black uppercase tracking-widest">Size</th>
                          <th className="py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">A</th>
                          <th className="py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">B</th>
                          <th className="py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">C</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(fitTab === 'tshirt' ? [
                          { s: 'XS', a: '38', b: '26', c: '17' },
                          { s: 'S', a: '40', b: '27', c: '18' },
                          { s: 'M', a: '42', b: '28', c: '19' },
                          { s: 'L', a: '44', b: '29', c: '20' },
                          { s: 'XL', a: '46', b: '30', c: '21' },
                          { s: 'XXL', a: '48', b: '31', c: '22' }
                        ] : [
                          { s: '28', a: '28', b: '32', c: '22' },
                          { s: '30', a: '30', b: '32', c: '23' },
                          { s: '32', a: '32', b: '33', c: '24' },
                          { s: '34', a: '34', b: '33', c: '25' },
                          { s: '36', a: '36', b: '34', c: '26' }
                        ]).map(r => (
                          <tr key={r.s} className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors">
                            <td className="py-4 text-[12px] font-black">{r.s}</td>
                            <td className="py-4 text-[12px] font-medium text-center">{r.a}</td>
                            <td className="py-4 text-[12px] font-medium text-center">{r.b}</td>
                            <td className="py-4 text-[12px] font-medium text-center">{r.c}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-12 p-6 bg-black text-white rounded-2xl">
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-2">Pro Tip</h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed">For our signature <span className="text-white">Oversized Fit</span>, we recommend choosing your regular size. If you prefer a standard tailored look, consider sizing down.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductFeed;
