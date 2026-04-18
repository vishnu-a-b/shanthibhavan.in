'use client';

import VideoHero from './VideoHero';
import HeroEditor from './HeroEditor';

// Default fallback banner
const DEFAULT_BANNER = {
  _id: 'default1',
  title: 'Driven by People, Devoted to People.',
  subtitle: 'Always Free. Always Compassionate.',
  description: 'The first palliative hospital in India with a zero billing policy. Our mission is to provide dedicated palliative care and improve the quality of life for bedridden patients.',
  tagline: 'Hold a Hand in the Darkest Hour',
  taglineDescription: 'At Shanthibhavan, we provide dignity and comfort through free palliative care. Our doors stay open only because of hearts like yours.',
  mediaType: 'video',
  videoUrl: '/video/hero.mp4',
  thumbnailUrl: '/image/hero.jpeg',
  ctaText: 'Donate Now',
  ctaLink: '/donate',
};

export default function BannerCarousel({ dbBanners }: { dbBanners: any[] }) {
  // Use the first active banner from DB (image or video), fall back to default
  const activeBanner = dbBanners?.find(b => b.isActive !== false) || DEFAULT_BANNER;

  return (
    <div className="relative">
      <VideoHero
        mediaType={activeBanner.mediaType}
        imageUrl={activeBanner.imageUrl}
        videoUrl={activeBanner.videoUrl}
        title={activeBanner.title}
        subtitle={activeBanner.subtitle}
        description={activeBanner.description}
        tagline={activeBanner.tagline}
        taglineDescription={activeBanner.taglineDescription}
        ctaText={activeBanner.ctaText}
        ctaLink={activeBanner.ctaLink}
        thumbnailUrl={activeBanner.thumbnailUrl}
      />
      <HeroEditor currentBanner={activeBanner} />
    </div>
  );
}
