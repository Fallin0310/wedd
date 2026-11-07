import React, { useState } from 'react';
import { ArrowRight, Send, Heart } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer id="footer-section" className="bg-[#4E1322] text-[#FDEEE9] pt-14 pb-10 border-t-2 border-[#D4AF37]/40 relative overflow-hidden">
      
      {/* Background delicate lace pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="15" fill="none" stroke="#FFF" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#pattern-circles)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-10 border-b border-white/10">
          
          {/* Logo Column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-8 h-8 text-[#E5C07B]" viewBox="0 0 40 40" fill="none">
                <circle cx="16" cy="20" r="11" stroke="#E5C07B" strokeWidth="2.5" />
                <circle cx="24" cy="20" r="11" stroke="#FFF" strokeWidth="2.5" />
                <path d="M20 14 C20 12 17 9 14 11 C11 13 14 17 20 22 C26 17 29 13 26 11 C23 9 20 12 20 14 Z" fill="#E5C07B" opacity="0.9" />
              </svg>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-white">
                  Wedd<span className="text-[#ECC274]">Invites</span>
                </span>
                <span className="text-[10px] text-[#E5C07B] tracking-wider uppercase font-medium mt-[-2px]">
                  Beautiful Invitations, Made Easy
                </span>
              </div>
            </div>
            <p className="text-xs text-[#F2D0C5] max-w-xs mt-2 leading-relaxed">
              Craft unforgettable wedding moments with digital luxury invitations, delivered instantly to loved ones.
            </p>
          </div>

          {/* Newsletter Subscribe */}
          <div className="lg:col-span-5">
            <h4 className="font-serif text-base font-bold text-white mb-1">
              Stay Updated
            </h4>
            <p className="text-xs text-[#E5C07B] mb-3">
              Get the latest templates, offers and wedding inspiration.
            </p>

            <form onSubmit={handleSubscribe} className="relative max-w-md flex items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-white/10 border border-[#ECC274]/40 text-xs text-white placeholder-[#F2D0C5]/60 px-4 py-2.5 rounded-full focus:outline-none focus:border-[#ECC274] focus:bg-white/20 transition"
              />
              <button
                type="submit"
                className="absolute right-1 w-8 h-8 rounded-full bg-[#ECC274] hover:bg-[#D4AF37] text-[#4E1322] flex items-center justify-center transition cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            {subscribed && (
              <span className="text-[11px] text-green-300 mt-1 block">
                ✓ Thank you for subscribing!
              </span>
            )}
          </div>

          {/* Social Icons */}
          <div className="lg:col-span-3 flex lg:justify-end gap-3 text-white">
            <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#ECC274] hover:text-[#4E1322] flex items-center justify-center transition" title="Facebook">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#ECC274] hover:text-[#4E1322] flex items-center justify-center transition" title="Instagram">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#ECC274] hover:text-[#4E1322] flex items-center justify-center transition" title="Pinterest">
              <span className="font-bold text-xs">P</span>
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#ECC274] hover:text-[#4E1322] flex items-center justify-center transition" title="YouTube">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>

        </div>

        {/* Bottom Row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F2D0C5]/80 gap-3">
          <p>© 2026 WeddInvites.store. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition">Terms & Conditions</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
