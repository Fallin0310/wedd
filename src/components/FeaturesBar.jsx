import React from 'react';
import { Palette, Edit3, Smartphone, ShieldCheck } from 'lucide-react';

export default function FeaturesBar() {
  const features = [
    {
      icon: <Palette className="w-6 h-6 text-[#8C3B4E]" />,
      title: 'Stunning Templates',
      desc: 'Professionally designed for modern and traditional weddings.'
    },
    {
      icon: <Edit3 className="w-6 h-6 text-[#8C3B4E]" />,
      title: 'Fully Customizable',
      desc: 'Edit text, colors, fonts and more — no design skills needed.'
    },
    {
      icon: <Smartphone className="w-6 h-6 text-[#8C3B4E]" />,
      title: 'Access Anywhere',
      desc: 'Create and manage your invitations from any device.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#8C3B4E]" />,
      title: 'Secure & Private',
      desc: 'Your data and designs are always safe with us.'
    }
  ];

  return (
    <section id="features-section" className="bg-[#FFF5E8] border-y border-[#F3E2DB] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center px-4">
              <div className="w-12 h-12 rounded-full bg-[#F3E3DD] flex items-center justify-center mb-3 text-[#6B1D2F]">
                {feat.icon}
              </div>
              <h3 className="font-serif font-bold text-base text-gray-900 mb-1">
                {feat.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-[220px]">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
