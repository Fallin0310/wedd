import React from 'react';
import { CheckCircle2, Download, X, Sparkles, ShieldCheck } from 'lucide-react';

export default function OrderSuccessModal({ order, template, onClose, onOpenEditor }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Celebration Header */}
        <div className="bg-[#6B1D2F] px-6 py-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-14 h-14 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-9 h-9 text-[#ECC274]" />
          </div>

          <h3 className="font-serif text-2xl font-bold">
            Payment Successful!
          </h3>
          <p className="text-xs text-[#E5C07B] mt-1">
            Your invitation template is unlocked & watermark-free
          </p>
        </div>

        {/* Receipt Details */}
        <div className="p-6 space-y-4">
          <div className="bg-[#FAF3F0] p-4 rounded-xl border border-[#F2DDD3] text-left space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Template</span>
              <span className="font-bold text-gray-900">{template?.title || 'Wedding Invitation'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Amount Paid</span>
              <span className="font-bold text-gray-900">₹ {order.amount || template?.price || 999}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment ID</span>
              <span className="font-mono text-gray-700">{order.payment_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="font-bold text-green-700">COMPLETED ✓</span>
            </div>
          </div>

          <p className="text-xs text-gray-600">
            You can now customize all texts, dates, and venues in the editor and export unlimited print-ready PDFs and HD images!
          </p>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenEditor(template);
              }}
              className="w-full py-2.5 bg-[#6B1D2F] hover:bg-[#521321] text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
            >
              Open In Template Editor Now
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition cursor-pointer"
            >
              Back to Gallery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
