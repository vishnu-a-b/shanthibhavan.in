'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Heart, Target, Users, ArrowRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import RevealAnimation from '@/components/RevealAnimation';

interface DonationCard {
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  recommended: boolean;
  isExternal: boolean;
}

interface HomepageSettings {
  donationBadge?: string;
  donationTitle?: string;
  donationDescription?: string;
  donationCards?: DonationCard[];
}

const DEFAULT_CARDS: DonationCard[] = [
  {
    icon: 'Heart',
    title: 'One-Time Donation',
    description: 'Make a single contribution to support our daily operations and patient care.',
    buttonText: 'Donate Now',
    buttonLink: '/donate',
    recommended: false,
    isExternal: false,
  },
  {
    icon: 'Users',
    title: 'Fellowship Program',
    description: 'Join our monthly giving program and become a sustaining supporter of our mission.',
    buttonText: 'Join Fellowship',
    buttonLink: 'https://fellowship.shanthibhavan.in/fellowship-packages',
    recommended: true,
    isExternal: true,
  },
  {
    icon: 'Target',
    title: 'Active Campaigns',
    description: 'Support specific initiatives and help us reach targeted goals for special projects.',
    buttonText: 'View Campaigns',
    buttonLink: '/donate?tab=campaign',
    recommended: false,
    isExternal: false,
  },
];

export default function DonationSection({ settings }: { settings?: HomepageSettings | null }) {
  const badge = settings?.donationBadge || 'Support Our Mission';
  const title = settings?.donationTitle || 'Help Us Heal More Lives';
  const description = settings?.donationDescription || 'Your generosity enables us to provide free healthcare to those who need it most. Every contribution makes a difference.';
  const cards = settings?.donationCards?.length ? settings.donationCards : DEFAULT_CARDS;

  return (
    <section className="w-full py-20 md:py-32 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container px-4 md:px-6 mx-auto max-w-7xl relative z-10">
        <RevealAnimation>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-primary font-semibold text-sm mb-4">
              <Heart className="w-4 h-4" />
              {badge}
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-primary mb-6">
              {title}
            </h2>
            <div className="w-24 h-1.5 bg-secondary mx-auto mb-6 rounded-full" />
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          </div>
        </RevealAnimation>

        {/* Donation Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {cards.map((card, index) => {
            // @ts-ignore
            const IconComponent = (LucideIcons[card.icon] as any) || Heart;
            return (
              <RevealAnimation key={index} delay={index * 0.1}>
                <div className={`bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative ${card.recommended ? 'border-2 border-secondary' : 'border border-gray-100'}`}>
                  {card.recommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-secondary text-primary text-xs font-bold px-3 py-1 rounded-full">
                        RECOMMENDED
                      </span>
                    </div>
                  )}
                  <div className={`w-14 h-14 ${card.recommended ? 'bg-secondary/30' : 'bg-primary/10'} rounded-xl flex items-center justify-center mb-6`}>
                    <IconComponent className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                  <p className="text-gray-600 mb-6">{card.description}</p>
                  <Button
                    asChild
                    variant={card.recommended ? 'default' : (index === cards.length - 1 ? 'outline' : 'default')}
                    className={`w-full rounded-full ${card.recommended ? 'bg-primary' : index === cards.length - 1 ? 'border-2' : ''}`}
                  >
                    {card.isExternal ? (
                      <a href={card.buttonLink} target="_blank" rel="noopener noreferrer">
                        {card.buttonText}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    ) : (
                      <Link href={card.buttonLink}>
                        {card.buttonText}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    )}
                  </Button>
                </div>
              </RevealAnimation>
            );
          })}
        </div>

        {/* Trust indicators */}
        <RevealAnimation delay={0.5}>
          <div className="mt-16 text-center">
            <p className="text-gray-500 text-sm mb-4">Trusted by thousands of donors</p>
            <div className="flex flex-wrap justify-center gap-8 items-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">80G</div>
                <div className="text-xs text-gray-500">Tax Exemption</div>
              </div>
              <div className="w-px h-8 bg-gray-300" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-xs text-gray-500">Secure Payment</div>
              </div>
              <div className="w-px h-8 bg-gray-300" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">30+</div>
                <div className="text-xs text-gray-500">Years of Service</div>
              </div>
            </div>
          </div>
        </RevealAnimation>
      </div>
    </section>
  );
}
