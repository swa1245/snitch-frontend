import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import { motion } from 'framer-motion';
import { useProduct } from '../hook/useProduct';
import { getCategories } from '../services/category.api';

// Import assets for hero sections
import closetHero from '../../../assets/closet_hero.png';
import fieryHero from '../../../assets/fiery_hero.png';

// Import fallback assets if needed
import prodOversized from '../../../assets/prod_oversized.png';
import prodJoggers from '../../../assets/prod_joggers.png';
import prodJacket from '../../../assets/prod_jacket.png';

const Dashboard = () => {
  const navigate = useNavigate();
  const { allProducts, handleFetchAllProducts, loading: productsLoading } = useProduct();

  const [categories, setCategories] = React.useState([]);
  const [vibes, setVibes] = React.useState([]);
  const [collections, setCollections] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchLayoutData = async () => {
      setLoading(true);
      try {
        const [catData, vibeData, collData] = await Promise.all([
          getCategories('category'),
          getCategories('vibe'),
          getCategories('collection')
        ]);
        setCategories(catData);
        setVibes(vibeData);
        setCollections(collData);
        handleFetchAllProducts();
      } catch (error) {
        console.error("Failed to fetch layout data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLayoutData();
  }, []);

  if (loading || (productsLoading && (!allProducts || allProducts.length === 0))) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-sm font-black uppercase tracking-[0.5em] italic"
        >
          Snitch Luxury...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-orange-500 selection:text-white pt-36">
      <Navbar />

      {/* Category Icons Row - Dynamic from Backend */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto flex justify-center gap-12 md:gap-24 px-4 overflow-x-auto overflow-y-hidden scrollbar-hide">
          {categories.map((cat, i) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center gap-5 group cursor-pointer"
              onClick={() => navigate(`/shop?category=${cat.name}`)}
            >
              <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full p-1 border border-gray-100 group-hover:border-orange-500 transition-all duration-500 shadow-xl overflow-hidden bg-white">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img src={cat.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={cat.name} />
                </div>
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 group-hover:text-black group-hover:tracking-[0.4em] transition-all duration-300">{cat.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Hero 1: Match-Ready Fits */}
      <section className="relative h-[600px] overflow-hidden">
        <img src={closetHero} className="w-full h-full object-cover" alt="Closet Hero" />
        <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-center p-6">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-4 drop-shadow-2xl"
          >
            MATCH-READY FITS
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white text-xl md:text-2xl font-medium mb-8 drop-shadow-lg"
          >
            Your size won't wait till the last over
          </motion.p>
          <motion.button
            onClick={() => navigate('/shop')}
            className="bg-white text-black px-10 py-3 rounded-md font-black uppercase text-sm shadow-xl hover:bg-orange-500 hover:text-white transition-all cursor-pointer"
          >
            Get Match Ready
          </motion.button>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-20 px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <h3 className="text-2xl font-black uppercase tracking-tighter">New Inn 🚀</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(allProducts?.slice(0, 4) || []).map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <div className="relative aspect-3/4 bg-gray-100 mb-4 overflow-hidden rounded-sm">
                <img
                  src={product.images?.[0]?.url}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  alt={product.title}
                />
                <div className="absolute top-3 left-3 bg-white px-2 py-0.5 text-[8px] font-bold uppercase rounded-sm border border-gray-100">
                  New Arrival
                </div>
              </div>
              <h4 className="text-[11px] font-bold uppercase truncate mb-1">{product.title}</h4>
              <p className="text-[10px] font-black text-gray-900">₹{product.price?.amount || '0.00'}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Infinite Occasion Slider - Dynamic from Backend */}
      <section className="py-20 bg-gray-50/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 mb-10">
          <h3 className="text-3xl font-black uppercase tracking-tighter">Shop By Vibe</h3>
          <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-2">Continuous Collection Loop</p>
        </div>

        <div className="relative flex overflow-hidden">
          <motion.div
            className="flex gap-4 px-4 whitespace-nowrap animate-vibe-loop"
            animate={{ x: [0, -1000] }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {[...Array(2)].map((_, idx) => (
              <React.Fragment key={idx}>
                {vibes.map((vibe, i) => (
                  <motion.div
                    key={`${idx}-${vibe._id}`}
                    className="relative min-w-[300px] md:min-w-[400px] aspect-4/5 overflow-hidden group rounded-sm shadow-xl cursor-pointer"
                    onClick={() => navigate(`/shop?category=${vibe.name}`)}
                  >
                    <img src={vibe.imageUrl} className="w-full h-full object-cover grayscale-[0.2]" alt={vibe.name} />
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent flex flex-col items-center justify-end p-10 text-center">
                      <p className="text-white text-3xl font-black uppercase tracking-tighter leading-none mb-1 group-hover:text-orange-500 transition-colors">{vibe.name}</p>
                      <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.4em]">{vibe.description || 'Curated'}</p>
                      <div className="w-10 h-px bg-gray-300 mb-1" />
                    </div>
                  </motion.div>
                ))}
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Hero 2: Forged In Fire */}
      <section className="relative h-[500px] overflow-hidden my-10">
        <img src={fieryHero} className="w-full h-full object-cover" alt="Fiery Hero" />
        <div className="absolute inset-0 bg-linear-to-r from-black/60 to-transparent flex flex-col items-start justify-center p-12 md:p-24">
          <motion.h2
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-4"
          >
            FORGED IN FIRE
          </motion.h2>
          <motion.p
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white text-xl md:text-2xl font-medium mb-8"
          >
            Fall. Burn. Come back stronger
          </motion.p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-orange-500 text-white px-10 py-3 rounded-md font-black uppercase text-sm shadow-xl hover:bg-white hover:text-black transition-all"
          >
            Explore The Drop
          </button>
        </div>
      </section>

      {/* Shop By Collection - Dynamic from Backend */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h3 className="text-center text-2xl font-black uppercase tracking-tighter mb-12">Shop By Collection</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.slice(0, 3).map((col, i) => (
            <div
              key={col._id}
              className="relative aspect-square overflow-hidden group cursor-pointer rounded-sm border border-gray-100 shadow-sm"
              onClick={() => navigate(`/shop?category=${col.name}`)}
            >
              <img src={col.imageUrl} className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] group-hover:scale-110 transition-transform duration-1000" alt={col.name} />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-end p-12 text-center z-10">
                <h4 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">{col.name}</h4>
                <p className="text-[10px] text-white font-bold uppercase tracking-[0.3em] border-b border-white pb-1">{col.description || 'Exclusive'}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <h1 className="text-2xl font-black tracking-tighter uppercase italic">Snitch</h1>
            <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">© 2026 SNITCH LUXURY • ALL RIGHTS RESERVED</p>
          </div>
          <div className="flex gap-8">
            {['Instagram', 'WhatsApp', 'Support'].map((item) => (
              <a key={item} href="#" className="text-[10px] font-bold text-gray-500 hover:text-black uppercase tracking-[0.2em] transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes vibe-loop {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-vibe-loop {
          animation: vibe-loop 40s linear infinite;
        }
        .animate-vibe-loop:hover {
          animation-play-state: paused;
        }
      `}} />
    </div>
  );
};

export default Dashboard;
