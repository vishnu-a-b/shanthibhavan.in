import { Schema, model, Document } from 'mongoose';

interface StatItem {
  icon: string;
  value: string;
  suffix: string;
  label: string;
}

interface DonationCard {
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  recommended: boolean;
  isExternal: boolean;
}

export interface IHomepageSettingsDocument extends Document {
  // Quote Section
  quoteText: string;
  quotePerson: string;
  quoteImage: string;

  // Stats Section
  stats: StatItem[];

  // Services Section Heading
  servicesTitle: string;
  servicesSubtitle: string;

  // Donation Section
  donationBadge: string;
  donationTitle: string;
  donationDescription: string;
  donationCards: DonationCard[];

  // Benevity Section
  benevityBadge: string;
  benevityTitle: string;
  benevityDescription: string;
  benevityFeature1Title: string;
  benevityFeature1Desc: string;
  benevityFeature2Title: string;
  benevityFeature2Desc: string;
  benevityLearnMoreLink: string;
  benevityPortalLink: string;
  benevityImage: string;

  // CTA Section
  ctaTitle: string;
  ctaHighlight: string;
  ctaDescription: string;
  ctaButton1Text: string;
  ctaButton1Link: string;
  ctaButton2Text: string;
  ctaButton2Link: string;
  ctaBgImage: string;

  createdAt: Date;
  updatedAt: Date;
}

const StatItemSchema = new Schema<StatItem>({
  icon: { type: String, default: 'Users' },
  value: { type: String, required: true },
  suffix: { type: String, default: '' },
  label: { type: String, required: true },
}, { _id: false });

const DonationCardSchema = new Schema<DonationCard>({
  icon: { type: String, default: 'Heart' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  buttonText: { type: String, default: 'Learn More' },
  buttonLink: { type: String, default: '/donate' },
  recommended: { type: Boolean, default: false },
  isExternal: { type: Boolean, default: false },
}, { _id: false });

const HomepageSettingsSchema = new Schema<IHomepageSettingsDocument>({
  // Quote Section
  quoteText: { type: String, default: 'If we are able to develop the right attitude, we can drastically reduce the burden of our sorrows.' },
  quotePerson: { type: String, default: 'Fr. Joy Koothur' },
  quoteImage: { type: String, default: '/image/FATHER.png' },

  // Stats Section
  stats: {
    type: [StatItemSchema],
    default: [
      { icon: 'Users', value: '400', suffix: 'k+', label: 'Total Visitors' },
      { icon: 'HandHeart', value: '49', suffix: '', label: 'Bed Hospital' },
      { icon: 'Activity', value: '15', suffix: '', label: 'Home Care Vehicles' },
      { icon: 'Clock', value: '24/7', suffix: '', label: 'Emergency Care' },
    ],
  },

  // Services Section Heading
  servicesTitle: { type: String, default: 'Our Services' },
  servicesSubtitle: { type: String, default: 'Comprehensive care and support for patients and their families, provided with radical compassion and zero cost.' },

  // Donation Section
  donationBadge: { type: String, default: 'Support Our Mission' },
  donationTitle: { type: String, default: 'Help Us Heal More Lives' },
  donationDescription: { type: String, default: 'Your generosity enables us to provide free healthcare to those who need it most. Every contribution makes a difference.' },
  donationCards: {
    type: [DonationCardSchema],
    default: [
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
    ],
  },

  // Benevity Section
  benevityBadge: { type: String, default: 'Corporate Giving' },
  benevityTitle: { type: String, default: 'Support Us Through Benevity' },
  benevityDescription: { type: String, default: 'Shanthibhavan Palliative Hospital is a registered charity on the Benevity platform. If your company uses Benevity for workplace giving, you can double your impact through corporate matching.' },
  benevityFeature1Title: { type: String, default: 'Verified Charity' },
  benevityFeature1Desc: { type: String, default: 'Validated through global standards of accountability.' },
  benevityFeature2Title: { type: String, default: 'Global Standards' },
  benevityFeature2Desc: { type: String, default: 'Instant tax receipts and transparent reporting.' },
  benevityLearnMoreLink: { type: String, default: '/benevity' },
  benevityPortalLink: { type: String, default: 'https://causes.benevity.org/' },
  benevityImage: { type: String, default: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=1000&auto=format&fit=crop' },

  // CTA Section
  ctaTitle: { type: String, default: 'You Can Make a' },
  ctaHighlight: { type: String, default: 'Difference' },
  ctaDescription: { type: String, default: 'Your support helps us continue providing free care to those who need it most. Volunteer your time or donate to our cause.' },
  ctaButton1Text: { type: String, default: 'Donate Today' },
  ctaButton1Link: { type: String, default: '/donate' },
  ctaButton2Text: { type: String, default: 'Become a Volunteer' },
  ctaButton2Link: { type: String, default: '/volunteer' },
  ctaBgImage: { type: String, default: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2000&auto=format&fit=crop' },
}, { timestamps: true });

export default model<IHomepageSettingsDocument>('HomepageSettings', HomepageSettingsSchema);
