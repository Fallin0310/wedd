import React, { useState, useRef, useEffect } from 'react';
import TemplateCardVisual from './TemplateCardVisual';
import AnimatedInvite from './AnimatedInvite';
import { 
  X, Wand2, Volume2, VolumeX, Play, Pause, ChevronDown, 
  Calendar, MapPin, Heart, Sparkles, Check, Globe, Share2, Music, Clock
} from 'lucide-react';

export default function DemoPreviewModal({ template, onClose, onSelectTemplate, onOrder }) {
  if (!template) return null;

  // Active view mode: 'video' (initial teaser) or 'card' (interactive invitation)
  const hasVideo = !!(template.video_url || template.default_data?.videoUrl || template.slug === 'royal-grace');
  const [viewMode, setViewMode] = useState(hasVideo ? 'video' : 'card'); // 'video' | 'card'
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' | 'ar'
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpGuests, setRsvpGuests] = useState('1');
  const [rsvpStatus, setRsvpStatus] = useState('accept');

  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioIntervalRef = useRef(null);

  // Template variables (defaulting to Royal Grace if selected, or current template)
  const defaultData = template?.default_data || {};
  const isRoyalGrace = template?.slug === 'royal-grace';

  const groomName = language === 'ar' ? 'زين' : (defaultData.groomName || (isRoyalGrace ? 'Zayn' : 'Rohit'));
  const brideName = language === 'ar' ? 'نورا' : (defaultData.brideName || (isRoyalGrace ? 'Nora' : 'Priya'));
  const groomBio = language === 'ar' 
    ? 'ابن السيد والسيدة مالك • عالم بيانات' 
    : (defaultData.groomBio || 'Son of Mr. & Mrs. Malik • B.E., M.S., Data Scientist');
  const brideBio = language === 'ar' 
    ? 'ابنة السيد والسيدة ناصر • طبيبة أطفال' 
    : (defaultData.brideBio || 'Daughter of Mr. & Mrs. Nasser • MBBS, M.D., Pediatrician');
  const headingText = language === 'ar' ? 'نحن نتزوج' : (defaultData.tagline || "We're getting married");

  // Video source
  const videoSrc = template?.video_url || defaultData.videoUrl || '/assets/royal-grace-demo.mp4';

  // Toggle Video Play / Pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Toggle Video Mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Ambient Wedding Music synthesizer using Web Audio API
  const toggleAmbientMusic = () => {
    if (audioPlaying) {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setAudioPlaying(false);
    } else {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        audioContextRef.current = ctx;

        // Pentatonic harp melody notes (Hz)
        const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
        let noteIndex = 0;

        const playTone = () => {
          if (!ctx || ctx.state === 'closed') return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          const freq = notes[noteIndex % notes.length];
          noteIndex = (noteIndex + Math.floor(Math.random() * 3) + 1) % notes.length;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.0);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 2.0);
        };

        playTone();
        audioIntervalRef.current = setInterval(playTone, 1400);
        setAudioPlaying(true);
      } catch (e) {
        console.error('Audio playback error', e);
      }
    }
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-hidden">
      
      {/* Modal Container */}
      <div 
        className="relative bg-[#1A1A1E] text-white w-full sm:max-w-4xl h-full sm:h-[92vh] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Control Bar */}
        <div className="px-4 py-3 bg-[#141416]/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between z-30 shrink-0">
          
          {/* Template Info & Switcher */}
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm sm:text-base text-[#F4EFE6]">
                  {template.title}
                </span>
                <span className="text-[10px] bg-[#C5A059] text-[#1A1A1E] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live Demo
                </span>
              </div>
              <p className="text-[11px] text-gray-400 hidden sm:block">
                Experience the wedding invitation exactly as your guests will see it
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2 bg-black/40 p-1 rounded-lg border border-white/10">
            {hasVideo && (
            <button
              onClick={() => {
                setViewMode('video');
                if (videoRef.current) videoRef.current.play();
                setIsPlaying(true);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'video' 
                  ? 'bg-[#C5A059] text-[#1A1A1E] shadow-xs' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Video Demo</span>
            </button>
            )}

            <button
              onClick={() => {
                setViewMode('card');
                if (videoRef.current) videoRef.current.pause();
                setIsPlaying(false);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'card' 
                  ? 'bg-[#C5A059] text-[#1A1A1E] shadow-xs' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Interactive Card</span>
            </button>
          </div>

          {/* Close Modal Button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title="Close Demo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* VIEW 1: VIDEO TEASER DEMO */}
        {viewMode === 'video' && hasVideo && (
          <div className="flex-1 bg-black relative flex flex-col items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              src={videoSrc}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="max-h-full max-w-full object-contain"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Video Controls Overlay */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
              <button
                onClick={toggleMute}
                className="p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white transition cursor-pointer border border-white/20"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-green-400" />}
              </button>
            </div>

            {/* Bottom Floating Bar in Video Mode */}
            <div className="absolute bottom-6 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 flex flex-col sm:flex-row items-center gap-3 bg-[#1A1A1E]/85 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15 shadow-2xl z-20">
              <div className="text-center sm:text-left">
                <p className="text-xs font-serif font-bold text-[#F4EFE6]">
                  Watched the video teaser?
                </p>
                <p className="text-[11px] text-gray-400">
                  Open the full interactive digital wedding card with RSVP & timeline
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setViewMode('card');
                    if (videoRef.current) videoRef.current.pause();
                    setIsPlaying(false);
                  }}
                  className="flex-1 sm:flex-none px-4 py-2 bg-[#C5A059] hover:bg-[#D4AF37] text-[#1A1A1E] text-xs font-bold rounded-lg shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Open Interactive Card →</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onSelectTemplate(template);
                  }}
                  className="flex-1 sm:flex-none px-4 py-2 bg-[#6B1D2F] hover:bg-[#521321] text-white text-xs font-bold rounded-lg shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Customize Now</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: INTERACTIVE INVITATION CARD (EXACT ZAREQIA STYLE MATCHING USER SCREENSHOT) */}
        {viewMode === 'card' && (
          <div className="flex-1 bg-[#232126] relative overflow-y-auto flex flex-col items-center">
            {/* every template renders through the same animated, theme-driven invite.
                watermark stays ON in demo; use watermark={false} for purchased output */}
            <AnimatedInvite
              key={template.slug}
              data={{
                ...(template.slug === 'royal-grace'
                  ? { bgColor: '#F5EFE7', primaryColor: '#254637', accentColor: '#C5A059', textColor: '#254637', heroImage: '/assets/royal-grace-bg.jpg', ornament: 'floral-rose-arch' }
                  : {}),
                ...defaultData,
              }}
              watermark={true}
            />
            <div className="w-full max-w-md p-4 bg-[#141416] text-center flex flex-wrap justify-center gap-2">
              <button
                onClick={() => { onClose(); onSelectTemplate(template); }}
                className="px-4 py-2 bg-[#C5A059] hover:bg-[#D4AF37] text-[#1A1A1E] text-xs font-bold rounded-full cursor-pointer"
              >
                Customize This Design
              </button>
              <button
                onClick={() => onOrder(template)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-full cursor-pointer"
              >
                Buy Watermark-Free HD (₹ {template.price})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
