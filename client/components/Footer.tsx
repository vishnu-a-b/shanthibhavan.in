import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone, Eye } from 'lucide-react';
import { getFooterContent } from '@/app/actions/footer';
import connectToDatabase from '@/lib/db';
import Visitor from '@/models/Visitor';
import FooterSocialLinks from '@/components/FooterSocialLinks';

interface FooterContent {
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
  linkedin?: string;
  whatsapp?: string;
  copyrightText?: string;
}

async function getVisitorCount(): Promise<number> {
  try {
    await connectToDatabase();
    const doc = await Visitor.findOne();
    return doc?.count ?? 0;
  } catch {
    return 0;
  }
}

export default async function Footer() {
  const [content, visitorCount] = await Promise.all([
    getFooterContent(),
    getVisitorCount(),
  ]);
  const footerContent: FooterContent = content || {};

  const address = footerContent.address || 'Shanthibhavan Palliative Hospital, Mountain of Mercy, Pallissery, Arattupuzha.P.O, Thrissur - 680562';
  const phone = footerContent.phone || '+91 9142653804';
  const email = footerContent.email || 'office@shanthibhavan.in';
  const description = footerContent.description || 'India\'s first no-bill palliative hospital. Providing compassionate care with dignity and love. A beacon of hope for those in need.';
  const copyrightText = footerContent.copyrightText || 'Shanthibhavan Palliative Hospital. All rights reserved.';

  const socialLinks = [
    { url: footerContent.facebook, label: 'Facebook', color: 'hover:bg-blue-600' },
    { url: footerContent.instagram, label: 'Instagram', color: 'hover:bg-pink-600' },
    { url: footerContent.youtube, label: 'YouTube', color: 'hover:bg-red-600' },
    { url: footerContent.twitter, label: 'Twitter', color: 'hover:bg-sky-500' },
    { url: footerContent.linkedin, label: 'LinkedIn', color: 'hover:bg-blue-700' },
    { url: footerContent.whatsapp ? `https://wa.me/${footerContent.whatsapp.replace(/[^0-9]/g, '')}` : '', label: 'WhatsApp', color: 'hover:bg-green-600' },
  ].filter((link): link is { url: string; label: string; color: string } => !!(link.url && link.url.trim() !== ''));

  return (
    <footer className="bg-zinc-950 text-zinc-400">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo/logo.png" alt="Shanthibhavan Logo" width={120} height={64} className="h-16 w-auto bg-white p-2 rounded-lg" />
              
            </Link>
            <p className="text-sm">
              {description}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Our Services</Link></li>
              <li><Link href="/team" className="hover:text-white transition-colors">Care Team</Link></li>
              <li><Link href="/volunteer" className="hover:text-white transition-colors">Volunteer</Link></li>
              <li><Link href="/donate" className="hover:text-white transition-colors">Donate</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1 shrink-0" />
                <span>{address}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">{phone}</a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Connect</h3>
            <p className="mb-4 text-sm">Follow our journey and support our cause.</p>
            <FooterSocialLinks links={socialLinks} />
          </div>
        </div>
        <div className="mt-8 border-t border-zinc-800 pt-8 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>&copy; {new Date().getFullYear()} {copyrightText}</p>
          <div className="flex items-center gap-1.5 text-zinc-500">
            <Eye className="h-3.5 w-3.5" />
            <span>{visitorCount.toLocaleString('en-IN')} total visitors</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
