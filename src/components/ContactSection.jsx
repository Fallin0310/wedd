
import React, { useEffect, useRef } from "react";
import {
  Mail,
  Heart,
  Sparkles,
} from "lucide-react";

const ContactSection = () => {
  const sectionRef = useRef(null);

  const email = "hello@weddinvites.store";

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        section.classList.toggle(
          "contact-active",
          entry.isIntersecting
        );
      },
      { threshold: 0.15 }
    );

    observer.observe(section);

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const progress = Math.max(
        -1,
        Math.min(
          1,
          (window.innerHeight - rect.top) /
            (window.innerHeight + rect.height)
        )
      );

      section.style.setProperty(
        "--scroll-progress",
        progress.toFixed(3)
      );
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="contact-section relative flex min-h-screen h-screen items-center overflow-hidden bg-[#FFF5E8] px-5 py-8 md:px-10 md:py-10"
    >
      <style>{`
        /* FULL SCREEN SECTION */
        .contact-section {
          height: 100vh;
          min-height: 100vh;
          box-sizing: border-box;
          isolation: isolate;
        }

        /* BACKGROUND ATMOSPHERE */
        .contact-section::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 10% 15%, rgba(232, 200, 184, .35), transparent 35%),
            radial-gradient(circle at 90% 85%, rgba(215, 178, 164, .3), transparent 35%);
          pointer-events: none;
          z-index: -1;
        }

        .contact-glow {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          animation: contactGlow 12s ease-in-out infinite alternate;
        }

        .contact-glow-one {
          top: -200px;
          left: -150px;
          background: rgba(232, 200, 184, .35);
        }

        .contact-glow-two {
          bottom: -200px;
          right: -150px;
          background: rgba(112, 44, 59, .12);
          animation-delay: -5s;
        }

        @keyframes contactGlow {
          from { transform: translate(0, 0); }
          to { transform: translate(35px, 30px); }
        }

        /* GRAIN TEXTURE */
        .contact-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.16'/%3E%3C/svg%3E");
        }

        /* SCROLL REVEAL */
        .contact-reveal {
          opacity: 0;
          transform: translateY(35px);
          transition:
            opacity 1s ease,
            transform 1s cubic-bezier(.2,.7,.2,1);
        }

        .contact-section.contact-active .contact-reveal {
          opacity: 1;
          transform: translateY(0);
        }

        .contact-delay-1 {
          transition-delay: .2s;
        }

        .contact-delay-2 {
          transition-delay: .4s;
        }

        /* 3D CARD ENTRANCE */
        .contact-card {
          perspective: 1200px;
          transform-style: preserve-3d;
          opacity: 0;
          transform: translateY(40px) rotateX(5deg) scale(.98);
          transition:
            opacity 1.1s ease,
            transform 1.2s cubic-bezier(.2,.7,.2,1);
        }

        .contact-section.contact-active .contact-card {
          opacity: 1;
          transform: translateY(0) rotateX(0) scale(1);
          transition-delay: .2s;
        }

        /* FLOATING ENVELOPE */
        .envelope-float {
          animation: envelopeFloat 5s ease-in-out infinite;
          transform-style: preserve-3d;
        }

        @keyframes envelopeFloat {
          0%, 100% {
            transform: translateY(0) rotate(-4deg);
          }
          50% {
            transform: translateY(-13px) rotate(-1deg);
          }
        }

        /* GOLD SHIMMER */
        .gold-shimmer {
          background: linear-gradient(
            110deg,
            #A77A42 0%,
            #F5DDAA 35%,
            #B58A50 55%,
            #F5DDAA 75%,
            #A77A42 100%
          );
          background-size: 220% auto;
          animation: goldShimmer 5s linear infinite;
        }

        @keyframes goldShimmer {
          to {
            background-position: 220% center;
          }
        }

        /* DECORATIVE ORBITS */
        .contact-orbit {
          position: absolute;
          border: 1px solid rgba(197, 163, 106, .3);
          border-radius: 45%;
          pointer-events: none;
          animation: orbitFloat 12s ease-in-out infinite alternate;
        }

        .contact-orbit-one {
          inset: -20px;
        }

        .contact-orbit-two {
          inset: -40px;
          opacity: .5;
          animation-delay: -4s;
        }

        @keyframes orbitFloat {
          from { transform: rotate(-4deg) scale(1); }
          to { transform: rotate(4deg) scale(1.02); }
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .contact-section {
            height: auto;
            min-height: 100svh;
            padding-top: 75px;
            padding-bottom: 75px;
          }

          .contact-card {
            opacity: 1;
            transform: none;
          }

          .contact-orbit {
            display: none;
          }
        }

        /* SHORT DESKTOP SCREENS */
        @media (min-width: 769px) and (max-height: 800px) {
          .contact-section {
            padding-top: 18px;
            padding-bottom: 18px;
          }

          .contact-section .grid {
            gap: 2.5rem;
          }

          .contact-section h2 {
            font-size: clamp(2.7rem, 5vw, 4.7rem);
          }

          .contact-section .contact-card > div:first-child {
            padding-top: 2rem;
            padding-bottom: 2rem;
          }

          .contact-section .envelope-float {
            margin-top: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .contact-section .contact-reveal.mt-24 {
            margin-top: 1rem;
          }
        }

        /* ACCESSIBILITY */
        @media (prefers-reduced-motion: reduce) {
          .contact-section *,
          .contact-section *::before,
          .contact-section *::after {
            animation: none !important;
            transition: none !important;
          }

          .contact-reveal,
          .contact-card {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Background glow */}
      <div className="contact-glow contact-glow-one" />
      <div className="contact-glow contact-glow-two" />

      {/* Soft background decoration */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#E8C8B8]/35 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#D7B2A4]/30 blur-[100px]" />

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* LEFT: Editorial content */}
          <div className="contact-reveal text-center lg:text-left">

            <div className="mb-7 flex items-center justify-center gap-3 lg:justify-start">
              <span className="h-px w-10 gold-shimmer" />

              <span className="text-[10px] uppercase tracking-[.38em] text-[#A9825A]">
                A Personal Touch
              </span>

              <span className="h-px w-10 gold-shimmer lg:hidden" />
            </div>

            <h2 className="font-serif text-5xl leading-[1.12] text-[#54202D] sm:text-6xl md:text-7xl">
              Every Love
              <br />
              Story Deserves
              <br />
              <span className="italic text-[#A9825A]">
                A Beautiful Beginning.
              </span>
            </h2>

            <div className="my-8 flex items-center justify-center gap-3 lg:justify-start">
              <span className="h-px w-12 bg-[#C5A36A]" />
              <Sparkles size={15} className="text-[#B58A50]" />
              <span className="h-px w-12 bg-[#C5A36A]" />
            </div>

            <p className="mx-auto max-w-md text-sm leading-8 text-[#79645B] lg:mx-0 md:text-base">
              Behind every beautiful invitation is a beautiful story.
              Tell us yours, and let's create something unforgettable
              for your special day.
            </p>

            {/* Email contact only */}
            <div className="mt-10 flex flex-col items-center gap-5 lg:items-start">
              <a
                href={`mailto:${email}`}
                className="group flex items-center gap-4 text-left"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C5A36A]/50 text-[#702C3B] transition-all duration-300 group-hover:bg-[#702C3B] group-hover:text-white">
                  <Mail size={18} />
                </span>

                <span>
                  <span className="block text-[9px] uppercase tracking-[.25em] text-[#A9825A]">
                    Write to us
                  </span>

                  <span className="mt-1 block text-sm text-[#54202D] transition group-hover:text-[#A9825A]">
                    {email}
                  </span>
                </span>
              </a>
            </div>
          </div>

          {/* RIGHT: Luxury invitation card */}
          <div className="contact-reveal contact-delay-1 contact-card relative mx-auto w-full max-w-[480px]">

            {/* Decorative orbit */}
            <div className="contact-orbit contact-orbit-one" />
            <div className="contact-orbit contact-orbit-two" />

            {/* Main burgundy card */}
            <div className="relative overflow-hidden rounded-[3px] bg-[#4B1727] px-7 py-12 text-center shadow-[0_30px_80px_rgba(75,23,39,0.25)] sm:px-12 sm:py-16">

              {/* Grain texture */}
              <div className="contact-grain pointer-events-none absolute inset-0 opacity-30" />

              {/* Gold border */}
              <div className="pointer-events-none absolute inset-3 border border-[#C5A36A]/50" />
              <div className="pointer-events-none absolute inset-5 border border-[#C5A36A]/20" />

              {/* Background decorative circles */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-[#D9B878]/15" />
              <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full border border-[#D9B878]/15" />

              <div className="relative z-10">

                <p className="text-[9px] uppercase tracking-[.4em] text-[#D9B878]">
                  WeddInvites Presents
                </p>

                {/* 3D invitation envelope */}
                <div className="envelope-float relative mx-auto my-10 h-36 w-48 sm:h-40 sm:w-56">

                  <div className="absolute inset-0 rotate-[-5deg] rounded-sm bg-[#D4B58B] shadow-[0_20px_35px_rgba(0,0,0,.35)]" />

                  <div className="absolute inset-2 rotate-[3deg] bg-[#F7EBDD] shadow-lg">
                    <div className="absolute inset-3 border border-[#B58A50]/50" />

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-serif text-2xl italic text-[#702C3B]">
                        With Love
                      </span>

                      <span className="mt-2 text-[7px] uppercase tracking-[.3em] text-[#A9825A]">
                        Your Story Begins
                      </span>
                    </div>
                  </div>

                  {/* Envelope flap */}
                  <div className="absolute bottom-0 left-0 right-0 h-0 border-l-[96px] border-r-[96px] border-t-[70px] border-l-transparent border-r-transparent border-t-[#B58A50] drop-shadow-md sm:border-l-[112px] sm:border-r-[112px] sm:border-t-[78px]" />

                  {/* Wax seal */}
                  <div className="absolute bottom-[-5px] left-1/2 z-20 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-[#E7C98F] bg-[#702C3B] shadow-xl">
                    <Heart size={17} className="fill-[#E7C98F] text-[#E7C98F]" />
                  </div>
                </div>

                <h3 className="font-serif text-3xl text-[#F7EBDD] sm:text-4xl">
                  Let's Create
                  <br />
                  <span className="italic text-[#D9B878]">
                    Your Something Special.
                  </span>
                </h3>

                <p className="mx-auto mt-5 max-w-xs text-xs leading-7 text-[#E8D5C8]/80">
                  A little conversation is all it takes to begin
                  creating an invitation worth remembering.
                </p>

                {/* Made with love */}
                <div className="mt-12 flex items-center justify-center gap-3">
                  <span className="h-px w-8 bg-[#D9B878]/50" />

                  <span className="text-[8px] uppercase tracking-[.35em] text-[#D9B878]">
                    Made with love
                  </span>

                  <span className="h-px w-8 bg-[#D9B878]/50" />
                </div>

              </div>
            </div>

            {/* Floating corner decoration */}
            <div className="absolute -right-5 -top-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#C5A36A]/50 bg-[#FFF5E8] shadow-lg">
              <Sparkles size={19} className="text-[#A9825A]" />
            </div>

          </div>
        </div>

        {/* Bottom signature */}
        <div className="contact-reveal contact-delay-2 mt-12 flex flex-col items-center gap-4">
          <div className="h-px w-24 gold-shimmer" />

          <p className="font-serif text-lg italic text-[#A9825A]">
            Your forever begins with a beautiful invitation.
          </p>
        </div>

      </div>
    </section>
  );
};

export default ContactSection;