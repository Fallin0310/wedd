import React, { useState } from 'react';
import TemplateCardVisual from './TemplateCardVisual';
import { Eye, Wand2, Sparkles, ArrowRight, Play } from 'lucide-react';

export default function PopularTemplates({ templates, onSelectTemplate, onViewDemo }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Luxury', 'Royal', 'Floral', 'Modern', 'Heritage', 'Minimal', 'Vintage'];

  const filtered = selectedCategory === 'All'
    ? templates
    : templates.filter(t => t.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section id="templates-section" className="py-12 sm:py-20 bg-[#FFF5E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 pb-4 border-b border-gray-100 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6B1D2F] font-serif block mb-1 sm:mb-2">
              Popular Templates
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#192231]">
              Beautiful Designs for Every Love Story
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm max-w-2xl mt-1 sm:mt-2">
              Explore our most loved wedding invitation templates. Click <strong>View Demo</strong> to watch the cinematic video & experience the interactive card!
            </p>
          </div>

          <div className="shrink-0">
            <button 
              onClick={() => setSelectedCategory('All')}
              className="text-xs sm:text-sm font-semibold text-[#6B1D2F] hover:text-[#4A1221] flex items-center gap-1.5 transition cursor-pointer group"
            >
              <span>View All Templates</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Category Pills (Touch friendly scroll on mobile) */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#6B1D2F] text-white shadow-xs'
                  : 'bg-[#FBF6F4] text-gray-700 hover:bg-[#F2E5E0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid (1 col on small mobile, 2 on tablet, 4 on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {filtered.map((tpl) => (
            <div 
              key={tpl.id}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Card Thumbnail Visual Area */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 border-b border-gray-100">
                <TemplateCardVisual template={tpl} className="w-full h-full group-hover:scale-102 transition duration-500" />

                {/* Bestseller Badge */}
                {tpl.is_bestseller ? (
                  <div className="absolute top-3 left-3 bg-[#1A1A1A] text-[#ECC274] text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 z-20">
                    <Sparkles className="w-2.5 h-2.5 fill-[#ECC274]" />
                    Bestseller
                  </div>
                ) : null}

                {/* Video Demo Badge if available or Royal Grace */}
                {(tpl.slug === 'royal-grace' || tpl.video_url || tpl.default_data?.videoUrl) && (
                  <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 z-20">
                    <Play className="w-2.5 h-2.5 fill-white" /> Video Demo
                  </div>
                )}
              </div>

              {/* Card Information */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif font-bold text-base text-gray-900 group-hover:text-[#6B1D2F] transition">
                      {tpl.title}
                    </h3>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B1D2F] bg-[#FAF3F0] px-2 py-0.5 rounded">
                      {tpl.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="font-bold text-sm sm:text-base text-gray-900">
                      ₹ {tpl.price}
                    </span>
                    {tpl.original_price && (
                      <span className="text-xs text-gray-400 line-through">
                        ₹ {tpl.original_price}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Two Action Buttons */}
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => onViewDemo(tpl)}
                    className="w-full py-2.5 bg-[#6B1D2F] hover:bg-[#521321] text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Demo</span>
                  </button>

                  <button
                    onClick={() => onSelectTemplate(tpl)}
                    className="w-full py-2 bg-white hover:bg-[#FAF3F0] text-[#6B1D2F] border border-[#6B1D2F] text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Use This Design</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
