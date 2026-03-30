'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, ArrowRight, ChevronDown } from 'lucide-react';

interface VideoHeroProps {
  videoUrl?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  thumbnailUrl?: string;
}

const stats = [
  { value: '49', label: 'Beds' },
  { value: '15+', label: 'Vehicles' },
  { value: '40', label: 'Dialysis' },
  { value: '₹0', label: 'Bills' },
];

export default function VideoHero({
  videoUrl,
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
      style={{ minHeight: '100svh', background: '#050e24' }}
    >
      {/* ── Full-screen video background ── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={thumbnailUrl || '/image/hero.jpeg'}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      >
        <source src={videoUrl || '/video/hero.mp4'} type="video/mp4" />
      </video>

      {/* ── Navy gradient overlay ── */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background:
            'linear-gradient(to bottom, rgba(5,14,36,0.68) 0%, rgba(5,14,36,0.50) 50%, rgba(5,14,36,0.72) 100%)',
        }}
      />

      {/* ── Main content (flex-col, centered, fills viewport) ── */}
      <div
        className="relative flex flex-col items-center justify-center flex-1"
        style={{
          zIndex: 10,
          minHeight: '100svh',
          paddingTop: 'clamp(90px, 14vh, 140px)',
          paddingBottom: 'clamp(100px, 15vh, 150px)',
          paddingLeft: 'clamp(20px, 6%, 80px)',
          paddingRight: 'clamp(20px, 6%, 80px)',
        }}
      >
        {/* Center content block */}
        <div className="flex flex-col items-center text-center max-w-3xl w-full">

          {/* Eyebrow badge pill */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mb-6"
          >
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#ffffff',
                borderRadius: '999px',
                padding: '5px 18px',
                fontSize: '11px',
                fontFamily: 'var(--font-space-grotesk, sans-serif)',
                fontWeight: 500,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
              }}
            >
              {subtitle || "India's First No-Bill Hospital"}
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            style={{
              fontFamily: 'var(--font-playfair, Georgia, serif)',
              fontSize: 'clamp(2.4rem, 5.5vw, 5rem)',
              fontWeight: 'normal',
              lineHeight: 1.08,
              color: '#ffffff',
              marginBottom: '20px',
            }}
          >
            {title || (
              <>
                For the People,
                <br />
                By the People
              </>
            )}
          </motion.h1>

          {/* White divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.45 }}
            style={{ transformOrigin: 'center', marginBottom: '22px' }}
          >
            <div
              style={{
                width: '56px',
                height: '1.5px',
                background: 'rgba(255,255,255,0.55)',
              }}
            />
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            style={{
              color: 'rgba(220,230,245,0.75)',
              fontSize: 'clamp(14px, 1.6vw, 16px)',
              fontFamily: 'var(--font-space-grotesk, sans-serif)',
              fontWeight: 300,
              lineHeight: 1.85,
              marginBottom: '40px',
              maxWidth: '560px',
            }}
          >
            {description ||
              'Providing world-class medical support and comfort for those facing serious illness. All services at zero cost to patients — because compassion has no price.'}
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.68 }}
            className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-stretch sm:items-center justify-center"
          >
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] w-full sm:w-auto"
              style={{
                background: '#ffffff',
                color: '#050e24',
                borderRadius: '3px',
                padding: '14px 32px',
                fontSize: '13px',
                fontFamily: 'var(--font-space-grotesk, sans-serif)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Our Services
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href={ctaLink || '/donate'}
              className="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 hover:bg-white/10 hover:-translate-y-0.5 active:scale-[0.98] w-full sm:w-auto"
              style={{
                border: '1.5px solid rgba(255,255,255,0.60)',
                color: '#ffffff',
                borderRadius: '3px',
                padding: '14px 32px',
                fontSize: '13px',
                fontFamily: 'var(--font-space-grotesk, sans-serif)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              <Heart className="w-4 h-4" />
              {ctaText || 'Donate Now'}
            </Link>
          </motion.div>
        </div>

        {/* ── Stats strip (pinned to bottom via mt-auto) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.88 }}
          className="mt-auto w-full"
          style={{ paddingTop: '48px' }}
        >
          <div
            className="grid grid-cols-2 md:grid-cols-4 w-full"
            style={{
              background: 'rgba(5,14,36,0.60)',
              borderTop: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center py-5 px-4"
                style={{
                  borderRight:
                    i < stats.length - 1 ? '1px solid rgba(255,255,255,0.10)' : 'none',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-playfair, Georgia, serif)',
                    fontSize: 'clamp(1.4rem, 2.4vw, 1.9rem)',
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-space-grotesk, sans-serif)',
                    color: 'rgba(200,220,245,0.55)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginTop: '6px',
                    textAlign: 'center',
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Scroll indicator (desktop only) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1"
        style={{ zIndex: 10 }}
      >
        <span
          style={{
            fontSize: '9px',
            fontFamily: 'var(--font-space-grotesk, sans-serif)',
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
          }}
        >
          Scroll
        </span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
          <ChevronDown style={{ width: '15px', height: '15px', color: 'rgba(255,255,255,0.35)' }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
