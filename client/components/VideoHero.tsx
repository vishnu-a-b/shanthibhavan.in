'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ArrowRight } from 'lucide-react';

interface VideoHeroProps {
  videoUrl: string;
  title: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  thumbnailUrl?: string;
}

export default function VideoHero({
  title,
  subtitle,
  description,
  ctaText,
  ctaLink,
  thumbnailUrl,
}: VideoHeroProps) {
  return (
    <section
      className="relative w-full overflow-hidden flex flex-col"
      style={{ background: '#001a52', minHeight: '100vh' }}
    >
      {/* Topographic contour lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1400 800"
        preserveAspectRatio="xMidYMid slice"
        style={{ zIndex: 1 }}
      >
        <g fill="none" stroke="rgba(100,160,220,0.18)" strokeWidth="1.2">
          <path d="M-50 580 Q180 510 350 555 Q520 600 700 520 Q850 460 1050 490 Q1200 515 1450 475" />
          <path d="M-50 620 Q160 548 340 595 Q530 642 710 558 Q875 490 1080 524 Q1230 548 1450 510" />
          <path d="M-50 660 Q140 590 330 635 Q540 680 720 596 Q900 525 1100 558 Q1260 582 1450 545" />
          <path d="M-50 700 Q120 628 320 672 Q555 718 730 634 Q925 560 1120 592 Q1290 615 1450 578" />
          <path d="M-50 540 Q200 468 370 514 Q510 556 690 478 Q830 425 1020 455 Q1175 480 1450 440" />
          <path d="M-50 500 Q220 428 390 474 Q495 510 675 438 Q810 388 1000 420 Q1150 444 1450 406" />
          <path d="M-50 460 Q240 390 410 435 Q480 464 660 398 Q790 352 980 385 Q1130 410 1450 372" />
          <path d="M350 -20 Q390 120 420 280 Q450 440 410 600 Q380 720 360 820" />
          <path d="M390 -20 Q435 125 465 288 Q498 455 455 615 Q422 738 400 820" />
          <path d="M430 -20 Q480 130 512 295 Q546 468 500 630 Q464 754 440 820" />
          <path d="M310 -20 Q345 115 372 272 Q400 425 365 582 Q338 702 320 820" />
        </g>
      </svg>

      {/* Right photo panel */}
      <div
        className="absolute top-0 right-0 h-full pointer-events-none"
        style={{ width: '58%', zIndex: 2 }}
      >
        <Image
          src={thumbnailUrl || '/image/hero.jpeg'}
          alt="Shanthibhavan Palliative Care"
          fill
          className="object-cover"
          style={{ objectPosition: 'left center' }}
          priority
        />
        {/* Left-edge gradient blend */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, #001a52 0%, rgba(0,26,82,0.85) 12%, rgba(0,26,82,0.40) 30%, rgba(0,26,82,0.08) 58%, transparent 100%)',
          }}
        />
        {/* Bottom gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(0,26,82,0.55) 0%, transparent 30%)',
          }}
        />
      </div>

      {/* Main content */}
      <div
        className="relative flex flex-col justify-center"
        style={{
          zIndex: 10,
          paddingLeft: 'clamp(24px, 8%, 120px)',
          paddingRight: 'clamp(24px, 4%, 60px)',
          paddingTop: '160px',
          paddingBottom: '100px',
          minHeight: '100vh',
          maxWidth: '680px',
        }}
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            color: 'rgba(180,210,240,0.75)',
            fontSize: '15px',
            fontWeight: 300,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '22px',
          }}
        >
          {subtitle || 'A Charitable, Non-Billing Facility'}
        </motion.p>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.25 }}
          style={{
            fontFamily: 'var(--font-playfair, Georgia, serif)',
            fontSize: 'clamp(2.8rem, 5vw, 5.1rem)',
            fontWeight: 'normal',
            lineHeight: 1.02,
            color: '#ffffff',
            marginBottom: '28px',
          }}
        >
          {title}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          style={{
            color: 'rgba(200,220,245,0.72)',
            fontSize: '15px',
            fontWeight: 300,
            lineHeight: 1.8,
            maxWidth: '480px',
            marginBottom: '44px',
          }}
        >
          {description ||
            'Providing world-class medical support and comfort for those facing serious illness. All services at zero cost to patients — because compassion has no price.'}
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.62 }}
          className="flex flex-wrap gap-4"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 font-semibold transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5"
            style={{
              background: '#1a7070',
              color: '#ffffff',
              borderRadius: '50px',
              padding: '17px 42px',
              fontSize: '15px',
              letterSpacing: '0.02em',
            }}
          >
            Our Services
            <ArrowRight className="w-4 h-4" />
          </Link>

          {ctaText && ctaLink ? (
            <Link
              href={ctaLink}
              className="inline-flex items-center gap-2 font-semibold transition-all duration-200 hover:bg-white/10 hover:-translate-y-0.5"
              style={{
                border: '1.5px solid rgba(255,255,255,0.45)',
                color: '#ffffff',
                borderRadius: '50px',
                padding: '17px 42px',
                fontSize: '15px',
                letterSpacing: '0.02em',
              }}
            >
              <Heart className="w-4 h-4" />
              {ctaText}
            </Link>
          ) : (
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 font-semibold transition-all duration-200 hover:bg-white/10 hover:-translate-y-0.5"
              style={{
                border: '1.5px solid rgba(255,255,255,0.45)',
                color: '#ffffff',
                borderRadius: '50px',
                padding: '17px 42px',
                fontSize: '15px',
                letterSpacing: '0.02em',
              }}
            >
              <Heart className="w-4 h-4" />
              Support Our Mission
            </Link>
          )}
        </motion.div>
      </div>

      {/* Sparkle decoration */}
      <div
        className="absolute pointer-events-none"
        style={{ bottom: '26px', right: '30px', opacity: 0.55, zIndex: 10 }}
      >
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <path
            d="M15 2L16.8 13.2L28 15L16.8 16.8L15 28L13.2 16.8L2 15L13.2 13.2L15 2Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
