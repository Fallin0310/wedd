import React from 'react';
import { Star } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      quote: "WeddInvites made our wedding invitation so easy and beautiful! The templates are absolutely stunning and super easy to customize.",
      name: "Priya Sharma",
      role: "Bride, Delhi",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    {
      quote: "I loved the variety of designs and the simple editing process. It saved us so much time and looked so professional!",
      name: "Rohit Mehta",
      role: "Groom, Mumbai",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    {
      quote: "Excellent service and beautiful templates. Our guests loved the digital invite. Highly recommended!",
      name: "Neha Kapoor",
      role: "Bride, Bangalore",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80"
    }
  ];

  return (
    <section className="bg-[#FFF5E8] py-20 border-t border-[#F2DDD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-14">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#192231]">
            What Our Customers Say
          </h2>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all border border-[#F3E5DF] flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex gap-1 text-[#E5C07B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#E5C07B]" />
                  ))}
                </div>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed italic">
                  "{rev.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 mt-4 border-t border-gray-100">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#E5C07B]"
                />
                <div>
                  <h4 className="font-serif font-bold text-sm text-gray-900">
                    {rev.name}
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    {rev.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Dots matching screenshot */}
        <div className="flex justify-center items-center gap-2 mt-10">
          <span className="w-2 h-2 rounded-full bg-gray-300"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#6B1D2F]"></span>
          <span className="w-2 h-2 rounded-full bg-gray-300"></span>
        </div>

      </div>
    </section>
  );
}
