import React from 'react';
import { ShoppingCart, Edit, CreditCard, Mail } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: 1,
      icon: <ShoppingCart className="w-5 h-5" />,
      title: 'Choose a Template',
      desc: 'Browse our collection and select your favorite design.'
    },
    {
      num: 2,
      icon: <Edit className="w-5 h-5" />,
      title: 'Customize It',
      desc: 'Add your details, change colors, fonts and make it yours.'
    },
    {
      num: 3,
      icon: <CreditCard className="w-5 h-5" />,
      title: 'Complete Payment',
      desc: 'Secure and easy checkout with multiple payment options.'
    },
    {
      num: 4,
      icon: <Mail className="w-5 h-5" />,
      title: 'Get Your Invitation',
      desc: 'Download and share your beautiful invitation instantly.'
    }
  ];

  return (
    <section id="how-it-works-section" className="relative py-20 bg-white overflow-hidden">
      
      {/* Decorative Floral illustration corners matching screenshot */}
      <div className="absolute top-0 left-0 w-36 sm:w-48 opacity-75 pointer-events-none">
        <svg viewBox="0 0 200 200" fill="none">
          <path d="M0 0 C60 20, 100 80, 120 160" stroke="#E8A598" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="40" cy="40" r="14" fill="#F4C2BA" opacity="0.6" />
          <circle cx="80" cy="50" r="10" fill="#E8A598" opacity="0.5" />
          <circle cx="50" cy="90" r="12" fill="#D48B97" opacity="0.5" />
          <path d="M20 30 Q50 60 40 100" stroke="#8C3B4E" strokeWidth="1" />
          <path d="M50 20 Q80 50 110 40" stroke="#8C3B4E" strokeWidth="1" />
        </svg>
      </div>

      <div className="absolute top-0 right-0 w-36 sm:w-48 opacity-75 pointer-events-none transform scale-x-[-1]">
        <svg viewBox="0 0 200 200" fill="none">
          <path d="M0 0 C60 20, 100 80, 120 160" stroke="#E8A598" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="40" cy="40" r="14" fill="#F4C2BA" opacity="0.6" />
          <circle cx="80" cy="50" r="10" fill="#E8A598" opacity="0.5" />
          <circle cx="50" cy="90" r="12" fill="#D48B97" opacity="0.5" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6B1D2F] font-serif block mb-2">
            How It Works
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#192231]">
            Create Your Invitation in 4 Simple Steps
          </h2>
        </div>

        {/* 4 Steps with Connector Line */}
        <div className="relative">
          {/* Subtle horizontal connecting line on desktop */}
          <div className="hidden lg:block absolute top-1/4 left-[12%] right-[12%] h-[1px] bg-dashed border-t border-dashed border-[#E5C9C0] z-0"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center px-2 group">
                
                {/* Step badge with Number on top */}
                <div className="relative mb-5">
                  <div className="w-16 h-16 rounded-full bg-[#6B1D2F] text-white flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:bg-[#521321] transition duration-300">
                    {step.icon}
                  </div>
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#E5C07B] text-[#400914] text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
                    {step.num}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed max-w-[210px]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
