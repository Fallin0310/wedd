
import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

export default function Hero({ onBrowseClick, onHowItWorksClick }) {
  return (
    <section className="
      relative
      w-full
      h-[calc(100svh-86px)]
      min-h-[600px]
      overflow-hidden
      bg-[#FCE8D0]
    ">

      {/* Full Background Image - No Cropping */}
      <img
        src="/images/wedding-hero.png"
        alt="Elegant Indian wedding couple"
        className="
          absolute
          inset-0
          w-full
          h-full
          object-fill
          object-center
          pointer-events-none
          select-none
        "
      />

      {/* Hero Content */}
      <div className="
        relative
        z-10
        w-full
        h-full
        flex
        items-center
        justify-end
      ">

        {/* Text Inside Decorative Arch */}
        <div className="
          w-[44%]
          mr-[4%]
          px-3
          sm:px-5
          lg:px-8
          text-center
          flex
          flex-col
          items-center
          justify-center
          -translate-y-1
        ">

          {/* Welcome Text */}
          <p
            className="
              text-2xl
              sm:text-3xl
              lg:text-[36px]
              text-[#824923]
              font-normal
              mb-2
            "
            style={{
              fontFamily: "'Fernglade DEMO', Georgia, serif"
            }}
          >
            Welcome to
          </p>

          {/* Main Heading */}
          <h1
            className="
              text-4xl
              sm:text-5xl
              lg:text-[68px]
              leading-[1.08]
              text-[#824923]
              font-normal
              mb-3
            "
            style={{
              fontFamily: "'Abigail Nagita', Georgia, serif"
            }}
          >
            A Beautiful
            <br />
            Beginning
          </h1>

          {/* Subheading */}
          <p
            className="
              text-xl
              sm:text-2xl
              lg:text-[32px]
              tracking-[0.08em]
              text-[#824923]
              leading-tight
              mb-4
            "
            style={{
              fontFamily: "'Abigail Nagita', Georgia, serif"
            }}
          >
            to Every Celebration
          </p>

          {/* Decorative Divider */}
          <div className="
            flex
            items-center
            justify-center
            gap-2
            w-full
            max-w-[350px]
            mb-4
          ">
            <span className="h-px flex-1 bg-[#B89572]" />

            <span className="text-[#B89572] text-xl">
              ❖
            </span>

            <span className="h-px flex-1 bg-[#B89572]" />
          </div>

          {/* Description */}
          <p
            className="
              text-base
              sm:text-lg
              lg:text-[22px]
              leading-[1.3]
              text-[#824923]
              max-w-[510px]
              mb-7
            "
            style={{
              fontFamily: "Georgia, serif"
            }}
          >
            Premium digital wedding invitations that
            capture the elegance of your love story.
            Customize, preview, publish, and share —
            all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="
            flex
            flex-wrap
            justify-center
            items-center
            gap-3
            sm:gap-4
          ">

            {/* Browse Templates */}
            <button
              onClick={onBrowseClick}
              className="
                px-5
                sm:px-6
                py-3
                bg-[#762B40]
                hover:bg-[#5E2032]
                text-white
                rounded-[11px]
                font-semibold
                text-sm
                sm:text-base
                flex
                items-center
                gap-2
                transition-all
                duration-300
                shadow-sm
                cursor-pointer
              "
            >
              Browse Templates

              <ArrowRight className="w-5 h-5" />
            </button>

            {/* How It Works */}
            <button
              onClick={onHowItWorksClick}
              className="
                px-5
                sm:px-6
                py-3
                border-2
                border-[#762B40]
                text-[#762B40]
                hover:bg-[#762B40]
                hover:text-white
                rounded-[11px]
                font-semibold
                text-sm
                sm:text-base
                flex
                items-center
                gap-2
                transition-all
                duration-300
                cursor-pointer
              "
            >
              How It Works

              <Play className="w-4 h-4 fill-current" />
            </button>

          </div>

        </div>
      </div>
    </section>
  );
}