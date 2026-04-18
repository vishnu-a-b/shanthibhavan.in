'use client';

import { useState, useEffect } from 'react';
import { Save, RotateCcw, Plus, Trash2 } from 'lucide-react';
import MediaUpload from '@/components/admin/MediaUpload';
import { getHomepageSettings, updateHomepageSettings, seedHomepageSettings } from '@/app/actions/homepage-settings';

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

interface Settings {
  quoteText: string;
  quotePerson: string;
  quoteImage: string;
  stats: StatItem[];
  servicesTitle: string;
  servicesSubtitle: string;
  donationBadge: string;
  donationTitle: string;
  donationDescription: string;
  donationCards: DonationCard[];
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
  ctaTitle: string;
  ctaHighlight: string;
  ctaDescription: string;
  ctaButton1Text: string;
  ctaButton1Link: string;
  ctaButton2Text: string;
  ctaButton2Link: string;
  ctaBgImage: string;
}

const DEFAULT_SETTINGS: Settings = {
  quoteText: 'If we are able to develop the right attitude, we can drastically reduce the burden of our sorrows.',
  quotePerson: 'Fr. Joy Koothur',
  quoteImage: '/image/FATHER.png',
  stats: [
    { icon: 'Users', value: '400', suffix: 'k+', label: 'Total Visitors' },
    { icon: 'HandHeart', value: '49', suffix: '', label: 'Bed Hospital' },
    { icon: 'Activity', value: '15', suffix: '', label: 'Home Care Vehicles' },
    { icon: 'Clock', value: '24/7', suffix: '', label: 'Emergency Care' },
  ],
  servicesTitle: 'Our Services',
  servicesSubtitle: 'Comprehensive care and support for patients and their families, provided with radical compassion and zero cost.',
  donationBadge: 'Support Our Mission',
  donationTitle: 'Help Us Heal More Lives',
  donationDescription: 'Your generosity enables us to provide free healthcare to those who need it most. Every contribution makes a difference.',
  donationCards: [
    { icon: 'Heart', title: 'One-Time Donation', description: 'Make a single contribution to support our daily operations and patient care.', buttonText: 'Donate Now', buttonLink: '/donate', recommended: false, isExternal: false },
    { icon: 'Users', title: 'Fellowship Program', description: 'Join our monthly giving program and become a sustaining supporter of our mission.', buttonText: 'Join Fellowship', buttonLink: 'https://fellowship.shanthibhavan.in/fellowship-packages', recommended: true, isExternal: true },
    { icon: 'Target', title: 'Active Campaigns', description: 'Support specific initiatives and help us reach targeted goals for special projects.', buttonText: 'View Campaigns', buttonLink: '/donate?tab=campaign', recommended: false, isExternal: false },
  ],
  benevityBadge: 'Corporate Giving',
  benevityTitle: 'Support Us Through Benevity',
  benevityDescription: 'Shanthibhavan Palliative Hospital is a registered charity on the Benevity platform. If your company uses Benevity for workplace giving, you can double your impact through corporate matching.',
  benevityFeature1Title: 'Verified Charity',
  benevityFeature1Desc: 'Validated through global standards of accountability.',
  benevityFeature2Title: 'Global Standards',
  benevityFeature2Desc: 'Instant tax receipts and transparent reporting.',
  benevityLearnMoreLink: '/benevity',
  benevityPortalLink: 'https://causes.benevity.org/',
  benevityImage: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=1000&auto=format&fit=crop',
  ctaTitle: 'You Can Make a',
  ctaHighlight: 'Difference',
  ctaDescription: 'Your support helps us continue providing free care to those who need it most. Volunteer your time or donate to our cause.',
  ctaButton1Text: 'Donate Today',
  ctaButton1Link: '/donate',
  ctaButton2Text: 'Become a Volunteer',
  ctaButton2Link: '/volunteer',
  ctaBgImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2000&auto=format&fit=crop',
};

const LUCIDE_ICON_OPTIONS = ['Users', 'HandHeart', 'Activity', 'Clock', 'Heart', 'Star', 'Award', 'Target', 'Globe', 'Shield', 'Zap', 'Phone', 'Home', 'Building', 'Stethoscope', 'Ambulance'];

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b">{title}</h2>
      {children}
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </div>
  );
}

function TextareaField({ label, value, onChange, placeholder, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </div>
  );
}

export default function HomepageSettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await getHomepageSettings();
      if (data) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...data,
          stats: data.stats?.length ? data.stats : DEFAULT_SETTINGS.stats,
          donationCards: data.donationCards?.length ? data.donationCards : DEFAULT_SETTINGS.donationCards,
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateHomepageSettings(settings);
      alert('Homepage settings saved successfully!');
    } catch (error) {
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('This will reset all homepage settings to default values. Are you sure?')) return;
    try {
      const data = await seedHomepageSettings();
      if (data) {
        setSettings({ ...DEFAULT_SETTINGS, ...data });
        alert('Settings reset to defaults!');
      }
    } catch (error) {
      alert('Error resetting settings');
    }
  };

  const updateStat = (index: number, field: keyof StatItem, value: string) => {
    const newStats = [...settings.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setSettings({ ...settings, stats: newStats });
  };

  const addStat = () => {
    setSettings({ ...settings, stats: [...settings.stats, { icon: 'Users', value: '0', suffix: '', label: 'New Stat' }] });
  };

  const removeStat = (index: number) => {
    setSettings({ ...settings, stats: settings.stats.filter((_, i) => i !== index) });
  };

  const updateCard = (index: number, field: keyof DonationCard, value: any) => {
    const newCards = [...settings.donationCards];
    newCards[index] = { ...newCards[index], [field]: value };
    setSettings({ ...settings, donationCards: newCards });
  };

  const addCard = () => {
    setSettings({
      ...settings,
      donationCards: [...settings.donationCards, { icon: 'Heart', title: 'New Card', description: '', buttonText: 'Learn More', buttonLink: '/donate', recommended: false, isExternal: false }],
    });
  };

  const removeCard = (index: number) => {
    setSettings({ ...settings, donationCards: settings.donationCards.filter((_, i) => i !== index) });
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>;

  return (
    <div className="p-8 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Homepage Settings</h1>
          <p className="text-gray-600 mt-1">Manage all hardcoded sections on the home page</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="bg-orange-100 text-orange-700 px-6 py-3 rounded-lg hover:bg-orange-200 flex items-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 flex items-center gap-2 transition-all shadow-lg disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="space-y-8 max-w-5xl mx-auto">

        {/* Quote Section */}
        <SectionCard title="Quote / Message Section">
          <p className="text-gray-500 text-sm mb-6">The founder's quote displayed in the blue banner between Services and Campaigns.</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <TextareaField
                label="Quote Text"
                value={settings.quoteText}
                onChange={(v) => setSettings({ ...settings, quoteText: v })}
                rows={4}
                placeholder="Enter the quote..."
              />
              <InputField
                label="Person Name"
                value={settings.quotePerson}
                onChange={(v) => setSettings({ ...settings, quotePerson: v })}
                placeholder="Fr. Joy Koothur"
              />
            </div>
            <div>
              <MediaUpload
                type="image"
                label="Quote Person Image"
                currentUrl={settings.quoteImage}
                onUploadComplete={(url) => setSettings({ ...settings, quoteImage: url })}
                maxSize={5}
              />
            </div>
          </div>
        </SectionCard>

        {/* Stats Section */}
        <SectionCard title="Stats / Counter Section">
          <p className="text-gray-500 text-sm mb-6">
            The four stat boxes shown on the dark blue background. For numeric values (e.g. "400"), an animated counter is used. For text values (e.g. "24/7"), it is displayed as-is.
          </p>
          <div className="space-y-4">
            {settings.stats.map((stat, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 relative group">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Icon (Lucide name)</label>
                    <select
                      value={stat.icon}
                      onChange={(e) => updateStat(index, 'icon', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      {LUCIDE_ICON_OPTIONS.map((icon) => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Value</label>
                    <input
                      value={stat.value}
                      onChange={(e) => updateStat(index, 'value', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="400 or 24/7"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Suffix</label>
                    <input
                      value={stat.suffix}
                      onChange={(e) => updateStat(index, 'suffix', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="k+ or leave blank"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Label</label>
                    <input
                      value={stat.label}
                      onChange={(e) => updateStat(index, 'label', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Total Visitors"
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeStat(index)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addStat}
              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-semibold"
            >
              <Plus className="w-4 h-4" /> Add Stat
            </button>
          </div>
        </SectionCard>

        {/* Services Section Heading */}
        <SectionCard title="Services Section Heading">
          <div className="grid md:grid-cols-2 gap-6">
            <InputField
              label="Section Title"
              value={settings.servicesTitle}
              onChange={(v) => setSettings({ ...settings, servicesTitle: v })}
              placeholder="Our Services"
            />
            <TextareaField
              label="Section Subtitle"
              value={settings.servicesSubtitle}
              onChange={(v) => setSettings({ ...settings, servicesSubtitle: v })}
              placeholder="Comprehensive care and support..."
            />
          </div>
        </SectionCard>

        {/* Donation Section */}
        <SectionCard title="Donation Section">
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <InputField label="Badge Text" value={settings.donationBadge} onChange={(v) => setSettings({ ...settings, donationBadge: v })} placeholder="Support Our Mission" />
              <InputField label="Section Title" value={settings.donationTitle} onChange={(v) => setSettings({ ...settings, donationTitle: v })} placeholder="Help Us Heal More Lives" />
            </div>
            <TextareaField label="Section Description" value={settings.donationDescription} onChange={(v) => setSettings({ ...settings, donationDescription: v })} />

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Donation Cards</h3>
                <button onClick={addCard} className="flex items-center gap-1 text-sm text-primary font-semibold">
                  <Plus className="w-4 h-4" /> Add Card
                </button>
              </div>
              <div className="space-y-4">
                {settings.donationCards.map((card, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 relative group">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Icon</label>
                        <select
                          value={card.icon}
                          onChange={(e) => updateCard(index, 'icon', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          {LUCIDE_ICON_OPTIONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Title</label>
                        <input value={card.title} onChange={(e) => updateCard(index, 'title', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                        <textarea value={card.description} onChange={(e) => updateCard(index, 'description', e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Button Text</label>
                        <input value={card.buttonText} onChange={(e) => updateCard(index, 'buttonText', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Button Link</label>
                        <input value={card.buttonLink} onChange={(e) => updateCard(index, 'buttonLink', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                      </div>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                          <input type="checkbox" checked={card.recommended} onChange={(e) => updateCard(index, 'recommended', e.target.checked)} className="rounded" />
                          Recommended
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                          <input type="checkbox" checked={card.isExternal} onChange={(e) => updateCard(index, 'isExternal', e.target.checked)} className="rounded" />
                          External Link
                        </label>
                      </div>
                    </div>
                    <button onClick={() => removeCard(index)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Benevity Section */}
        <SectionCard title="Benevity Section">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <InputField label="Badge Text" value={settings.benevityBadge} onChange={(v) => setSettings({ ...settings, benevityBadge: v })} placeholder="Corporate Giving" />
              <InputField label="Title" value={settings.benevityTitle} onChange={(v) => setSettings({ ...settings, benevityTitle: v })} placeholder="Support Us Through Benevity" />
              <TextareaField label="Description" value={settings.benevityDescription} onChange={(v) => setSettings({ ...settings, benevityDescription: v })} rows={4} />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Feature 1 Title" value={settings.benevityFeature1Title} onChange={(v) => setSettings({ ...settings, benevityFeature1Title: v })} />
                <InputField label="Feature 1 Description" value={settings.benevityFeature1Desc} onChange={(v) => setSettings({ ...settings, benevityFeature1Desc: v })} />
                <InputField label="Feature 2 Title" value={settings.benevityFeature2Title} onChange={(v) => setSettings({ ...settings, benevityFeature2Title: v })} />
                <InputField label="Feature 2 Description" value={settings.benevityFeature2Desc} onChange={(v) => setSettings({ ...settings, benevityFeature2Desc: v })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Learn More Link" value={settings.benevityLearnMoreLink} onChange={(v) => setSettings({ ...settings, benevityLearnMoreLink: v })} placeholder="/benevity" />
                <InputField label="Portal Link" value={settings.benevityPortalLink} onChange={(v) => setSettings({ ...settings, benevityPortalLink: v })} />
              </div>
            </div>
            <div>
              <MediaUpload
                type="image"
                label="Section Image"
                currentUrl={settings.benevityImage}
                onUploadComplete={(url) => setSettings({ ...settings, benevityImage: url })}
                maxSize={5}
              />
            </div>
          </div>
        </SectionCard>

        {/* CTA Section */}
        <SectionCard title="Call to Action Section">
          <p className="text-gray-500 text-sm mb-6">The full-width banner at the bottom of the home page with a background image.</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Title (before highlight)" value={settings.ctaTitle} onChange={(v) => setSettings({ ...settings, ctaTitle: v })} placeholder="You Can Make a" />
                <InputField label="Highlighted Word" value={settings.ctaHighlight} onChange={(v) => setSettings({ ...settings, ctaHighlight: v })} placeholder="Difference" />
              </div>
              <TextareaField label="Description" value={settings.ctaDescription} onChange={(v) => setSettings({ ...settings, ctaDescription: v })} rows={3} />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Button 1 Text" value={settings.ctaButton1Text} onChange={(v) => setSettings({ ...settings, ctaButton1Text: v })} placeholder="Donate Today" />
                <InputField label="Button 1 Link" value={settings.ctaButton1Link} onChange={(v) => setSettings({ ...settings, ctaButton1Link: v })} placeholder="/donate" />
                <InputField label="Button 2 Text" value={settings.ctaButton2Text} onChange={(v) => setSettings({ ...settings, ctaButton2Text: v })} placeholder="Become a Volunteer" />
                <InputField label="Button 2 Link" value={settings.ctaButton2Link} onChange={(v) => setSettings({ ...settings, ctaButton2Link: v })} placeholder="/volunteer" />
              </div>
            </div>
            <div>
              <MediaUpload
                type="image"
                label="Background Image"
                currentUrl={settings.ctaBgImage}
                onUploadComplete={(url) => setSettings({ ...settings, ctaBgImage: url })}
                maxSize={10}
              />
            </div>
          </div>
        </SectionCard>

      </div>
    </div>
  );
}
