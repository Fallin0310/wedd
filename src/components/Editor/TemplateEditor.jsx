import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft, Save, Download, Share2, ZoomIn, ZoomOut, Image as ImageIcon, 
  Palette, Type, Calendar, Heart, Sparkles, Check, Plus, Trash2, ShieldCheck, Printer,
  Lock, Unlock, CreditCard, X, Eye, Edit3
} from 'lucide-react';

export default function TemplateEditor({ template, initialDesign = null, onBack }) {
  const { user, token, openLogin, fetchWithAuth } = useAuth();
  const cardRef = useRef(null);

  // Defaults based on selected template
  const defaultData = template?.default_data || {};
  const isRoyalGrace = template?.slug === 'royal-grace';

  const [activeTab, setActiveTab] = useState('details'); // details, events, theme, photo, optional
  const [mobileTab, setMobileTab] = useState('form'); // 'form' | 'preview' for mobile view
  const [zoomLevel, setZoomLevel] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [currentDesignId, setCurrentDesignId] = useState(initialDesign?.id || null);

  // Watermark & License State
  const [isPurchased, setIsPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(true);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState('');

  // Invitation Form State
  const [formData, setFormData] = useState({
    title: initialDesign?.title || `${template?.title || 'Royal'} Invitation`,
    groomName: initialDesign?.groom_name || defaultData.groomName || (isRoyalGrace ? 'Zayn' : 'Rohit Mehta'),
    groomBio: defaultData.groomBio || (isRoyalGrace ? 'Son of Mr. & Mrs. Malik • B.E., M.S., Data Scientist' : 'Son of Smt. Sunita & Shri Ramesh Mehta'),
    brideName: initialDesign?.bride_name || defaultData.brideName || (isRoyalGrace ? 'Nora' : 'Priya Sharma'),
    brideBio: defaultData.brideBio || (isRoyalGrace ? 'Daughter of Mr. & Mrs. Nasser • MBBS, M.D., Pediatrician' : 'Daughter of Smt. Kavita & Shri Rajesh Sharma'),
    parentsGroom: defaultData.parentsGroom || (isRoyalGrace ? 'Mr. & Mrs. Malik' : 'Smt. Sunita & Shri Ramesh Mehta'),
    parentsBride: defaultData.parentsBride || (isRoyalGrace ? 'Mr. & Mrs. Nasser' : 'Smt. Kavita & Shri Rajesh Sharma'),
    weddingDate: initialDesign?.wedding_date || defaultData.weddingDate || 'December 12, 2026',
    weddingTime: defaultData.weddingTime || '7:00 PM Onwards',
    venue: initialDesign?.venue || defaultData.venue || (isRoyalGrace ? 'The Emerald Palace & Ballroom' : 'The Grand Heritage Palace'),
    city: defaultData.city || (isRoyalGrace ? 'Dubai / New Delhi' : 'Udaipur, Rajasthan'),
    rsvp: defaultData.rsvp || '+91 98765 43210 / +91 91234 56789',
    tagline: defaultData.tagline || (isRoyalGrace ? "We're getting married" : 'Together with our families, we invite you to celebrate'),
    shloka: isRoyalGrace ? 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' : '॥ श्री गणेशाय नमः ॥',
    symbol: isRoyalGrace ? 'heart' : 'ganesh', // ganesh, rings, lotus, kalash, heart
    theme: defaultData.theme || (isRoyalGrace ? 'royal-grace' : 'royal-maroon'),
    primaryColor: defaultData.primaryColor || (isRoyalGrace ? '#244837' : '#6B1D2F'),
    accentColor: defaultData.accentColor || (isRoyalGrace ? '#C49F56' : '#D4AF37'),
    bgColor: defaultData.bgColor || (isRoyalGrace ? '#F5EFE7' : '#400914'),
    textColor: defaultData.textColor || (isRoyalGrace ? '#1E3E2F' : '#FFF7E6'),
    subTextColor: defaultData.subTextColor || (isRoyalGrace ? '#4D6B5D' : '#E5C07B'),
    fontFamily: defaultData.fontFamily || (isRoyalGrace ? 'Cormorant Garamond' : 'Cinzel'),
    scriptFont: defaultData.scriptFont || 'Great Vibes',
    photoUrl: defaultData.photoUrl || null,
    nameOrder: initialDesign?.custom_data?.nameOrder || defaultData.nameOrder || 'groom',
    invitationType: defaultData.invitationType || 'Wedding Invitation',
    invitationSubtitle: defaultData.invitationSubtitle || '',
    invitationCollection: defaultData.invitationCollection || 'Traditional Indian',
    coupleDetailsEnabled: defaultData.coupleDetailsEnabled ?? true,
    showGroomBio: defaultData.showGroomBio ?? true,
    showBrideBio: defaultData.showBrideBio ?? true,
    showParents: defaultData.showParents ?? true,
    showPhotoSection: defaultData.showPhotoSection ?? true,
    showProgramTimeline: defaultData.showProgramTimeline ?? true,
    showGoogleMap: defaultData.showGoogleMap ?? false,
    googleMapLink: defaultData.googleMapLink || '',
    mapButtonText: defaultData.mapButtonText || 'View Location',
    showDressCode: defaultData.showDressCode ?? false,
    dressCode: defaultData.dressCode || '',
    showPreWeddingEvents: defaultData.showPreWeddingEvents ?? false,
    preWeddingEvents: defaultData.preWeddingEvents || '',
    showTransportation: defaultData.showTransportation ?? false,
    transportation: defaultData.transportation || '',
    showAccommodation: defaultData.showAccommodation ?? false,
    accommodation: defaultData.accommodation || '',
    showGiftMessage: defaultData.showGiftMessage ?? false,
    giftMessage: defaultData.giftMessage || '',
    showClosingMessage: defaultData.showClosingMessage ?? true,
    closingMessage: defaultData.closingMessage || 'With love and blessings, we look forward to celebrating with you.',
    showSelfClosing: defaultData.showSelfClosing ?? true,
    selfClosingMessage: defaultData.selfClosingMessage || 'Together with our families',
    showSaveTheDate: defaultData.showSaveTheDate ?? false,
    showCountdown: defaultData.showCountdown ?? false,
    showRsvpButton: defaultData.showRsvpButton ?? true,
    rsvpButtonText: defaultData.rsvpButtonText || 'Confirm Your Presence',
    backgroundMode: defaultData.backgroundMode || 'theme',
    backgroundImageUrl: defaultData.backgroundImageUrl || '',
    backgroundMusicUrl: defaultData.backgroundMusicUrl || '',
    events: defaultData.events || (isRoyalGrace ? [
      { name: 'Katb Al-Kitab (Nikah)', date: 'Dec 19, 2026', time: '05:00 PM', venue: 'Grand Mosque Hall' },
      { name: 'Grand Wedding Reception', date: 'Dec 20, 2026', time: '07:30 PM', venue: 'The Emerald Ballroom' }
    ] : [
      { name: 'Mehendi & Sangeet', date: 'Dec 11, 2026', time: '05:00 PM', venue: 'Lawn 1, The Grand Palace' },
      { name: 'Wedding Ceremony', date: 'Dec 12, 2026', time: '07:00 PM', venue: 'Main Mandap Hall' },
      { name: 'Reception Dinner', date: 'Dec 13, 2026', time: '08:00 PM', venue: 'Grand Ballroom' }
    ])
  });

  // Check purchase status on mount or user change
  useEffect(() => {
    async function checkLicense() {
      if (!token) {
        setIsPurchased(false);
        setCheckingPurchase(false);
        return;
      }

      try {
        const templateId = template?.id || 1;
        const designId = currentDesignId || initialDesign?.id || '';
        const res = await fetchWithAuth(`/api/orders/check?template_id=${templateId}&design_id=${designId}`);
        const data = await res.json();
        if (data.success && data.is_purchased) {
          setIsPurchased(true);
        } else {
          setIsPurchased(false);
        }
      } catch (err) {
        console.error('Error checking purchase license', err);
      } finally {
        setCheckingPurchase(false);
      }
    }

    checkLicense();
  }, [token, template?.id, currentDesignId]);

  // Handle Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new Event
  const addEvent = () => {
    setFormData(prev => ({
      ...prev,
      events: [
        ...prev.events,
        { name: 'Celebration Ritual', date: formData.weddingDate, time: '10:00 AM', venue: formData.venue }
      ]
    }));
  };

  // Remove Event
  const removeEvent = (index) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.filter((_, i) => i !== index)
    }));
  };

  // Update Event
  const updateEvent = (index, field, value) => {
    setFormData(prev => {
      const newEvents = [...prev.events];
      newEvents[index] = { ...newEvents[index], [field]: value };
      return { ...prev, events: newEvents };
    });
  };

  // Save to PHP Backend
  const handleSaveDesign = async () => {
    if (!token) {
      openLogin();
      return;
    }

    setSaving(true);
    setSaveSuccessMsg('');

    try {
      const payload = {
        id: currentDesignId,
        template_id: template?.id || 1,
        title: formData.title,
        bride_name: formData.brideName,
        groom_name: formData.groomName,
        wedding_date: formData.weddingDate,
        venue: formData.venue,
        custom_data: formData,
        preview_image: formData.photoUrl || ''
      };

      const res = await fetchWithAuth('/api/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setCurrentDesignId(data.design_id);
        setSaveSuccessMsg('Design saved to your account!');
        setTimeout(() => setSaveSuccessMsg(''), 4000);
      } else {
        alert(data.message || 'Failed to save design');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving design');
    } finally {
      setSaving(false);
    }
  };

  // Process Instant Purchase to Remove Watermark
  const handleCompletePurchase = async () => {
    if (!token) {
      setCheckoutModalOpen(false);
      openLogin();
      return;
    }

    setPaymentProcessing(true);
    try {
      const res = await fetchWithAuth('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_id: template?.id || 1,
          design_id: currentDesignId || null,
          amount: template?.price || 999
        })
      });
      const data = await res.json();

      if (data.success) {
        setIsPurchased(true);
        setCheckoutModalOpen(false);
        setPaymentSuccessMsg('🎉 Payment Successful! Watermark permanently removed.');
        setTimeout(() => setPaymentSuccessMsg(''), 5000);
      } else {
        alert(data.message || 'Purchase failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error completing payment');
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Client-Side Canvas Download (PNG with watermark if unpurchased)
  const handleDownloadImage = () => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    // Use HTML Canvas to render
    const canvas = document.createElement('canvas');
    const width = 800;
    const height = 1100;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Background Fill
    ctx.fillStyle = formData.bgColor || '#400914';
    ctx.fillRect(0, 0, width, height);

    // Decorative Borders
    ctx.strokeStyle = formData.accentColor || '#D4AF37';
    ctx.lineWidth = 4;
    ctx.strokeRect(25, 25, width - 50, height - 50);

    ctx.strokeStyle = '#FFFFFF33';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(35, 35, width - 70, height - 70);

    // Header Text
    ctx.textAlign = 'center';
    ctx.fillStyle = formData.subTextColor || '#E5C07B';
    ctx.font = '22px Cinzel, serif';
    ctx.fillText(formData.shloka, width / 2, 85);

    ctx.font = '16px serif';
    ctx.fillStyle = formData.subTextColor || '#E5C07B';
    ctx.fillText(formData.tagline.toUpperCase(), width / 2, 130);

    // Groom Name
    ctx.font = 'bold 44px Cinzel, serif';
    ctx.fillStyle = formData.textColor || '#FFF7E6';
    ctx.fillText(formData.groomName, width / 2, 280);

    if (formData.groomBio) {
      ctx.font = 'italic 16px serif';
      ctx.fillStyle = formData.subTextColor || '#E5C07B';
      ctx.fillText(formData.groomBio, width / 2, 315);
    }

    // Weds
    ctx.font = 'italic 48px "Great Vibes", cursive';
    ctx.fillStyle = formData.accentColor || '#D4AF37';
    ctx.fillText('&', width / 2, 375);

    // Bride Name
    ctx.font = 'bold 44px Cinzel, serif';
    ctx.fillStyle = formData.textColor || '#FFF7E6';
    ctx.fillText(formData.brideName, width / 2, 440);

    if (formData.brideBio) {
      ctx.font = 'italic 16px serif';
      ctx.fillStyle = formData.subTextColor || '#E5C07B';
      ctx.fillText(formData.brideBio, width / 2, 475);
    }

    // Date & Time
    ctx.fillStyle = formData.accentColor || '#D4AF37';
    ctx.font = 'bold 24px Cinzel, serif';
    ctx.fillText(formData.weddingDate.toUpperCase(), width / 2, 570);
    ctx.font = '18px serif';
    ctx.fillStyle = formData.textColor || '#FFF7E6';
    ctx.fillText(formData.weddingTime, width / 2, 605);

    // Venue
    ctx.font = 'bold 20px serif';
    ctx.fillText(formData.venue, width / 2, 660);
    ctx.font = '16px serif';
    ctx.fillStyle = formData.subTextColor || '#E5C07B';
    ctx.fillText(formData.city, width / 2, 690);

    // Events divider
    ctx.strokeStyle = formData.accentColor || '#D4AF37';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(200, 730);
    ctx.lineTo(600, 730);
    ctx.stroke();

    ctx.font = 'bold 16px Cinzel, serif';
    ctx.fillStyle = formData.accentColor || '#D4AF37';
    ctx.fillText('WEDDING CELEBRATIONS', width / 2, 765);

    let eventY = 805;
    formData.events.slice(0, 3).forEach(ev => {
      ctx.font = 'bold 16px serif';
      ctx.fillStyle = formData.textColor || '#FFF7E6';
      ctx.fillText(`${ev.name}: ${ev.date} at ${ev.time}`, width / 2, eventY);
      ctx.font = '13px serif';
      ctx.fillStyle = formData.subTextColor || '#E5C07B';
      ctx.fillText(ev.venue, width / 2, eventY + 22);
      eventY += 50;
    });

    // RSVP
    ctx.font = '14px Cinzel, serif';
    ctx.fillStyle = formData.accentColor || '#D4AF37';
    ctx.fillText(`RSVP: ${formData.rsvp}`, width / 2, 1020);

    // WATERMARK LOGIC: IF NOT PURCHASED, STAMP REPEATING DIAGONAL WATERMARK OVER CANVAS
    if (!isPurchased) {
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(-28 * Math.PI / 180);
      ctx.textAlign = 'center';

      const watermarkLines = [
        { text: 'WEDDINVITES PREVIEW • UNLICENSED', y: -320, size: 28, alpha: 0.28 },
        { text: 'BUY TEMPLATE TO REMOVE WATERMARK', y: -180, size: 24, alpha: 0.25 },
        { text: 'WEDDINVITES.STORE • PREVIEW ONLY', y: -40, size: 36, alpha: 0.35 },
        { text: 'PURCHASE TO UNLOCK HIGH-RES PRINT', y: 110, size: 24, alpha: 0.28 },
        { text: 'WEDDINVITES PREVIEW • UNLICENSED', y: 250, size: 28, alpha: 0.28 }
      ];

      watermarkLines.forEach(line => {
        ctx.font = `bold ${line.size}px sans-serif`;
        ctx.fillStyle = `rgba(255, 255, 255, ${line.alpha})`;
        ctx.strokeStyle = `rgba(0, 0, 0, ${line.alpha * 0.7})`;
        ctx.lineWidth = 2;
        ctx.strokeText(line.text, 0, line.y);
        ctx.fillText(line.text, 0, line.y);
      });

      ctx.restore();
    }

    // Export & Download
    const link = document.createElement('a');
    const suffix = isPurchased ? 'WatermarkFree_HD' : 'PREVIEW_Watermarked';
    link.download = `${formData.groomName}_${formData.brideName}_Wedding_Invite_${suffix}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const Field = ({ label, value, onChange, placeholder = '', multiline = false }) => (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-gray-700">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className="w-full text-xs p-2 border border-gray-200 rounded-lg bg-white" />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full text-xs p-2 border border-gray-200 rounded-lg bg-white" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F4F0] flex flex-col">
      
      {/* Top Editor Navbar - 100% Mobile Responsive */}
      <header className="bg-white border-b border-gray-200 px-3 sm:px-6 py-2.5 sm:py-3 sticky top-0 z-30 shadow-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onBack}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition flex items-center gap-1 text-xs font-semibold cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="h-5 w-[1px] bg-gray-200 shrink-0"></div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 truncate">
              <h1 className="font-serif font-bold text-xs sm:text-base text-gray-900 leading-tight truncate">
                {template?.title || 'Invitation Editor'}
              </h1>
              {isPurchased ? (
                <span className="bg-green-100 text-green-800 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shrink-0">
                  <Check className="w-3 h-3" /> Clean HD
                </span>
              ) : (
                <span className="bg-amber-100 text-amber-900 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shrink-0">
                  <Lock className="w-3 h-3" /> Watermark
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {saveSuccessMsg && (
            <span className="text-[10px] sm:text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full font-medium hidden md:inline">
              ✓ {saveSuccessMsg}
            </span>
          )}

          {/* Unlock / Buy Button */}
          {!isPurchased && (
            <button
              onClick={() => setCheckoutModalOpen(true)}
              className="px-2.5 py-1.5 sm:px-3.5 bg-[#ECC274] hover:bg-[#D4AF37] text-[#400914] text-[11px] sm:text-xs font-bold rounded-md shadow-xs transition flex items-center gap-1 cursor-pointer animate-pulse"
              title="Remove watermark and unlock HD files"
            >
              <Unlock className="w-3.5 h-3.5 text-[#400914]" />
              <span className="hidden xs:inline">Buy</span> ₹{template?.price || 999}
            </button>
          )}

          <button
            onClick={handleSaveDesign}
            disabled={saving}
            className="px-2.5 py-1.5 sm:px-3 bg-white border border-[#6B1D2F] text-[#6B1D2F] hover:bg-[#FAF3F0] text-[11px] sm:text-xs font-semibold rounded-md shadow-xs transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{saving ? 'Saving...' : 'Save'}</span>
          </button>

          <button
            onClick={handleDownloadImage}
            className={`px-3 py-1.5 sm:px-4 text-white text-[11px] sm:text-xs font-semibold rounded-md shadow-xs transition flex items-center gap-1 cursor-pointer ${
              isPurchased 
                ? 'bg-[#15803D] hover:bg-[#166534]' 
                : 'bg-[#6B1D2F] hover:bg-[#521321]'
            }`}
            title={isPurchased ? 'Download Watermark-Free HD' : 'Download Preview (Watermarked)'}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isPurchased ? 'HD' : 'PNG'}</span>
          </button>

          <button
            onClick={handlePrint}
            title="Print or Save as PDF"
            className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition cursor-pointer hidden md:flex items-center"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MOBILE VIEW TOGGLE BAR (Visible only on screens < lg) */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-center gap-2 sticky top-[53px] z-20 shadow-xs">
        <button
          onClick={() => setMobileTab('form')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === 'form'
              ? 'bg-[#6B1D2F] text-white shadow-xs'
              : 'bg-[#FAF3F0] text-gray-700 hover:bg-[#F2DDD3]'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Form Details</span>
        </button>

        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === 'preview'
              ? 'bg-[#6B1D2F] text-white shadow-xs'
              : 'bg-[#FAF3F0] text-gray-700 hover:bg-[#F2DDD3]'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Live Card Preview</span>
        </button>
      </div>

      {/* Main Workspace Split View */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Left Side: Customization Sidebar & Tabs */}
        <div className={`w-full lg:w-[460px] bg-white border-r border-gray-200 flex-col h-auto lg:h-[calc(100vh-57px)] overflow-y-auto ${
          mobileTab === 'form' ? 'flex' : 'hidden lg:flex'
        }`}>
          
          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-100 bg-[#FFFDFB] sticky top-0 z-20">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
                activeTab === 'details'
                  ? 'border-[#6B1D2F] text-[#6B1D2F] bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
                activeTab === 'events'
                  ? 'border-[#6B1D2F] text-[#6B1D2F] bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Events ({formData.events.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('theme')}
              className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
                activeTab === 'theme'
                  ? 'border-[#6B1D2F] text-[#6B1D2F] bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Theme</span>
            </button>

            <button
              onClick={() => setActiveTab('photo')}
              className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
                activeTab === 'photo'
                  ? 'border-[#6B1D2F] text-[#6B1D2F] bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Photo</span>
            </button>

            <button
              onClick={() => setActiveTab('optional')}
              className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
                activeTab === 'optional'
                  ? 'border-[#6B1D2F] text-[#6B1D2F] bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Optional</span>
            </button>
          </div>

          {/* Tab Content Panes */}
          <div className="p-4 sm:p-5 space-y-4 sm:space-y-5 pb-20 lg:pb-6">
            
            {/* TAB 1: DETAILS */}
            {activeTab === 'details' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Design Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#6B1D2F]"
                  />
                </div>

                <div className="p-3 bg-[#FAF7F5] rounded-xl border border-[#E8D8C5] space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Couple Names Styling</label>
                  <p className="text-[11px] text-gray-500">Choose whose name appears first on the invitation.</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setFormData(p => ({...p,nameOrder:'groom'}))} className={`py-2 px-3 rounded-lg border text-xs font-semibold ${formData.nameOrder==='groom'?'bg-[#6B1D2F] text-white border-[#6B1D2F]':'bg-white text-gray-700 border-gray-200'}`}>Groom First</button>
                    <button type="button" onClick={() => setFormData(p => ({...p,nameOrder:'bride'}))} className={`py-2 px-3 rounded-lg border text-xs font-semibold ${formData.nameOrder==='bride'?'bg-[#6B1D2F] text-white border-[#6B1D2F]':'bg-white text-gray-700 border-gray-200'}`}>Bride First</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Groom's Name
                    </label>
                    <input
                      type="text"
                      value={formData.groomName}
                      onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                      placeholder="Zayn / Rohit"
                      className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#6B1D2F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Bride's Name
                    </label>
                    <input
                      type="text"
                      value={formData.brideName}
                      onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                      placeholder="Nora / Priya"
                      className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#6B1D2F]"
                    />
                  </div>
                </div>

                {/* Optional Bios / Qualifications (Zareqia Style) */}
                <div className="p-3 bg-[#FAF7F5] rounded-xl border border-gray-200 space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B1D2F] block">
                    Profession & Education Line (Optional)
                  </span>
                  <div>
                    <input
                      type="text"
                      value={formData.groomBio}
                      onChange={(e) => setFormData({ ...formData, groomBio: e.target.value })}
                      placeholder="e.g. Son of Mr. & Mrs. Malik • Data Scientist"
                      className="w-full text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#6B1D2F]"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={formData.brideBio}
                      onChange={(e) => setFormData({ ...formData, brideBio: e.target.value })}
                      placeholder="e.g. Daughter of Mr. & Mrs. Nasser • Pediatrician"
                      className="w-full text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#6B1D2F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Wedding Date
                    </label>
                    <input
                      type="text"
                      value={formData.weddingDate}
                      onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                      placeholder="December 12, 2026"
                      className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#6B1D2F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Time
                    </label>
                    <input
                      type="text"
                      value={formData.weddingTime}
                      onChange={(e) => setFormData({ ...formData, weddingTime: e.target.value })}
                      placeholder="7:00 PM Onwards"
                      className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#6B1D2F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Venue / Resort
                    </label>
                    <input
                      type="text"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      placeholder="The Emerald Ballroom"
                      className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#6B1D2F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      City & Country
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Dubai / Udaipur"
                      className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#6B1D2F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    RSVP Contact Number
                  </label>
                  <input
                    type="text"
                    value={formData.rsvp}
                    onChange={(e) => setFormData({ ...formData, rsvp: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#6B1D2F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Heading / Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="We're getting married"
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#6B1D2F]"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: EVENTS SCHEDULE */}
            {activeTab === 'events' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Wedding Rituals & Celebrations
                  </span>
                  <button
                    onClick={addEvent}
                    className="text-xs font-semibold text-[#6B1D2F] hover:text-[#4A1221] flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Event</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.events.map((ev, index) => (
                    <div key={index} className="p-3 bg-[#FAF7F5] border border-gray-200 rounded-xl space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={ev.name}
                          onChange={(e) => updateEvent(index, 'name', e.target.value)}
                          placeholder="Event Name (e.g. Sangeet / Nikah)"
                          className="font-semibold text-xs text-gray-900 bg-transparent border-b border-gray-300 pb-0.5 focus:outline-none focus:border-[#6B1D2F] w-2/3"
                        />
                        {formData.events.length > 1 && (
                          <button
                            onClick={() => removeEvent(index)}
                            className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                            title="Remove event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={ev.date}
                          onChange={(e) => updateEvent(index, 'date', e.target.value)}
                          placeholder="Date"
                          className="text-xs px-2 py-1 bg-white border border-gray-200 rounded focus:outline-none focus:border-[#6B1D2F]"
                        />
                        <input
                          type="text"
                          value={ev.time}
                          onChange={(e) => updateEvent(index, 'time', e.target.value)}
                          placeholder="Time"
                          className="text-xs px-2 py-1 bg-white border border-gray-200 rounded focus:outline-none focus:border-[#6B1D2F]"
                        />
                      </div>

                      <input
                        type="text"
                        value={ev.venue}
                        onChange={(e) => updateEvent(index, 'venue', e.target.value)}
                        placeholder="Venue location"
                        className="w-full text-xs px-2 py-1 bg-white border border-gray-200 rounded focus:outline-none focus:border-[#6B1D2F]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: THEME & STYLE */}
            {activeTab === 'theme' && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Theme Presets
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { name: 'Royal Grace (Zareqia Emerald)', bg: '#F5EFE7', primary: '#244837', accent: '#C49F56', text: '#1E3E2F', subText: '#426051', font: 'Cormorant Garamond', theme: 'royal-grace' },
                      { name: 'Royal Maroon & Gold', bg: '#400914', primary: '#6B1D2F', accent: '#D4AF37', text: '#FFF7E6', subText: '#E5C07B', font: 'Cinzel', theme: 'royal-maroon' },
                      { name: 'Emerald Forest', bg: '#082319', primary: '#0F382A', accent: '#E5C07B', text: '#F4E8D1', subText: '#C5AF8A', font: 'Cormorant Garamond', theme: 'emerald-gold' },
                      { name: 'Blush Cream Rose', bg: '#FFFDF9', primary: '#8C3B4E', accent: '#C49A45', text: '#3D282E', subText: '#7A5B64', font: 'Playfair Display', theme: 'floral-cream' },
                      { name: 'Desert Terracotta', bg: '#FCF4EE', primary: '#9E3D24', accent: '#F4A261', text: '#441E14', subText: '#8C5648', font: 'Cinzel', theme: 'desert-terracotta' },
                      { name: 'Royal Blue Sapphire', bg: '#0A1326', primary: '#1B2A4A', accent: '#E5C07B', text: '#F5E6CA', subText: '#A6BBD9', font: 'Cinzel', theme: 'royal-blue' }
                    ].map((th) => (
                      <button
                        key={th.name}
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            theme: th.theme,
                            bgColor: th.bg,
                            primaryColor: th.primary,
                            accentColor: th.accent,
                            textColor: th.text,
                            subTextColor: th.subText,
                            fontFamily: th.font
                          }));
                        }}
                        className={`p-2.5 border rounded-lg text-left transition flex items-center gap-2 cursor-pointer bg-white ${
                          formData.theme === th.theme ? 'border-[#6B1D2F] ring-1 ring-[#6B1D2F]' : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <div 
                          className="w-5 h-5 rounded-full border border-gray-300 shadow-xs shrink-0" 
                          style={{ backgroundColor: th.bg }}
                        />
                        <span className="text-xs font-medium text-gray-800 truncate">{th.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cultural Symbol */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Auspicious Symbol
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'ganesh', label: 'Ganesh', icon: '॥ 卐 ॥' },
                      { id: 'heart', label: 'Heart', icon: '♥' },
                      { id: 'rings', label: 'Rings', icon: '💍' },
                      { id: 'lotus', label: 'Lotus', icon: '🪷' }
                    ].map((sym) => (
                      <button
                        key={sym.id}
                        onClick={() => setFormData({ ...formData, symbol: sym.id })}
                        className={`p-2 border rounded-lg text-center transition cursor-pointer ${
                          formData.symbol === sym.id
                            ? 'border-[#6B1D2F] bg-[#FAF3F0] text-[#6B1D2F] font-bold'
                            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-base mb-1">{sym.icon}</div>
                        <span className="text-[10px] block">{sym.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Pickers */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Background Tint</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.bgColor}
                        onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                        className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                      />
                      <span className="text-xs font-mono text-gray-600 uppercase">{formData.bgColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Accent Gold</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.accentColor}
                        onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                        className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                      />
                      <span className="text-xs font-mono text-gray-600 uppercase">{formData.accentColor}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: OPTIONAL SECTIONS */}
            {activeTab === 'optional' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h3 className="text-sm font-serif font-bold text-[#6B1D2F]">Optional Sections</h3>
                  <p className="text-[11px] text-gray-500">Switch on only the sections you want to show.</p>
                </div>

                <div className="p-3 bg-[#FAF7F5] border border-gray-200 rounded-xl space-y-2">
                  <Field label="Invitation Subtitle" value={formData.invitationSubtitle} onChange={v=>setFormData(p=>({...p,invitationSubtitle:v}))} placeholder="A celebration of love..." />
                  <label className="text-xs font-bold text-gray-700 block">Invitation Type</label>
                  <select value={formData.invitationType} onChange={e=>setFormData(p=>({...p,invitationType:e.target.value}))} className="w-full text-xs p-2 border border-gray-200 rounded-lg bg-white">
                    <option>Wedding Invitation</option><option>Engagement Invitation</option><option>Reception Invitation</option><option>Save the Date</option><option>Wedding Announcement</option>
                  </select>
                  <label className="text-xs font-bold text-gray-700 block">Invitation Collection</label>
                  <select value={formData.invitationCollection} onChange={e=>setFormData(p=>({...p,invitationCollection:e.target.value}))} className="w-full text-xs p-2 border border-gray-200 rounded-lg bg-white">
                    <option>Traditional Indian</option><option>Royal Indian</option><option>Floral</option><option>Minimal & Modern</option><option>Destination Wedding</option>
                  </select>
                  <label className="text-xs font-bold text-gray-700 block">Background</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={()=>setFormData(p=>({...p,backgroundMode:'theme'}))} className={`p-2 rounded-lg border text-xs ${formData.backgroundMode==='theme'?'border-[#6B1D2F] bg-[#FAF3F0] text-[#6B1D2F]':'border-gray-200 bg-white'}`}>Theme</button>
                    <button type="button" onClick={()=>setFormData(p=>({...p,backgroundMode:'photo'}))} className={`p-2 rounded-lg border text-xs ${formData.backgroundMode==='photo'?'border-[#6B1D2F] bg-[#FAF3F0] text-[#6B1D2F]':'border-gray-200 bg-white'}`}>Photo</button>
                  </div>
                  {formData.backgroundMode==='photo' && <Field label="Background Image URL" value={formData.backgroundImageUrl} onChange={v=>setFormData(p=>({...p,backgroundImageUrl:v}))} placeholder="https://..." />}
                </div>

                <div className="space-y-2">
                  {[
                    ['coupleDetailsEnabled','Couple Details'],['showGroomBio','Groom Details'],['showBrideBio','Bride Details'],
                    ['showParents','Parents Names'],['showPhotoSection','Photo Section'],['showProgramTimeline','Program Timeline'],
                    ['showGoogleMap','Google Map'],['showDressCode','Dress Code'],['showPreWeddingEvents','Pre-Wedding Events'],
                    ['showTransportation','Transportation'],['showAccommodation','Accommodation'],['showGiftMessage','Gift Message'],
                    ['showClosingMessage','Closing Message'],['showSelfClosing','Self-Closing Line'],['showSaveTheDate','Save the Date'],
                    ['showCountdown','Countdown'],['showRsvpButton','RSVP Button']
                  ].map(([key,label]) => (
                    <label key={key} className="flex items-center justify-between gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer">
                      <span className="text-xs font-semibold text-gray-700">{label}</span>
                      <input type="checkbox" checked={!!formData[key]} onChange={e=>setFormData(p=>({...p,[key]:e.target.checked}))} className="h-4 w-4 accent-[#A98235]" />
                    </label>
                  ))}
                </div>

                <div className="space-y-3 p-3 bg-[#FAF7F5] border border-gray-200 rounded-xl">
                  {formData.showGoogleMap && <Field label="Google Map Link" value={formData.googleMapLink} onChange={v=>setFormData(p=>({...p,googleMapLink:v}))} placeholder="Paste Google Maps URL" />}
                  {formData.showGoogleMap && <Field label="Map Button Text" value={formData.mapButtonText} onChange={v=>setFormData(p=>({...p,mapButtonText:v}))} />}
                  {formData.showDressCode && <Field label="Dress Code" value={formData.dressCode} onChange={v=>setFormData(p=>({...p,dressCode:v}))} placeholder="e.g. Pastel / Traditional attire" />}
                  {formData.showPreWeddingEvents && <Field label="Pre-Wedding Events" value={formData.preWeddingEvents} onChange={v=>setFormData(p=>({...p,preWeddingEvents:v}))} multiline />}
                  {formData.showTransportation && <Field label="Transportation Details" value={formData.transportation} onChange={v=>setFormData(p=>({...p,transportation:v}))} multiline />}
                  {formData.showAccommodation && <Field label="Accommodation Details" value={formData.accommodation} onChange={v=>setFormData(p=>({...p,accommodation:v}))} multiline />}
                  {formData.showGiftMessage && <Field label="Gift Message" value={formData.giftMessage} onChange={v=>setFormData(p=>({...p,giftMessage:v}))} multiline />}
                  {formData.showClosingMessage && <Field label="Closing Message" value={formData.closingMessage} onChange={v=>setFormData(p=>({...p,closingMessage:v}))} multiline />}
                  {formData.showSelfClosing && <Field label="Self-Closing Line" value={formData.selfClosingMessage} onChange={v=>setFormData(p=>({...p,selfClosingMessage:v}))} />}
                  {formData.showRsvpButton && <Field label="RSVP Button Text" value={formData.rsvpButtonText} onChange={v=>setFormData(p=>({...p,rsvpButtonText:v}))} />}
                </div>

                <div className="p-3 bg-white border border-gray-200 rounded-xl space-y-2">
                  <Field label="Background Music MP3 URL" value={formData.backgroundMusicUrl} onChange={v=>setFormData(p=>({...p,backgroundMusicUrl:v}))} placeholder="Paste a direct MP3 URL" />
                  <p className="text-[10px] text-gray-500">This stores the music URL in the design. Playback must also be implemented on the published invitation page.</p>
                </div>
              </div>
            )}

            {/* TAB 4: COUPLE PHOTO */}
            {activeTab === 'photo' && (
              <div className="space-y-4 animate-fade-in">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Add Couple Portrait
                </span>
                <p className="text-xs text-gray-500">
                  Upload a photo of the bride and groom to feature inside the wedding arch.
                </p>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#6B1D2F] transition bg-gray-50">
                  {formData.photoUrl ? (
                    <div className="space-y-3">
                      <img
                        src={formData.photoUrl}
                        alt="Couple preview"
                        className="w-28 h-28 mx-auto rounded-full object-cover border-2 border-[#D4AF37] shadow-md"
                      />
                      <button
                        onClick={() => setFormData({ ...formData, photoUrl: null })}
                        className="text-xs text-red-600 hover:underline font-semibold cursor-pointer"
                      >
                        Remove Photo
                      </button>
                    </div>
                  ) : (
                    <div>
                      <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <label className="inline-block px-4 py-2 bg-[#6B1D2F] text-white text-xs font-semibold rounded-lg cursor-pointer hover:bg-[#521321] transition shadow-xs">
                        Browse Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[11px] text-gray-400 mt-2">
                        JPG, PNG, or WEBP up to 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Side: High-Resolution Live Canvas Preview (Responsive scaling for phones) */}
        <div className={`flex-1 bg-[#2C292E] p-3 sm:p-8 flex-col items-center justify-center relative overflow-y-auto ${
          mobileTab === 'preview' ? 'flex' : 'hidden lg:flex'
        }`}>
          
          {/* Watermark notification banner if unpurchased */}
          {!isPurchased && (
            <div className="w-full max-w-md mb-3 bg-amber-500/15 border border-amber-400/40 backdrop-blur-md px-3.5 py-2 rounded-xl text-amber-200 text-xs flex items-center justify-between gap-2 shadow-lg z-10 animate-fade-in">
              <div className="flex items-center gap-1.5 min-w-0">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">
                  <strong>Watermark Active:</strong> Buy to unlock 4K print file.
                </span>
              </div>
              <button
                onClick={() => setCheckoutModalOpen(true)}
                className="px-2.5 py-1 bg-[#ECC274] hover:bg-[#D4AF37] text-[#400914] font-bold text-[10px] rounded transition shrink-0 cursor-pointer"
              >
                Buy ₹{template?.price || 999}
              </button>
            </div>
          )}

          {/* Zoom controls (Desktop) */}
          <div className="hidden sm:flex absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full items-center gap-3 text-white text-xs z-10">
            <button
              onClick={() => setZoomLevel(Math.max(0.65, zoomLevel - 0.1))}
              className="hover:text-[#ECC274] transition"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel(Math.min(1.3, zoomLevel + 0.1))}
              className="hover:text-[#ECC274] transition"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Invitation Card Canvas Container - Auto-scaled for phone screens */}
          <div 
            style={{ 
              transform: `scale(${zoomLevel})`, 
              transformOrigin: 'center top' 
            }}
            className="transition-transform duration-200 my-auto py-2 scale-[0.78] xs:scale-[0.88] sm:scale-100"
          >
            <div 
              ref={cardRef}
              style={{
                backgroundColor: formData.bgColor,
                color: formData.textColor,
                fontFamily: formData.fontFamily,
                borderColor: formData.accentColor
              }}
              className="w-[360px] sm:w-[420px] min-h-[600px] rounded-t-[100px] rounded-b-2xl shadow-2xl p-6 sm:p-7 relative flex flex-col justify-between border-4 overflow-hidden select-none transition-colors duration-300"
            >
              {/* If Royal Grace theme: Background image overlay */}
              {formData.theme === 'royal-grace' && (
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none"
                  style={{ backgroundImage: `url('/assets/royal-grace-bg.jpg')` }}
                ></div>
              )}

              {/* Inner Decorative Arch Border */}
              <div 
                style={{ borderColor: formData.accentColor }}
                className="absolute inset-3 border-2 rounded-t-[90px] rounded-b-xl opacity-60 pointer-events-none"
              ></div>
              <div 
                style={{ borderColor: formData.accentColor }}
                className="absolute inset-4 border border-dashed rounded-t-[85px] rounded-b-lg opacity-40 pointer-events-none"
              ></div>

              {/* WATERMARK OVERLAY WHEN NOT PURCHASED */}
              {!isPurchased && (
                <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-around py-12 overflow-hidden select-none">
                  <div className="transform -rotate-25 opacity-20 text-center font-bold font-sans text-white text-sm tracking-[0.25em] whitespace-nowrap drop-shadow">
                    WEDDINVITES PREVIEW • UNLICENSED
                  </div>
                  <div className="transform -rotate-25 opacity-30 text-center font-bold font-sans text-[#ECC274] text-xl tracking-[0.3em] whitespace-nowrap drop-shadow">
                    ★ WEDDINVITES PREVIEW ★
                  </div>
                  <div className="transform -rotate-25 opacity-25 text-center font-bold font-sans text-white text-xs tracking-[0.2em] whitespace-nowrap drop-shadow">
                    BUY TEMPLATE TO REMOVE WATERMARK
                  </div>
                  <div className="transform -rotate-25 opacity-25 text-center font-bold font-sans text-[#ECC274] text-sm tracking-[0.25em] whitespace-nowrap drop-shadow">
                    WEDDINVITES.STORE • PREVIEW ONLY
                  </div>
                </div>
              )}

              {/* Top Header Motif & Shloka */}
              <div className="text-center pt-3 z-10">
                <div className="text-xl mb-1" style={{ color: formData.accentColor }}>
                  {formData.symbol === 'ganesh' && '॥ 卐 ॥'}
                  {formData.symbol === 'rings' && '💍'}
                  {formData.symbol === 'lotus' && '🪷'}
                  {formData.symbol === 'heart' && '♥'}
                </div>
                <div 
                  style={{ color: formData.subTextColor }}
                  className="text-[11px] uppercase tracking-[0.25em] font-semibold"
                >
                  {formData.shloka}
                </div>
                <p 
                  style={{ color: formData.subTextColor }}
                  className="text-[10px] uppercase tracking-widest mt-1 opacity-90 font-serif"
                >
                  {formData.tagline}
                </p>
              </div>

              {/* Middle Section: Couple & Parents */}
              <div className="my-auto text-center py-4 z-10 space-y-2">
                {/* Couple Photo if uploaded */}
                {formData.photoUrl && (
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 my-2 shadow-lg" style={{ borderColor: formData.accentColor }}>
                    <img src={formData.photoUrl} alt="Couple" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Names: order follows Couple Names Styling */}
                <div className="pt-2">
                  {formData.nameOrder === 'bride' ? (
                    <>
                      <h2 className="text-3xl sm:text-4xl font-bold tracking-wider drop-shadow-sm font-script">{formData.brideName}</h2>
                      {formData.coupleDetailsEnabled && formData.showBrideBio && formData.brideBio && <p className="text-[9px] font-serif italic max-w-xs mx-auto opacity-80" style={{color:formData.subTextColor}}>{formData.brideBio}</p>}
                      <span style={{color:formData.accentColor}} className="font-script text-2xl block my-[-1px]">&</span>
                      <h2 className="text-3xl sm:text-4xl font-bold tracking-wider drop-shadow-sm font-script">{formData.groomName}</h2>
                      {formData.coupleDetailsEnabled && formData.showGroomBio && formData.groomBio && <p className="text-[9px] font-serif italic max-w-xs mx-auto opacity-80" style={{color:formData.subTextColor}}>{formData.groomBio}</p>}
                    </>
                  ) : (
                    <>
                      <h2 className="text-3xl sm:text-4xl font-bold tracking-wider drop-shadow-sm font-script">{formData.groomName}</h2>
                      {formData.coupleDetailsEnabled && formData.showGroomBio && formData.groomBio && <p className="text-[9px] font-serif italic max-w-xs mx-auto opacity-80" style={{color:formData.subTextColor}}>{formData.groomBio}</p>}
                      <span style={{color:formData.accentColor}} className="font-script text-2xl block my-[-1px]">&</span>
                      <h2 className="text-3xl sm:text-4xl font-bold tracking-wider drop-shadow-sm font-script">{formData.brideName}</h2>
                      {formData.coupleDetailsEnabled && formData.showBrideBio && formData.brideBio && <p className="text-[9px] font-serif italic max-w-xs mx-auto opacity-80" style={{color:formData.subTextColor}}>{formData.brideBio}</p>}
                    </>
                  )}
                  {formData.showParents && <p className="text-[9px] mt-2 opacity-80" style={{color:formData.subTextColor}}>{formData.parentsGroom} & {formData.parentsBride}</p>}
                </div>

                {/* Events list preview */}
                <div className="pt-3 border-t border-white/10 max-w-[280px] mx-auto">
                  <span 
                    style={{ color: formData.accentColor }}
                    className="text-[9px] uppercase tracking-[0.2em] font-semibold block mb-1.5"
                  >
                    Programmes
                  </span>
                  <div className="space-y-1.5 text-left text-[10px]">
                    {formData.events.map((ev, i) => (
                      <div key={i} className="flex justify-between items-baseline border-b border-white/5 pb-0.5">
                        <span className="font-semibold text-[10px]">{ev.name}</span>
                        <span className="text-[9px] opacity-80" style={{ color: formData.subTextColor }}>
                          {ev.date} • {ev.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {formData.invitationSubtitle && <p className="text-center text-[10px] italic z-10" style={{color:formData.subTextColor}}>{formData.invitationSubtitle}</p>}
              {formData.showProgramTimeline && formData.events.length > 0 && <div className="z-10 text-center text-[9px] space-y-1 py-2">{formData.events.map((ev,idx)=><p key={idx}><strong>{ev.name}</strong> · {ev.date} · {ev.time}</p>)}</div>}
              {formData.showGoogleMap && formData.googleMapLink && <a href={formData.googleMapLink} target="_blank" rel="noreferrer" className="z-10 text-center text-[10px] underline" style={{color:formData.accentColor}}>{formData.mapButtonText}</a>}
              {formData.showDressCode && formData.dressCode && <p className="z-10 text-center text-[10px]">Dress Code: {formData.dressCode}</p>}
              {formData.showPreWeddingEvents && formData.preWeddingEvents && <p className="z-10 text-center text-[10px] whitespace-pre-line">{formData.preWeddingEvents}</p>}
              {formData.showTransportation && formData.transportation && <p className="z-10 text-center text-[10px] whitespace-pre-line">{formData.transportation}</p>}
              {formData.showAccommodation && formData.accommodation && <p className="z-10 text-center text-[10px] whitespace-pre-line">{formData.accommodation}</p>}
              {formData.showGiftMessage && formData.giftMessage && <p className="z-10 text-center text-[10px] italic whitespace-pre-line">{formData.giftMessage}</p>}
              {formData.showClosingMessage && formData.closingMessage && <p className="z-10 text-center text-[10px] italic whitespace-pre-line">{formData.closingMessage}</p>}
              {formData.showSelfClosing && formData.selfClosingMessage && <p className="z-10 text-center text-[10px]">{formData.selfClosingMessage}</p>}
              {formData.showRsvpButton && <span className="z-10 self-center text-[9px] border px-3 py-1 rounded-full" style={{borderColor:formData.accentColor,color:formData.accentColor}}>{formData.rsvpButtonText}</span>}

              {/* Bottom Section: Wedding Date, Venue, RSVP */}
              <div 
                style={{ borderColor: `${formData.accentColor}40` }}
                className="text-center border-t pt-3 z-10 space-y-1"
              >
                <div 
                  style={{ color: formData.accentColor }}
                  className="text-xs font-bold tracking-widest uppercase"
                >
                  {formData.weddingDate}
                </div>
                <div className="text-[10px] font-medium leading-tight">
                  {formData.venue}, {formData.city}
                </div>
                <div 
                  style={{ color: formData.subTextColor }}
                  className="text-[9px] tracking-wide pt-1"
                >
                  RSVP: {formData.rsvp}
                </div>
              </div>

            </div>
          </div>

          <p className="text-[11px] text-gray-400 mt-2 text-center z-10 pb-16 lg:pb-0">
            {isPurchased 
              ? '✓ Watermark Free HD Mode Active.' 
              : 'Watermark active in preview mode. Click Buy to export clean high-res PNG.'}
          </p>

        </div>

      </div>

      {/* FLOATING ACTION PILL ON MOBILE */}
      <div className="lg:hidden fixed bottom-4 inset-x-4 z-40 flex items-center justify-between gap-2 bg-[#1A1A1E]/95 backdrop-blur-md p-2 rounded-2xl border border-white/15 shadow-2xl">
        <button
          onClick={() => setMobileTab(mobileTab === 'form' ? 'preview' : 'form')}
          className="flex-1 py-2 px-3 bg-[#6B1D2F] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
        >
          {mobileTab === 'form' ? (
            <>
              <Eye className="w-4 h-4" />
              <span>Preview Card</span>
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4" />
              <span>Edit Details</span>
            </>
          )}
        </button>

        <button
          onClick={handleSaveDesign}
          className="py-2 px-3 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-xl flex items-center gap-1"
        >
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>

        <button
          onClick={handleDownloadImage}
          className="py-2 px-3 bg-[#C5A059] text-[#1A1A1E] text-xs font-bold rounded-xl flex items-center gap-1"
        >
          <Download className="w-4 h-4" />
          <span>{isPurchased ? 'HD' : 'PNG'}</span>
        </button>
      </div>

      {/* Checkout / Buy Modal */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100">
            <div className="bg-[#6B1D2F] px-6 py-5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg">Unlock Watermark-Free HD</h3>
                <p className="text-xs text-[#E5C07B]">Permanent license for your wedding invitation</p>
              </div>
              <button
                onClick={() => setCheckoutModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-[#FAF3F0] p-4 rounded-xl border border-[#F2DDD3] space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Template</span>
                  <span className="font-bold text-gray-900">{template?.title || 'Wedding Template'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Design Title</span>
                  <span className="font-medium text-gray-800">{formData.title}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-2 font-bold">
                  <span className="text-gray-900">Total Amount</span>
                  <span className="text-[#6B1D2F]">₹ {template?.price || 999}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 border-2 border-[#6B1D2F] bg-[#FAF3F0] rounded-lg font-semibold text-[#6B1D2F]">
                    UPI / QR
                  </div>
                  <div className="p-2.5 border border-gray-200 rounded-lg text-gray-700 hover:border-gray-400 cursor-pointer">
                    Debit / Card
                  </div>
                  <div className="p-2.5 border border-gray-200 rounded-lg text-gray-700 hover:border-gray-400 cursor-pointer">
                    NetBanking
                  </div>
                </div>
              </div>

              <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-[11px] text-green-800 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold">
                  <Check className="w-3.5 h-3.5 text-green-600" /> Instant Watermark Removal
                </div>
                <div className="flex items-center gap-1.5 font-semibold">
                  <Check className="w-3.5 h-3.5 text-green-600" /> Print-Ready 4K Resolution PNG & PDF
                </div>
                <div className="flex items-center gap-1.5 font-semibold">
                  <Check className="w-3.5 h-3.5 text-green-600" /> Unlimited edits & downloads forever
                </div>
              </div>

              <button
                onClick={handleCompletePurchase}
                disabled={paymentProcessing}
                className="w-full py-3 bg-[#6B1D2F] hover:bg-[#521321] text-white text-xs font-bold rounded-lg shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4 text-[#E5C07B]" />
                <span>
                  {paymentProcessing ? 'Processing Payment...' : `Pay ₹ ${template?.price || 999} & Remove Watermark`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}