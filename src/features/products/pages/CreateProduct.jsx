import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '../hook/useProduct';

const CreateProduct = () => {
  const navigate = useNavigate();
  const { handleCreateProduct, loading, error, createSuccess } = useProduct();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceAmount: '',
    priceCurrency: 'USD',
  });
  const [previews, setPreviews] = useState([]);
  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    const urls = selected.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  };

  const handleRemoveImage = (idx) => {
    const newFiles = files.filter((_, i) => i !== idx);
    const newPreviews = previews.filter((_, i) => i !== idx);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', formData.title);
    fd.append('description', formData.description);
    fd.append('priceAmount', formData.priceAmount);
    fd.append('priceCurrency', formData.priceCurrency);
    files.forEach((f) => fd.append('image', f));
    const result = await handleCreateProduct(fd);
    if (result) {
      navigate('/seller/products');
    }
  };

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
        <p className="text-[10px] font-mono text-gray-400 tracking-[0.3em] uppercase">
          MOD: CR-PROD
        </p>
      </header>

      <main className="pt-28 pb-20 px-6 md:px-16 lg:px-28 max-w-3xl mx-auto">
        <div className="space-y-4 mb-14">
          <h2 className="text-4xl font-bold tracking-tight flex items-center gap-4 text-[#FFD700]" style={{ fontFamily: '"Playfair Display", serif' }}>
            New Drop
            <span className="h-px grow bg-gray-200" />
          </h2>
          <p className="text-gray-500 text-sm tracking-wide">
            List your next exclusive on the Snitch marketplace.
          </p>
        </div>

        {error && (
          <div className="mb-8 px-4 py-3 border border-red-500/30 bg-red-50/50 text-red-600 text-xs font-mono tracking-widest uppercase">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10 bg-white p-8 md:p-12 shadow-sm rounded-sm">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-[9px] font-sans font-medium tracking-[0.3em] text-[#FFD700] uppercase">
              Product Title
            </label>
            <input
              name="title"
              type="text"
              required
              placeholder="E.G. OVERSIZED KURTA DROP 001"
              className="w-full bg-transparent border-b border-gray-200 py-3 text-sm focus:outline-none focus:border-black transition-colors placeholder:text-gray-400 uppercase font-medium text-black"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[9px] font-sans font-medium tracking-[0.3em] text-[#FFD700] uppercase">
              Description
            </label>
            <textarea
              name="description"
              required
              rows={6}
              placeholder="TELL THE STORY BEHIND THIS DROP..."
              className="w-full bg-transparent border-b border-gray-200 py-3 text-sm focus:outline-none focus:border-black transition-colors placeholder:text-gray-400 uppercase font-medium resize-none text-black"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Price */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <label className="text-[9px] font-sans font-medium tracking-[0.3em] text-[#FFD700] uppercase">
                Price
              </label>
              <input
                name="priceAmount"
                type="number"
                required
                min="1"
                placeholder="999"
                className="w-full bg-transparent border-b border-gray-200 py-3 text-sm focus:outline-none focus:border-black transition-colors placeholder:text-gray-400 font-medium text-black"
                value={formData.priceAmount}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-sans font-medium tracking-[0.3em] text-[#FFD700] uppercase">
                Currency
              </label>
              <select
                name="priceCurrency"
                className="w-full bg-gray-50 border-b border-gray-200 py-3 text-sm focus:outline-none focus:border-black transition-colors font-medium text-black appearance-none cursor-pointer px-2"
                value={formData.priceCurrency}
                onChange={handleChange}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-3">
            <label className="text-[9px] font-sans font-medium tracking-[0.3em] text-[#FFD700] uppercase">
              Product Images (max 7)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-gray-300 hover:border-black transition-colors cursor-pointer p-8 flex flex-col items-center justify-center gap-2 group bg-gray-50"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">📸</span>
              <p className="text-[10px] font-mono text-gray-400 tracking-widest uppercase">
                Click to upload images
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                {previews.map((src, idx) => (
                  <div key={idx} className="relative group aspect-square">
                    <img
                      src={src}
                      alt={`preview-${idx}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-black text-white text-[10px] w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 rounded-full"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-6 space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white font-extrabold text-[11px] uppercase tracking-[0.4em] py-4 transition-all duration-500 hover:tracking-[0.6em] active:scale-[0.98] shadow-2xl brand-font disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
            >
              {loading ? 'Uploading Drop...' : 'List Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/seller/products')}
              className="w-full text-gray-400 hover:text-black font-mono text-[10px] uppercase tracking-[0.3em] py-3 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>

      <style>{`
        @keyframes marquee-vertical {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
      `}</style>
    </div>
  );
};

export default CreateProduct;
