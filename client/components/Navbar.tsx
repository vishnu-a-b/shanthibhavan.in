'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/benevity', label: 'Benevity' },
  { href: '/team', label: 'Care Team' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 z-50 w-full transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(14,32,64,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(202,220,252,0.12)' : '1px solid transparent',
      }}
    >
      <div className="container mx-auto px-4 md:px-[6%]">
        <div className="flex h-[76px] items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-white rounded-xl px-2 py-1 flex items-center">
              <img src="/logo/logo.png" alt="Shanthibhavan Logo" className="h-11 w-auto" />
            </div>
            {/* <span className="text-lg font-bold hidden md:inline-block tracking-tight">
              <span className="text-white">Shanthi</span>
              <span style={{ color: '#a8c8e8' }}>bhavan</span>
            </span>
            <span className="text-lg font-bold md:hidden text-white tracking-tight">
              Shanthibhavan
            </span> */}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: 'rgba(220,235,255,0.85)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(220,235,255,0.85)')}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/donate"
              className="text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: '#CADCFC',
                color: '#001a52',
                borderRadius: '50px',
                padding: '10px 26px',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(0.92)')}
              onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
            >
              Support Our Mission
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded transition-colors"
            style={{ color: '#e6f1ff' }}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div
          className="md:hidden px-4 pb-6 pt-2 space-y-1"
          style={{
            background: 'rgba(14,32,64,0.97)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderTop: '1px solid rgba(202,220,252,0.12)',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm font-medium py-3 px-2 rounded transition-colors hover:bg-white/5"
              style={{ color: 'rgba(220,235,255,0.85)' }}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3">
            <Link
              href="/donate"
              className="block w-full text-center py-3 text-sm font-semibold text-white rounded-full transition-colors"
              style={{ background: '#CADCFC', color: '#001a52' }}
              onClick={() => setIsOpen(false)}
            >
              Support Our Mission
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
