import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Search, ShoppingBag, User, LogOut, LayoutDashboard, Heart, Sparkles, 
  ChevronDown, Menu, X, Phone, Compass, Info, Home
} from 'lucide-react';

export default function Navbar({ onOpenDesigns, onOpenAdmin, onSelectTemplate, onSearch, cartCount = 0 }) {
  const { user, openLogin, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
    setSearchOpen(false);
    const templatesEl = document.getElementById('templates-section');
    if (templatesEl) {
      templatesEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-#D2AF8A backdrop-blur-md border-b border-gray-100 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo matching the screenshot */}
          <div className="flex items-center gap-2">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-[#6B1D2F] rounded-lg hover:bg-gray-100 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <a href="#" className="flex items-center gap-2 group">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center">
                {/* Intertwined Heart / Wedding Rings SVG */}
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#6B1D2F] group-hover:scale-105 transition-transform" viewBox="0 0 40 40" fill="none">
                  <circle cx="16" cy="20" r="11" stroke="#D4AF37" strokeWidth="2.5" />
                  <circle cx="24" cy="20" r="11" stroke="#6B1D2F" strokeWidth="2.5" />
                  <path d="M20 14 C20 12 17 9 14 11 C11 13 14 17 20 22 C26 17 29 13 26 11 C23 9 20 12 20 14 Z" fill="#6B1D2F" opacity="0.8" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1F2430]">
                  Wedd<span className="text-[#6B1D2F]">Invites</span>
                </span>
                <span className="text-[9px] sm:text-[10px] text-[#A67C52] tracking-wider uppercase font-medium mt-[-3px] hidden xs:inline">
                  Beautiful Invitations, Made Easy
                </span>
              </div>
            </a>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-700">
            <a 
              href="#" 
              className="relative text-[#6B1D2F] font-semibold transition pb-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#6B1D2F]"
            >
              Home
            </a>
            <a 
              href="#templates-section" 
              className="hover:text-[#6B1D2F] transition pb-1"
            >
              Templates
            </a>
            <a 
              href="#how-it-works-section" 
              className="hover:text-[#6B1D2F] transition pb-1"
            >
              How It Works
            </a>
            <a 
              href="#features-section" 
              className="hover:text-[#6B1D2F] transition pb-1"
            >
              About
            </a>
            <a 
              href="#contact" 
              className="hover:text-[#6B1D2F] transition pb-1"
            >
              Contact
            </a>
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Search Toggle */}
            <div className="relative">
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-gray-600 hover:text-[#6B1D2F] p-1.5 rounded-full hover:bg-gray-100 transition cursor-pointer"
                title="Search templates"
              >
                <Search className="w-5 h-5" />
              </button>

              {searchOpen && (
                <form 
                  onSubmit={handleSearchSubmit} 
                  className="absolute right-0 mt-2 w-72 max-w-[90vw] bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50 flex items-center gap-2 animate-fade-in"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Royal Grace, floral, minimal..."
                    className="w-full text-xs px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#6B1D2F]"
                    autoFocus
                  />
                  <button 
                    type="submit"
                    className="p-1.5 bg-[#6B1D2F] text-white rounded-lg hover:bg-[#531422] transition shrink-0"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

            {/* User Auth or Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 text-sm font-medium text-gray-700 hover:text-[#6B1D2F] py-1 px-2 sm:py-1.5 sm:px-3 rounded-full hover:bg-gray-50 transition cursor-pointer border border-gray-200"
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#6B1D2F] text-white text-xs font-bold flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
                  {user.role === 'admin' && (
                    <span className="text-[10px] bg-red-100 text-[#6B1D2F] font-bold px-1.5 py-0.5 rounded">Admin</span>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {dropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-fade-in"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-900">{user.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={onOpenDesigns}
                      className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-[#FAF3F0] hover:text-[#6B1D2F] flex items-center gap-2 cursor-pointer"
                    >
                      <Heart className="w-4 h-4 text-[#6B1D2F]" />
                      My Saved Designs
                    </button>

                    {user.role === 'admin' && (
                      <button
                        onClick={onOpenAdmin}
                        className="w-full text-left px-4 py-2 text-xs text-[#6B1D2F] font-semibold hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Dashboard
                      </button>
                    )}

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openLogin}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 hover:text-[#6B1D2F] transition cursor-pointer px-2 sm:px-0 py-1"
              >
                <User className="w-4 h-4 text-gray-500" />
                <span className="hidden xs:inline">Login / Sign Up</span>
                <span className="xs:hidden">Login</span>
              </button>
            )}

            {/* Shopping Cart Bag */}
            <div 
              onClick={() => {
                if (user) onOpenDesigns();
                else openLogin();
              }}
              className="relative cursor-pointer text-gray-700 hover:text-[#6B1D2F] transition p-1"
              title="Cart / Saved Designs"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-[#6B1D2F] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-5 shadow-lg animate-fade-in space-y-3">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-gray-800">
            <a 
              href="#" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 py-1 text-[#6B1D2F] font-bold"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </a>
            <a 
              href="#templates-section" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 py-1 hover:text-[#6B1D2F]"
            >
              <Compass className="w-4 h-4 text-gray-400" />
              <span>Browse All Templates</span>
            </a>
            <a 
              href="#how-it-works-section" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 py-1 hover:text-[#6B1D2F]"
            >
              <Sparkles className="w-4 h-4 text-gray-400" />
              <span>How It Works</span>
            </a>
            <a 
              href="#features-section" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 py-1 hover:text-[#6B1D2F]"
            >
              <Info className="w-4 h-4 text-gray-400" />
              <span>About WeddInvites</span>
            </a>
            <a 
              href="#footer-section" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 py-1 hover:text-[#6B1D2F]"
            >
              <Phone className="w-4 h-4 text-gray-400" />
              <span>Contact Us</span>
            </a>
          </nav>

          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            {user ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDesigns();
                  }}
                  className="w-full py-2 bg-[#FAF3F0] text-[#6B1D2F] font-semibold text-xs rounded-lg flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4" />
                  <span>My Saved Designs ({cartCount})</span>
                </button>
                {user.role === 'admin' && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full py-2 bg-red-50 text-[#6B1D2F] font-semibold text-xs rounded-lg flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full py-2 text-gray-600 text-xs font-semibold hover:text-red-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openLogin();
                }}
                className="w-full py-2.5 bg-[#6B1D2F] text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 shadow-xs"
              >
                <User className="w-4 h-4" />
                <span>Login / Register Account</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
