import React from 'react';

export default function TemplateCardVisual({ template, className = "w-full h-full", customData = null }) {
  const data = customData || template?.default_data || {};
  const slug = template?.slug || 'royal-wedding';

  // Extract variables with defaults
  const bride = data.brideName || 'Priya';
  const groom = data.groomName || 'Rohit';
  const brideInitial = bride.charAt(0);
  const groomInitial = groom.charAt(0);
  const date = data.weddingDate || 'December 12, 2026';
  const venue = data.venue || 'The Grand Palace';
  const city = data.city || 'Udaipur, Rajasthan';
  const tagline = data.tagline || 'Together with our families';
  const photo = data.photoUrl || null;
  const symbol = data.symbol || 'ganesh'; // ganesh, rings, lotus, kalash

  // Render specific template theme
  switch (slug) {
    case 'royal-grace':
      return (
        <div className={`relative overflow-hidden bg-[#F5EFE7] text-[#254637] flex flex-col items-center justify-between p-4 select-none ${className}`}>
          {/* Background image if available, with overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 pointer-events-none"
            style={{ backgroundImage: `url('/assets/royal-grace-bg.jpg')` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#F5EFE7]/80 via-transparent to-[#F5EFE7]/90 pointer-events-none"></div>

          {/* Drapes & tassels SVG top corners */}
          <div className="absolute top-0 left-0 w-16 h-20 opacity-80 pointer-events-none">
            <svg viewBox="0 0 80 100" fill="none">
              <path d="M0 0 L40 0 C40 30 20 60 10 90 L0 90 Z" fill="#E6D7C3" />
              <circle cx="15" cy="90" r="3" fill="#C5A059" />
              <line x1="15" y1="90" x2="15" y2="100" stroke="#C5A059" strokeWidth="2" />
            </svg>
          </div>
          <div className="absolute top-0 right-0 w-16 h-20 opacity-80 pointer-events-none scale-x-[-1]">
            <svg viewBox="0 0 80 100" fill="none">
              <path d="M0 0 L40 0 C40 30 20 60 10 90 L0 90 Z" fill="#E6D7C3" />
              <circle cx="15" cy="90" r="3" fill="#C5A059" />
              <line x1="15" y1="90" x2="15" y2="100" stroke="#C5A059" strokeWidth="2" />
            </svg>
          </div>

          {/* Video Badge */}
          <div className="absolute top-2 right-2 z-20 bg-[#254637] text-[#E5C07B] text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
            <span>▶ Video Demo</span>
          </div>

          {/* Header */}
          <div className="w-full text-center pt-3 z-10">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#335645] font-serif font-medium">
              We're getting married
            </span>
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
              <div className="w-6 h-[0.5px] bg-[#335645]/40"></div>
              <span className="text-[9px] text-[#335645]">♥</span>
              <div className="w-6 h-[0.5px] bg-[#335645]/40"></div>
            </div>
          </div>

          {/* Couple Names - Zareqia Style */}
          <div className="my-auto text-center z-10 w-full px-2">
            <h3 className="font-script text-3xl font-normal text-[#1E3E2F] tracking-wide drop-shadow-xs">
              {groom}
            </h3>
            <p className="text-[8px] text-[#426051] font-serif italic max-w-[180px] mx-auto leading-tight mt-0.5">
              {data.groomBio || 'Son of Mr. & Mrs. Malik • Data Scientist'}
            </p>

            <span className="font-serif italic text-lg text-[#254637] block my-0.5">&</span>

            <h3 className="font-script text-3xl font-normal text-[#1E3E2F] tracking-wide drop-shadow-xs">
              {bride}
            </h3>
            <p className="text-[8px] text-[#426051] font-serif italic max-w-[180px] mx-auto leading-tight mt-0.5">
              {data.brideBio || 'Daughter of Mr. & Mrs. Nasser • Pediatrician'}
            </p>
          </div>

          {/* Bottom Cypress Trees & Scroll Indicator */}
          <div className="w-full text-center pb-1 z-10">
            <div className="flex items-center justify-center gap-1 text-[8px] tracking-[0.2em] uppercase text-[#335645] font-serif font-semibold">
              <span>Scroll</span>
              <svg className="w-3 h-3 text-[#335645] animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
            <div className="text-[8px] text-[#557364] mt-0.5 font-serif">
              {date} • {city}
            </div>
          </div>
        </div>
      );

    case 'royal-wedding':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-b from-[#4A0A16] via-[#661223] to-[#38060F] text-[#FDF4DC] flex flex-col items-center justify-between p-5 select-none ${className}`}>
          {/* Gold Filigree Arch Border */}
          <div className="absolute inset-2 border-2 border-[#D4AF37]/50 rounded-t-full pointer-events-none"></div>
          <div className="absolute inset-3 border border-[#E5C07B]/30 rounded-t-full pointer-events-none"></div>
          
          {/* Top Traditional Mandap Motif */}
          <div className="w-full flex flex-col items-center pt-3 z-10">
            <svg className="w-8 h-8 text-[#ECC274] mb-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C10.5 4 8 7 8 9.5C8 11.4 9.6 13 11.5 13C12.3 13 13 12.7 13.5 12.2C13.8 13.8 15.2 15 17 15C19.2 15 21 13.2 21 11C21 8.5 18 5 16 3C15 4.5 13.5 5 12 2Z" />
              <circle cx="12" cy="18" r="3" />
            </svg>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#ECC274] font-cinzel">॥ श्री गणेशाय नमः ॥</span>
          </div>

          {/* Ornate Arch Graphics */}
          <div className="my-auto text-center z-10 w-full px-2">
            <div className="text-[10px] tracking-widest uppercase text-[#E5C07B]/80 font-cinzel mb-1">
              We Invite You To Celebrate
            </div>
            
            {/* Couple Photo or Monogram in Arch */}
            {photo ? (
              <div className="w-24 h-24 mx-auto rounded-full border-2 border-[#D4AF37] overflow-hidden my-2 shadow-lg">
                <img src={photo} alt="Couple" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-20 h-20 mx-auto rounded-full border-2 border-[#D4AF37]/80 bg-[#35060E] flex items-center justify-center my-2 shadow-inner">
                <span className="font-script text-3xl text-[#ECC274]">
                  {groomInitial} & {brideInitial}
                </span>
              </div>
            )}

            <h3 className="font-cinzel text-xl font-bold tracking-wider text-[#FFF2D0] drop-shadow-sm">
              {groom}
            </h3>
            <span className="font-script text-2xl text-[#ECC274] block my-[-4px]">weds</span>
            <h3 className="font-cinzel text-xl font-bold tracking-wider text-[#FFF2D0] drop-shadow-sm">
              {bride}
            </h3>

            <p className="text-[10px] text-[#E5C07B] mt-2 font-serif italic max-w-[200px] mx-auto leading-tight">
              "{tagline}"
            </p>
          </div>

          {/* Bottom Details */}
          <div className="w-full text-center pb-2 z-10 border-t border-[#D4AF37]/30 pt-2">
            <div className="text-[11px] font-semibold text-[#FFF2D0] font-cinzel tracking-wider">
              {date}
            </div>
            <div className="text-[9px] text-[#E5C07B]/90 font-serif">
              {venue}, {city}
            </div>
          </div>
        </div>
      );

    case 'floral-elegance':
      return (
        <div className={`relative overflow-hidden bg-[#FFFDF9] text-[#3D282E] flex flex-col items-center justify-between p-5 select-none ${className}`}>
          {/* Pastel Floral Garland Border */}
          <div className="absolute inset-2 border border-[#E8D4C8] rounded-t-full pointer-events-none"></div>
          
          {/* Top Rose Garland SVG */}
          <div className="w-full text-center pt-2 z-10">
            <svg className="w-16 h-8 mx-auto text-[#D48B97]" viewBox="0 0 100 40" fill="currentColor">
              <path d="M50 5 Q65 15 80 5 Q70 25 50 25 Q30 25 20 5 Q35 15 50 5 Z" opacity="0.3" />
              <circle cx="50" cy="18" r="8" fill="#E8A598" />
              <circle cx="35" cy="15" r="6" fill="#F4C2BA" />
              <circle cx="65" cy="15" r="6" fill="#F4C2BA" />
            </svg>
            <div className="text-[9px] uppercase tracking-[0.2em] text-[#8C3B4E] font-serif mt-1">
              Save The Date
            </div>
          </div>

          {/* Middle Typography */}
          <div className="my-auto text-center z-10 w-full px-2">
            <span className="text-[10px] text-[#8C6B75] italic font-serif">Together with their families</span>
            <h3 className="font-serif text-2xl font-bold text-[#8C3B4E] mt-2">
              {groom}
            </h3>
            <span className="font-alex text-2xl text-[#C49A45] block my-[-2px]">&</span>
            <h3 className="font-serif text-2xl font-bold text-[#8C3B4E]">
              {bride}
            </h3>
            <div className="w-12 h-[1px] bg-[#C49A45] mx-auto my-3"></div>
            <p className="text-[10px] text-[#553E45] font-serif">
              Request the honour of your presence
            </p>
          </div>

          {/* Bottom */}
          <div className="w-full text-center pb-2 z-10">
            <div className="text-[11px] font-semibold text-[#8C3B4E] font-serif tracking-wide">
              {date}
            </div>
            <div className="text-[9px] text-[#7A5B64] font-serif">
              {venue} • {city}
            </div>
          </div>
        </div>
      );

    case 'modern-classic':
      return (
        <div className={`relative overflow-hidden bg-[#0A261C] text-[#F4E8D1] flex flex-col items-center justify-between p-5 select-none ${className}`}>
          {/* Gold Linear Geometric Frame */}
          <div className="absolute inset-3 border border-[#E5C07B]/40 pointer-events-none"></div>
          <div className="absolute inset-4 border border-[#E5C07B]/20 pointer-events-none"></div>

          {/* Top Monogram Emblem */}
          <div className="w-full text-center pt-3 z-10">
            <div className="w-14 h-14 mx-auto rounded-full border border-[#E5C07B] flex items-center justify-center bg-[#071D15]">
              <span className="font-serif text-lg tracking-wider text-[#E5C07B]">
                {groomInitial} & {brideInitial}
              </span>
            </div>
          </div>

          {/* Center */}
          <div className="my-auto text-center z-10 w-full">
            <div className="text-[9px] uppercase tracking-[0.3em] text-[#C5AF8A] font-cormorant">
              Cordially Invite You
            </div>
            <h3 className="font-cormorant text-2xl font-semibold tracking-wider text-[#FFF2D0] mt-2">
              {groom}
            </h3>
            <span className="font-script text-2xl text-[#E5C07B] block my-[-3px]">and</span>
            <h3 className="font-cormorant text-2xl font-semibold tracking-wider text-[#FFF2D0]">
              {bride}
            </h3>
            <div className="text-[9px] uppercase tracking-widest text-[#C5AF8A] mt-3">
              Are Getting Married
            </div>
          </div>

          {/* Bottom */}
          <div className="w-full text-center pb-2 z-10 border-t border-[#E5C07B]/30 pt-2">
            <div className="text-[11px] font-cormorant tracking-widest text-[#E5C07B] font-bold">
              {date}
            </div>
            <div className="text-[9px] text-[#C5AF8A]">
              {venue}, {city}
            </div>
          </div>
        </div>
      );

    case 'garden-romance':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FFF8F2] to-[#FCEEE6] text-[#3B242B] flex flex-col items-center justify-between p-5 select-none ${className}`}>
          {/* Arch outline with floral accents */}
          <div className="absolute inset-2 border border-[#E3B8A8]/60 rounded-t-full pointer-events-none"></div>
          
          <div className="w-full text-center pt-3 z-10">
            <svg className="w-10 h-10 mx-auto text-[#D97D8F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" />
              <path d="M12 7V17M7 12H17" strokeWidth="0.75" />
            </svg>
            <span className="text-[9px] tracking-[0.25em] text-[#A64B60] uppercase font-serif">Garden Wedding</span>
          </div>

          <div className="my-auto text-center z-10 w-full">
            <span className="text-[10px] text-[#7F5E68] italic font-serif">You are invited to the wedding of</span>
            <h3 className="font-serif text-2xl font-bold text-[#8C3449] mt-1">
              {groom}
            </h3>
            <span className="font-script text-2xl text-[#D8A05B] block my-[-4px]">with</span>
            <h3 className="font-serif text-2xl font-bold text-[#8C3449]">
              {bride}
            </h3>
            <p className="text-[9px] text-[#7F5E68] mt-2 italic">
              Join us under the floral gazebo
            </p>
          </div>

          <div className="w-full text-center pb-2 z-10">
            <div className="text-[11px] font-serif font-bold text-[#8C3449]">
              {date}
            </div>
            <div className="text-[9px] text-[#694B53]">
              {venue} • {city}
            </div>
          </div>
        </div>
      );

    case 'desert-bliss':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-b from-[#5C1F0E] via-[#85341C] to-[#451408] text-[#FDEEE3] flex flex-col items-center justify-between p-5 select-none ${className}`}>
          {/* Rajasthani Jharokha Arch Border */}
          <div className="absolute inset-2 border-2 border-[#F4A261]/60 rounded-t-3xl pointer-events-none"></div>

          <div className="w-full text-center pt-3 z-10">
            <div className="flex justify-center items-center gap-2 text-[#F4A261]">
              <span className="text-xs">🏮</span>
              <span className="text-[10px] font-cinzel uppercase tracking-[0.25em]">Royal Jharokha</span>
              <span className="text-xs">🏮</span>
            </div>
          </div>

          <div className="my-auto text-center z-10 w-full px-2">
            <div className="text-[9px] uppercase tracking-widest text-[#F4A261] font-cinzel">
              Shubh Vivah
            </div>
            <h3 className="font-cinzel text-xl font-bold text-[#FFF3E8] mt-2">
              {groom}
            </h3>
            <span className="font-script text-2xl text-[#F4A261] block my-[-3px]">weds</span>
            <h3 className="font-cinzel text-xl font-bold text-[#FFF3E8]">
              {bride}
            </h3>
            <div className="w-14 h-[1px] bg-[#F4A261]/50 mx-auto my-2"></div>
            <p className="text-[9px] text-[#E5B59E] font-serif">
              In the Golden City of Forts & Starlight
            </p>
          </div>

          <div className="w-full text-center pb-2 z-10 border-t border-[#F4A261]/30 pt-2">
            <div className="text-[11px] font-cinzel font-semibold text-[#FFF3E8]">
              {date}
            </div>
            <div className="text-[9px] text-[#F4A261]">
              {venue}, {city}
            </div>
          </div>
        </div>
      );

    case 'minimal-green':
      return (
        <div className={`relative overflow-hidden bg-[#FBFDFB] text-[#1F2923] flex flex-col items-center justify-between p-5 select-none ${className}`}>
          {/* Sage Minimal Leaf Border */}
          <div className="absolute inset-3 border border-[#A3B18A]/40 pointer-events-none"></div>

          <div className="w-full text-center pt-3 z-10">
            <span className="text-xs text-[#52796F]">🌿</span>
          </div>

          <div className="my-auto text-center z-10 w-full">
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#52796F] font-cormorant block mb-2">
              Together Forever
            </span>
            <h3 className="font-cormorant text-2xl font-light tracking-wide text-[#2F3E36]">
              {groom}
            </h3>
            <span className="font-alex text-2xl text-[#84A98C] block my-[-2px]">&</span>
            <h3 className="font-cormorant text-2xl font-light tracking-wide text-[#2F3E36]">
              {bride}
            </h3>
            <div className="w-8 h-[1px] bg-[#84A98C] mx-auto my-2"></div>
            <p className="text-[9px] text-[#5C6F64] font-serif">
              Invite you to celebrate their wedding
            </p>
          </div>

          <div className="w-full text-center pb-2 z-10">
            <div className="text-[11px] font-cormorant font-bold text-[#2F3E36] tracking-wider">
              {date}
            </div>
            <div className="text-[9px] text-[#5C6F64]">
              {venue} • {city}
            </div>
          </div>
        </div>
      );

    case 'royal-blue':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-b from-[#09152B] via-[#0D2044] to-[#071122] text-[#F5E6CA] flex flex-col items-center justify-between p-5 select-none ${className}`}>
          {/* Gold Lotus & Mandala Arch */}
          <div className="absolute inset-2 border-2 border-[#E5C07B]/50 rounded-t-full pointer-events-none"></div>

          <div className="w-full text-center pt-3 z-10">
            <svg className="w-8 h-8 mx-auto text-[#ECC274]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C11 7 8 9 5 11C9 12 11 14 12 18C13 14 15 12 19 11C16 9 13 7 12 3Z" />
              <circle cx="12" cy="19" r="2" />
            </svg>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#ECC274] font-cinzel">Royal Sapphire</span>
          </div>

          <div className="my-auto text-center z-10 w-full px-2">
            <div className="text-[9px] uppercase tracking-widest text-[#E5C07B]/80 font-cinzel">
              Wedding Invitation
            </div>
            <h3 className="font-cinzel text-xl font-bold tracking-wider text-[#FFF6E5] mt-2">
              {groom}
            </h3>
            <span className="font-script text-2xl text-[#ECC274] block my-[-3px]">weds</span>
            <h3 className="font-cinzel text-xl font-bold tracking-wider text-[#FFF6E5]">
              {bride}
            </h3>
            <p className="text-[9px] text-[#A6BBD9] mt-2 font-serif italic">
              Blessed with love, framed in gold
            </p>
          </div>

          <div className="w-full text-center pb-2 z-10 border-t border-[#E5C07B]/30 pt-2">
            <div className="text-[11px] font-cinzel font-semibold text-[#FFF6E5]">
              {date}
            </div>
            <div className="text-[9px] text-[#E5C07B]/90">
              {venue}, {city}
            </div>
          </div>
        </div>
      );

    case 'emerald-noir':
      return (
        <div className={`relative overflow-hidden flex flex-col items-center justify-between p-4 select-none ${className}`}
             style={{ background: 'radial-gradient(ellipse at top, #0B3B2C 0%, #04271D 75%)', color: '#F6EBD3' }}>
          <div className="absolute inset-2 border border-[#D8B35A]/50 pointer-events-none"></div>
          <div className="absolute inset-3 border border-[#D8B35A]/20 pointer-events-none"></div>
          <div className="absolute top-2 left-2 z-20 bg-[#D8B35A] text-[#04271D] text-[9px] font-bold px-2 py-0.5 rounded-full">3D Door</div>
          <div className="w-full text-center pt-4 z-10">
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#EBD08A] font-cinzel">{tagline}</span>
            <div className="text-[#D8B35A] text-[8px] mt-0.5">◆</div>
          </div>
          <div className="my-auto text-center z-10">
            <h3 className="font-script text-3xl text-[#EBD08A]">{groom}</h3>
            <span className="font-serif italic text-lg text-[#D8B35A] block">&</span>
            <h3 className="font-script text-3xl text-[#EBD08A]">{bride}</h3>
          </div>
          <div className="w-full text-center pb-2 z-10">
            <div className="text-[8px] tracking-[0.2em] uppercase text-[#D8B35A] font-cinzel">{date}</div>
            <div className="text-[8px] text-[#F6EBD3]/70 font-serif">{venue}</div>
          </div>
        </div>
      );

    case 'vintage-charm':
    default:
      return (
        <div className={`relative overflow-hidden bg-[#FFFDF8] text-[#38252B] flex flex-col items-center justify-between p-5 select-none ${className}`}>
          {/* Vintage Ornamental Corners */}
          <div className="absolute inset-3 border border-[#D9BA9B] pointer-events-none"></div>

          <div className="w-full text-center pt-3 z-10">
            <div className="w-12 h-12 mx-auto border-2 border-[#BF9054] rounded-full flex items-center justify-center bg-[#FAF4EB]">
              <span className="font-script text-2xl text-[#8A374A]">
                {groomInitial} & {brideInitial}
              </span>
            </div>
          </div>

          <div className="my-auto text-center z-10 w-full px-2">
            <span className="text-[9px] tracking-[0.2em] uppercase text-[#7A626A] font-serif">Vintage Nuptials</span>
            <h3 className="font-serif text-2xl font-bold text-[#7A384A] mt-1">
              {groom}
            </h3>
            <span className="font-script text-2xl text-[#BF9054] block my-[-3px]">and</span>
            <h3 className="font-serif text-2xl font-bold text-[#7A384A]">
              {bride}
            </h3>
            <p className="text-[9px] text-[#7A626A] mt-2 font-serif italic">
              Honor us with your gracious presence
            </p>
          </div>

          <div className="w-full text-center pb-2 z-10">
            <div className="text-[11px] font-serif font-bold text-[#7A384A]">
              {date}
            </div>
            <div className="text-[9px] text-[#7A626A]">
              {venue} • {city}
            </div>
          </div>
        </div>
      );
  }
}
