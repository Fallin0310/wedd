import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Heart, Edit3, Trash2, Calendar, MapPin, Wand2 } from 'lucide-react';

export default function MyDesignsModal({ isOpen, onClose, onEditDesign }) {
  const { user, fetchWithAuth } = useAuth();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user) {
      loadDesigns();
    }
  }, [isOpen, user]);

  const loadDesigns = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth('/api/designs');
      const data = await res.json();
      if (data.success) {
        setDesigns(data.designs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this saved invitation?')) return;
    try {
      const res = await fetchWithAuth(`/api/designs/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setDesigns(designs.filter(d => d.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#6B1D2F] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#E5C07B]" />
            <h3 className="font-serif font-bold text-lg">My Saved Invitations</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="text-center py-10 text-xs text-gray-500">
              Loading your designs...
            </div>
          ) : designs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF3F0] flex items-center justify-center text-[#6B1D2F] mb-3">
                <Heart className="w-7 h-7" />
              </div>
              <h4 className="font-serif font-bold text-base text-gray-900 mb-1">
                No saved designs yet
              </h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
                Pick any wedding template from the gallery, customize it with your names and dates, and click "Save Design".
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#6B1D2F] text-white text-xs font-semibold rounded-lg hover:bg-[#521321] transition cursor-pointer"
              >
                Browse Templates
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {designs.map((d) => (
                <div key={d.id} className="p-4 bg-[#FAF7F5] border border-gray-200 rounded-xl flex flex-col justify-between hover:shadow-md transition">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#6B1D2F] tracking-wider block mb-1">
                      {d.template_title}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-gray-900">
                      {d.title}
                    </h4>
                    <p className="text-xs text-gray-700 font-medium mt-1">
                      {d.groom_name} & {d.bride_name}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-2">
                      <Calendar className="w-3.5 h-3.5 text-[#6B1D2F]" />
                      <span>{d.wedding_date || 'Date not set'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-3 border-t border-gray-200">
                    <button
                      onClick={() => {
                        onClose();
                        onEditDesign(d);
                      }}
                      className="px-3 py-1.5 bg-[#6B1D2F] hover:bg-[#521321] text-white text-xs font-semibold rounded-md transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>Open Editor</span>
                    </button>

                    <button
                      onClick={() => handleDelete(d.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition cursor-pointer"
                      title="Delete design"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
