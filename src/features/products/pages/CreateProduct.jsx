import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '../hook/useProduct';

const CreateProduct = () => {
  const navigate = useNavigate();
  const { handleCreateProduct, loading, error } = useProduct();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceAmount: '',
    priceCurrency: 'USD',
  });
  const [variants, setVariants] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddVariant = () => {
    setVariants([...variants, { price: { amount: '', currency: formData.priceCurrency }, stock: '', attributes: { size: '', color: '' }, images: [], specificFiles: [] }]);
  };

  const handleRemoveVariant = (idx) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const handleVariantFileUpload = (idx, e) => {
    const selected = Array.from(e.target.files);
    const newVariants = [...variants];
    newVariants[idx].specificFiles = [...(newVariants[idx].specificFiles || []), ...selected];
    setVariants(newVariants);
  };

  const handleRemoveVariantFile = (vIdx, fIdx) => {
    const newVariants = [...variants];
    newVariants[vIdx].specificFiles = newVariants[vIdx].specificFiles.filter((_, i) => i !== fIdx);
    setVariants(newVariants);
  };

  const handleVariantImageToggle = (variantIdx, imageUrl) => {
    const newVariants = [...variants];
    const variantImages = newVariants[variantIdx].images || [];
    if (variantImages.includes(imageUrl)) {
      newVariants[variantIdx].images = variantImages.filter(url => url !== imageUrl);
    } else {
      newVariants[variantIdx].images = [...variantImages, imageUrl];
    }
    setVariants(newVariants);
  };

  const handleVariantChange = (idx, field, value, attributeKey) => {
    const newVariants = [...variants];
    if (field === 'price') {
      newVariants[idx].price.amount = value;
    } else if (field === 'stock') {
      newVariants[idx].stock = value;
    } else if (field === 'attributes') {
      newVariants[idx].attributes[attributeKey] = value;
    }
    setVariants(newVariants);
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
    
    // Process variants to match model (attributes Map)
    // Map preview URLs back to file indices for backend assignment
    const processedVariants = variants.map(v => ({
      ...v,
      price: {
        amount: Number(v.price.amount),
        currency: v.price.currency
      },
      stock: Number(v.stock),
      attributes: v.attributes,
      imageIndices: (v.images || []).map(url => previews.indexOf(url)).filter(idx => idx !== -1)
    }));
    
    fd.append('variants', JSON.stringify(processedVariants));
    
    files.forEach((f) => fd.append('image', f));

    // Append variant-specific files with unique fieldnames
    variants.forEach((v, idx) => {
      if (v.specificFiles && v.specificFiles.length > 0) {
        v.specificFiles.forEach((file) => {
          fd.append(`variant_images_${idx}`, file);
        });
      }
    });

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
          className="text-2xl font-black tracking-tighter uppercase cursor-pointer"
          onClick={() => navigate('/')}
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          Snitch<span className="text-[#FFD700]">.</span>
        </h1>
        <p className="text-[10px] font-mono text-[#FFD700] tracking-[0.4em] uppercase font-bold">
          PRÓTOKOL : DROP
        </p>
      </header>

      <main className="pt-32 pb-20 px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto">
        {/* Editorial Header */}
        <div className="mb-16 space-y-4">
          <p className="text-[10px] font-mono text-[#FFD700] tracking-[0.4em] uppercase font-bold">
            Asset Manifestation
          </p>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter" style={{ fontFamily: '"Playfair Display", serif' }}>
            New Drop
          </h2>
          <div className="h-px w-32 bg-[#FFD700]" />
        </div>

        {error && (
          <div className="mb-8 px-6 py-4 border border-red-200 bg-red-50 text-red-600 text-xs font-mono tracking-widest uppercase rounded-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-16">
          {/* Left Column: Media Configuration & Variants */}
          <div className="lg:w-1/2 space-y-8">
            <div className="bg-white p-8 border border-gray-200 shadow-sm rounded-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-[10px] font-mono text-gray-400 tracking-[0.3em] uppercase">Visual Assets</h3>
                <span className="text-[10px] font-mono text-[#FFD700] font-bold uppercase">{previews.length} / 7</span>
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative aspect-video border border-dashed border-gray-300 hover:border-black transition-all duration-500 cursor-pointer flex flex-col items-center justify-center gap-4 bg-gray-50 overflow-hidden"
              >
                <div className="z-10 text-center space-y-2">
                  <span className="text-4xl group-hover:scale-125 transition-transform inline-block">📸</span>
                  <p className="text-[9px] font-mono text-gray-400 tracking-widest uppercase group-hover:text-black transition-colors">
                    Upload High-Res Media
                  </p>
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity" />
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Dynamic Preview Grid */}
              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-8">
                  {previews.map((src, idx) => (
                    <div key={idx} className="relative group aspect-square overflow-hidden bg-gray-100 border border-gray-200">
                      <img
                        src={src}
                        alt={`preview-${idx}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="text-white text-[10px] uppercase tracking-widest font-bold hover:text-red-400"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Variants Section */}
            <div className="bg-white p-8 border border-gray-200 shadow-sm rounded-sm space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-mono text-gray-400 tracking-[0.3em] uppercase">Variant Configurations</h3>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="text-[9px] font-bold text-[#FFD700] uppercase tracking-widest border border-[#FFD700] px-4 py-2 hover:bg-[#FFD700] hover:text-black transition-all"
                >
                  + Add Variant
                </button>
              </div>

              <div className="space-y-4">
                {variants.map((v, idx) => (
                  <div key={idx} className="p-6 border border-gray-100 bg-[#F9F9FB] space-y-4 relative group">
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(idx)}
                      className="absolute top-4 right-4 text-gray-300 hover:text-red-500 text-[10px] font-bold transition-colors uppercase tracking-widest"
                    >
                      Delete
                    </button>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-[8px] font-mono text-gray-400 uppercase tracking-widest">Price Override</label>
                          <input 
                            type="number"
                            placeholder="Price"
                            className="w-full bg-transparent border-b border-gray-200 py-2 text-xs focus:outline-none"
                            value={v.price.amount}
                            onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                          />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[8px] font-mono text-gray-400 uppercase tracking-widest">Stock</label>
                          <input 
                            type="number"
                            placeholder="Stock"
                            className="w-full bg-transparent border-b border-gray-200 py-2 text-xs focus:outline-none"
                            value={v.stock}
                            onChange={(e) => handleVariantChange(idx, 'stock', e.target.value)}
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-[8px] font-mono text-gray-400 uppercase tracking-widest">Size</label>
                          <input 
                            type="text"
                            placeholder="E.G. XL, 42, 6.5"
                            className="w-full bg-transparent border-b border-gray-200 py-2 text-xs focus:outline-none uppercase"
                            value={v.attributes.size}
                            onChange={(e) => handleVariantChange(idx, 'attributes', e.target.value, 'size')}
                          />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[8px] font-mono text-gray-400 uppercase tracking-widest">Color</label>
                          <input 
                            type="text"
                            placeholder="E.G. NOIR, OCHRE"
                            className="w-full bg-transparent border-b border-gray-200 py-2 text-xs focus:outline-none uppercase"
                            value={v.attributes.color}
                            onChange={(e) => handleVariantChange(idx, 'attributes', e.target.value, 'color')}
                          />
                       </div>
                    </div>

                    {/* Variant Assets Selection & Uploads */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                       <div className="flex justify-between items-center">
                          <label className="text-[8px] font-mono text-[#FFD700] uppercase tracking-[0.2em] block font-bold">Variant Visuals</label>
                          <label className="cursor-pointer text-[8px] font-bold text-gray-400 hover:text-black uppercase tracking-widest border border-gray-200 px-2 py-1 rounded-sm">
                             + Upload Specific
                             <input 
                               type="file" 
                               multiple 
                               className="hidden" 
                               onChange={(e) => handleVariantFileUpload(idx, e)} 
                             />
                          </label>
                       </div>

                       {/* Local uploads for this variant */}
                       {(v.specificFiles || []).length > 0 && (
                          <div className="flex flex-wrap gap-2">
                             {v.specificFiles.map((f, fIdx) => (
                                <div key={fIdx} className="relative group/file w-10 h-10 bg-gray-200 rounded-sm overflow-hidden">
                                   <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover/file:opacity-100 transition-opacity">
                                      <button type="button" onClick={() => handleRemoveVariantFile(idx, fIdx)} className="text-white text-[8px] font-bold uppercase">Del</button>
                                   </div>
                                   <p className="text-[6px] p-1 break-all text-center">{f.name}</p>
                                </div>
                             ))}
                          </div>
                       )}

                       {/* Master Link Selection */}
                       <div className="space-y-2">
                          <p className="text-[7px] font-mono text-gray-300 uppercase tracking-widest">Link from Master Assets</p>
                          {previews.length > 0 ? (
                            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                              {previews.map((src, pIdx) => (
                                <div 
                                  key={pIdx}
                                  onClick={() => handleVariantImageToggle(idx, src)}
                                  className={`shrink-0 w-10 h-10 rounded-sm border-2 transition-all cursor-pointer overflow-hidden ${v.images?.includes(src) ? 'border-[#FFD700] scale-105' : 'border-transparent opacity-40 hover:opacity-80'}`}
                                >
                                   <img src={src} className="w-full h-full object-cover" alt="v-asset" />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[7px] text-gray-300 italic uppercase">Upload master assets first to link</p>
                          )}
                       </div>
                    </div>
                  </div>
                ))}
                {variants.length === 0 && (
                  <p className="text-[9px] text-gray-300 italic text-center py-4 uppercase tracking-widest">No variants defined. Using base configuration.</p>
                )}
              </div>
            </div>

            <div className="p-8 bg-black text-white space-y-4 rounded-sm shadow-xl">
              <h4 className="text-[10px] font-mono text-[#FFD700] tracking-[0.3em] uppercase">Launch Strategy</h4>
              <p className="text-xs text-gray-400 leading-relaxed uppercase tracking-tight font-medium">
                Ensure your product titles are clear and descriptions capture the soul of the collection. Quality media drives 85% more conversion.
              </p>
            </div>
          </div>

          {/* Right Column: Information Protocol */}
          <div className="lg:w-1/2 space-y-10 bg-white p-10 md:p-14 border border-gray-200 shadow-sm rounded-sm">
            <h3 className="text-[10px] font-mono text-gray-400 tracking-[0.3em] uppercase mb-10">Information Protocol</h3>
            
            {/* Title */}
            <div className="space-y-2 group">
              <label className="text-[9px] font-sans font-medium tracking-[0.3em] text-[#FFD700] uppercase block">
                Product Title
              </label>
              <input
                name="title"
                type="text"
                required
                placeholder="E.G. OVERSIZED KURTA DROP 001"
                className="w-full bg-transparent border-b border-gray-200 py-4 text-sm focus:outline-none focus:border-black transition-all placeholder:text-gray-400 uppercase font-medium text-black tracking-wide"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div className="space-y-2 group">
              <label className="text-[9px] font-sans font-medium tracking-[0.3em] text-[#FFD700] uppercase block">
                Narrative Description
              </label>
              <textarea
                name="description"
                required
                rows={8}
                placeholder="DEFINE THE AESTHETIC..."
                className="w-full bg-transparent border-b border-gray-200 py-4 text-sm focus:outline-none focus:border-black transition-all placeholder:text-gray-400 uppercase font-medium resize-none text-black tracking-wide leading-relaxed"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Price Identity */}
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-2">
                <label className="text-[9px] font-sans font-medium tracking-[0.3em] text-[#FFD700] uppercase block">
                  Base Price
                </label>
                <div className="flex items-center gap-2 border-b border-gray-200 focus-within:border-black transition-colors">
                  <span className="text-gray-400 font-mono text-sm leading-none">$</span>
                  <input
                    name="priceAmount"
                    type="number"
                    required
                    min="1"
                    placeholder="999"
                    className="w-full bg-transparent py-4 text-sm focus:outline-none placeholder:text-gray-400 font-medium text-black"
                    value={formData.priceAmount}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-sans font-medium tracking-[0.3em] text-[#FFD700] uppercase block">
                  Currency
                </label>
                <select
                  name="priceCurrency"
                  className="w-full bg-gray-50 border-b border-gray-200 py-4 text-sm focus:outline-none focus:border-black transition-all font-medium text-black appearance-none cursor-pointer px-4"
                  value={formData.priceCurrency}
                  onChange={handleChange}
                >
                  <option value="USD">UNITED STATES DOLLAR (USD)</option>
                  <option value="EUR">EUROPEAN EURO (EUR)</option>
                  <option value="GBP">BRITISH POUND (GBP)</option>
                </select>
              </div>
            </div>

            {/* Submit Control */}
            <div className="pt-10 space-y-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-gray-800 text-white py-5 transition-all duration-700 active:scale-[0.98] shadow-2xl relative overflow-hidden group/btn disabled:opacity-50"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-[0.4em] group-hover/btn:tracking-[0.6em] transition-all duration-500" style={{ fontFamily: '"Playfair Display", serif' }}>
                    {loading ? 'Initializing...' : 'Manifest Drop'}
                  </span>
                </div>
                <div className="absolute inset-0 bg-white/5 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-700" />
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/seller/products')}
                className="w-full text-center text-gray-400 hover:text-black font-mono text-[9px] uppercase tracking-[0.4em] transition-colors"
              >
                Cancel Protocol
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateProduct;
