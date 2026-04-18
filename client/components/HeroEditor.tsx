'use client';

import { useState, useEffect } from 'react';
import { Pencil, X, Save, Image as ImageIcon, Video } from 'lucide-react';
import MediaUpload from './admin/MediaUpload';

interface HeroEditorProps {
  currentBanner: any;
}

export default function HeroEditor({ currentBanner }: HeroEditorProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: currentBanner.title || '',
    subtitle: currentBanner.subtitle || '',
    description: currentBanner.description || '',
    tagline: currentBanner.tagline || '',
    taglineDescription: currentBanner.taglineDescription || '',
    mediaType: currentBanner.mediaType || 'image',
    imageUrl: currentBanner.imageUrl || '',
    videoUrl: currentBanner.videoUrl || '',
    thumbnailUrl: currentBanner.thumbnailUrl || '',
    ctaText: currentBanner.ctaText || '',
    ctaLink: currentBanner.ctaLink || '',
  });

  useEffect(() => {
    const adminCookie = document.cookie.split(';').find(c => c.trim().startsWith('admin_info='));
    if (adminCookie) setIsAdmin(true);
  }, []);

  const set = (field: string, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const isDefault = currentBanner._id === 'default1';
      if (!isDefault) {
        const { updateBanner } = await import('@/app/actions/banner');
        await updateBanner(currentBanner._id, { ...formData, location: 'home', isActive: true });
      } else {
        const { createBanner } = await import('@/app/actions/banner');
        await createBanner({ ...formData, location: 'home', isActive: true, order: 1 });
      }
      setShowModal(false);
      window.location.reload();
    } catch {
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <>
      {/* Floating edit button over the hero */}
      <button
        onClick={() => setShowModal(true)}
        className="absolute bottom-28 right-6 z-20 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white transition-all hover:-translate-y-0.5"
        style={{
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.35)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Pencil className="w-4 h-4" />
        Edit Hero
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">Edit Hero Section</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Form */}
            <div className="px-6 py-5 space-y-6 max-h-[calc(100vh-220px)] overflow-y-auto">

              {/* Background type */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Background Type</p>
                <div className="flex gap-3">
                  {(['image', 'video'] as const).map(type => (
                    <label
                      key={type}
                      className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.mediaType === type ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input type="radio" className="sr-only" checked={formData.mediaType === type} onChange={() => set('mediaType', type)} />
                      {type === 'image' ? <ImageIcon className={`w-4 h-4 ${formData.mediaType === type ? 'text-blue-600' : 'text-gray-400'}`} /> : <Video className={`w-4 h-4 ${formData.mediaType === type ? 'text-blue-600' : 'text-gray-400'}`} />}
                      <span className={`font-medium capitalize text-sm ${formData.mediaType === type ? 'text-blue-600' : 'text-gray-500'}`}>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Background media */}
              {formData.mediaType === 'image' ? (
                <MediaUpload
                  type="image"
                  currentUrl={formData.imageUrl}
                  onUploadComplete={url => set('imageUrl', url)}
                  label="Background Image"
                  maxSize={10}
                />
              ) : (
                <div className="space-y-4">
                  <MediaUpload
                    type="video"
                    currentUrl={formData.videoUrl}
                    onUploadComplete={url => set('videoUrl', url)}
                    label="Background Video"
                    maxSize={50}
                  />
                  <MediaUpload
                    type="image"
                    currentUrl={formData.thumbnailUrl}
                    onUploadComplete={url => set('thumbnailUrl', url)}
                    label="Video Poster (shown while video loads)"
                    maxSize={5}
                  />
                </div>
              )}

              {/* Title & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Headline</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => set('title', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Driven by People, Devoted to People."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={e => set('subtitle', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Always Free. Always Compassionate."
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => set('description', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="The first palliative hospital in India..."
                />
              </div>

              {/* Secondary block */}
              <div className="rounded-xl border border-dashed border-gray-300 p-4 space-y-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Secondary Block (optional)</p>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tagline Heading</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={e => set('tagline', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Hold a Hand in the Darkest Hour"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tagline Description</label>
                  <textarea
                    rows={2}
                    value={formData.taglineDescription}
                    onChange={e => set('taglineDescription', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="At Shanthibhavan, we provide dignity and comfort..."
                  />
                </div>
              </div>

              {/* CTA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={e => set('ctaText', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Donate Now"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Button Link</label>
                  <input
                    type="text"
                    value={formData.ctaLink}
                    onChange={e => set('ctaLink', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="/donate"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-colors disabled:opacity-60"
                style={{ background: '#050e24' }}
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
