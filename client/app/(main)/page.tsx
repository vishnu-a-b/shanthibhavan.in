import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { Button } from '@/components/ui/Button';
import * as LucideIcons from 'lucide-react';
import BannerCarousel from '@/components/BannerCarousel';
import { getBanners } from '@/app/actions/banner';
import { getServices } from '@/app/actions/service';
import { getActiveCampaigns } from '@/app/actions/campaign';
import { getAboutContent } from '@/app/actions/about';
import { getHomepageSettings } from '@/app/actions/homepage-settings';
import ProjectsSection from '@/components/ProjectsSection';
import AwardsSection from '@/components/AwardsSection';
import NewsEventsSection from '@/components/NewsEventsSection';
import DonationSection from '@/components/DonationSection';
import CampaignsSection from '@/components/CampaignsSection';
import BenevitySection from '@/components/BenevitySection';
import RevealAnimation from '@/components/RevealAnimation';
import ParallaxSection from '@/components/ParallaxSection';
import AnimatedCounter from '@/components/AnimatedCounter';
import Magnetic from '@/components/Magnetic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shanthibhavan Palliative Hospital | First Palliative Hospital in India',
  description: 'Shanthibhavan is India\'s first palliative hospital providing compassionate, no-bill care with 49 beds. Comprehensive palliative care, home care services, and free dialysis facility.',
  keywords: 'palliative care, hospice, Shanthibhavan, Kerala, India, no-bill hospital, free healthcare, home care, dialysis',
  openGraph: {
    title: 'Shanthibhavan Palliative Hospital | First Palliative Hospital in India',
    description: 'Providing compassionate palliative care since inception. No bills, no cash counters - just care.',
    type: 'website',
    images: [
      {
        url: 'https://shanthibhavan.in/images/products/5b46fcb5b0482.jpeg',
        width: 1200,
        height: 630,
        alt: 'Shanthibhavan Palliative Hospital',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shanthibhavan Palliative Hospital',
    description: 'India\'s first no-bill palliative hospital providing compassionate care',
  },
};

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [banners, services, campaigns, aboutContent, homepageSettings] = await Promise.all([
    getBanners('home'),
    getServices(),
    getActiveCampaigns(),
    getAboutContent(),
    getHomepageSettings(),
  ]);

  const stats = homepageSettings?.stats || [
    { icon: 'Users', value: '400', suffix: 'k+', label: 'Total Visitors' },
    { icon: 'HandHeart', value: '49', suffix: '', label: 'Bed Hospital' },
    { icon: 'Activity', value: '15', suffix: '', label: 'Home Care Vehicles' },
    { icon: 'Clock', value: '24/7', suffix: '', label: 'Emergency Care' },
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    name: 'Shanthibhavan Palliative Hospital',
    description: 'India\'s first palliative hospital providing compassionate, no-bill care with 49 beds',
    url: 'https://shanthibhavan.in',
    logo: 'https://shanthibhavan.in/images/products/5b46fcb5b0482.jpeg',
    foundingDate: '1993',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Thiruvananthapuram',
      addressRegion: 'Kerala',
      addressCountry: 'IN'
    },
    medicalSpecialty: 'Palliative Care',
    hospitalAffiliation: 'Franciscan Sisters of St. Clare Charitable Trust',
    availableService: [
      { '@type': 'MedicalProcedure', name: 'Palliative Care' },
      { '@type': 'MedicalProcedure', name: 'Home Care Services' },
      { '@type': 'MedicalProcedure', name: 'Dialysis' }
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '100'
    }
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="flex flex-col min-h-screen bg-white">
        {/* Hero Section with Banner */}
        <BannerCarousel dbBanners={banners} />

        {/* About Section */}
        <section className="w-full py-20 md:py-32 bg-slate-50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
               style={{ backgroundImage: 'radial-gradient(#0f635c 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

          <div className="container px-4 md:px-6 mx-auto max-w-7xl relative z-10">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <RevealAnimation direction="left">
                <div className="space-y-6">
                  {aboutContent?.homeBadge && (
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-2">
                      {aboutContent.homeBadge}
                    </div>
                  )}
                  {aboutContent?.homeTitle && (
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-primary leading-tight">
                      {aboutContent.homeTitle}
                    </h2>
                  )}
                  {aboutContent?.homeIntro && (
                    <p className="text-gray-700 text-lg md:text-xl font-medium leading-relaxed">
                      {aboutContent.homeIntro}
                    </p>
                  )}
                  <div className="w-20 h-1 bg-secondary rounded-full" />
                  {aboutContent?.homeDescription && (
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {aboutContent.homeDescription}
                    </p>
                  )}
                  {aboutContent?.homeButtonText && (
                    <div className="flex pt-4">
                      <Button asChild variant="default" size="lg" className="rounded-full px-8 hover:scale-105 transition-transform">
                        <Link href={aboutContent?.homeButtonLink || '/about'}>{aboutContent.homeButtonText}</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </RevealAnimation>

              {aboutContent?.homeImage && (
                <RevealAnimation direction="right" delay={0.2}>
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-primary/5 rounded-3xl rotate-2 transition-transform group-hover:rotate-1" />
                    <div className="absolute -inset-4 bg-secondary/5 rounded-3xl -rotate-2 transition-transform group-hover:-rotate-1" />
                    <ParallaxSection offset={-30}>
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl">
                        <Image
                          src={aboutContent.homeImage}
                          alt="Hospital Care at Shanthibhavan"
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority
                        />
                      </div>
                    </ParallaxSection>
                  </div>
                </RevealAnimation>
              )}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="w-full py-20 md:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <RevealAnimation>
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-primary mb-6">
                  {homepageSettings?.servicesTitle || 'Our Services'}
                </h2>
                <div className="w-24 h-1.5 bg-secondary mx-auto mb-6 rounded-full" />
                <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                  {homepageSettings?.servicesSubtitle || 'Comprehensive care and support for patients and their families, provided with radical compassion and zero cost.'}
                </p>
              </div>
            </RevealAnimation>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services && services.length > 0 ? (
                services.slice(0, 6).map((service: any, index: number) => {
                  // @ts-ignore
                  const IconComponent = LucideIcons[service.icon] || LucideIcons.Activity;
                  const linkHref = service.slug ? `/services/${service.slug}` : '#';

                  return (
                    <RevealAnimation key={service._id} delay={index * 0.1}>
                      <Link href={linkHref} className="block h-full">
                        <Card className="h-full hover:shadow-2xl transition-all duration-500 group overflow-hidden border-none shadow-lg rounded-2xl">
                          <div className="relative h-60 w-full overflow-hidden">
                            <img
                              src={service.image || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop"}
                              alt={service.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
                              <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                 <IconComponent className="h-7 w-7 text-primary" />
                              </div>
                            </div>
                          </div>
                          <CardHeader className="p-6 pb-2">
                            <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">{service.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="px-6 pb-6">
                            <p className="text-gray-600 text-base leading-relaxed line-clamp-3">
                              {service.description}
                            </p>
                            <div className="mt-4 flex items-center text-primary font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
                              Learn more <LucideIcons.ArrowRight className="ml-2 h-4 w-4" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </RevealAnimation>
                  );
                })
              ) : null}
            </div>
            <RevealAnimation delay={0.4}>
              <div className="flex justify-center mt-16">
                <Button asChild variant="outline" size="lg" className="rounded-full px-10 border-2 hover:bg-primary hover:text-white transition-all">
                  <Link href="/services">View All Services</Link>
                </Button>
              </div>
            </RevealAnimation>
          </div>
        </section>

        {/* Quote / Message Section */}
        <section className="w-full">
          <div className="flex flex-col md:flex-row items-stretch bg-primary relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-white/3 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{ backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)', backgroundSize: '24px 24px' }}
            />

            {/* Quote side */}
            <div className="flex-1 flex flex-col justify-center items-center text-center px-8 py-14 md:px-16 md:py-20 relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-px bg-white/30" />
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <div className="w-10 h-px bg-white/30" />
              </div>
              <span className="text-white/15 font-serif select-none leading-none" style={{ fontSize: '9rem', lineHeight: 0.8 }}>&ldquo;</span>
              <p className="text-white text-xl md:text-2xl lg:text-3xl leading-relaxed mt-4 font-light max-w-xl italic">
                {homepageSettings?.quoteText || 'If we are able to develop the right attitude, we can drastically reduce the burden of our sorrows.'}
              </p>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-8 h-px bg-secondary/60" />
                <p className="text-secondary text-base md:text-lg font-semibold tracking-wide">
                  {homepageSettings?.quotePerson || 'Fr. Joy Koothur'}
                </p>
                <div className="w-8 h-px bg-secondary/60" />
              </div>
            </div>

            {/* Image side */}
            <div className="md:w-80 lg:w-105 w-full shrink-0 relative">
              <div className="absolute inset-y-0 left-0 w-12 bg-linear-to-r from-primary to-transparent z-10 pointer-events-none" />
              <img
                src={homepageSettings?.quoteImage || '/image/FATHER.png'}
                alt={homepageSettings?.quotePerson || 'Fr. Joy Koothur'}
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </section>

        {/* Campaigns Section */}
        <CampaignsSection campaigns={campaigns} />

        {/* Projects Section */}
        <ProjectsSection />

        {/* Awards Section */}
        <AwardsSection />

        {/* News & Events Section */}
        <NewsEventsSection />

        {/* Stats Section */}
        <section className="w-full py-24 md:py-32 bg-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white opacity-[0.03] skew-x-12 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-white opacity-[0.02] -skew-x-12 -translate-x-1/2" />

          <div className="container px-4 md:px-6 mx-auto max-w-7xl relative z-10">
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {stats.map((stat: any, index: number) => {
                // @ts-ignore
                const IconComponent = (LucideIcons[stat.icon] as any) || LucideIcons.Users;
                const isNumeric = !isNaN(parseInt(stat.value));
                return (
                  <RevealAnimation key={index} direction="up" delay={(index + 1) * 0.1}>
                    <div className="group bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl text-center hover:bg-white/15 transition-all duration-500 hover:-translate-y-2">
                      <IconComponent className="h-10 w-10 mx-auto mb-6 text-white/70 group-hover:text-white transition-colors" />
                      <h3 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tighter">
                        {isNumeric ? (
                          <AnimatedCounter end={parseInt(stat.value)} suffix={stat.suffix} />
                        ) : (
                          `${stat.value}${stat.suffix}`
                        )}
                      </h3>
                      <p className="text-white/60 font-medium uppercase tracking-wider text-xs">{stat.label}</p>
                    </div>
                  </RevealAnimation>
                );
              })}
            </div>
          </div>
        </section>

        {/* Donation Section */}
        <DonationSection settings={homepageSettings} />

        {/* Benevity Section */}
        <BenevitySection settings={homepageSettings} />

        {/* Immersive Call to Action */}
        <section className="w-full py-24 md:py-40 relative overflow-hidden group">
          <Image
            src={homepageSettings?.ctaBgImage || 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2000&auto=format&fit=crop'}
            alt="Support Shanthibhavan"
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-primary/80 backdrop-blur-[2px]" />

          <div className="container px-4 md:px-6 mx-auto max-w-5xl relative z-10 text-center text-white">
            <RevealAnimation direction="up">
              <h2 className="text-4xl font-bold mb-8 sm:text-5xl md:text-7xl tracking-tighter leading-tight">
                {homepageSettings?.ctaTitle || 'You Can Make a'}{' '}
                <span className="text-secondary">{homepageSettings?.ctaHighlight || 'Difference'}</span>
              </h2>
              <p className="mb-12 text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                {homepageSettings?.ctaDescription || 'Your support helps us continue providing free care to those who need it most. Volunteer your time or donate to our cause.'}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Magnetic>
                  <Button asChild size="lg" className="bg-white text-primary hover:bg-secondary hover:text-primary rounded-full px-10 py-7 text-lg font-bold transition-all">
                    <Link href={homepageSettings?.ctaButton1Link || '/donate'}>
                      {homepageSettings?.ctaButton1Text || 'Donate Today'}
                    </Link>
                  </Button>
                </Magnetic>
                <Magnetic>
                  <Button asChild size="lg" variant="outline" className="border border-white bg-white/15 text-white hover:bg-white/25 rounded-full px-10 py-7 text-lg font-bold transition-all">
                    <Link href={homepageSettings?.ctaButton2Link || '/volunteer'}>
                      {homepageSettings?.ctaButton2Text || 'Become a Volunteer'}
                    </Link>
                  </Button>
                </Magnetic>
              </div>
            </RevealAnimation>
          </div>
        </section>
      </div>
    </>
  );
}
