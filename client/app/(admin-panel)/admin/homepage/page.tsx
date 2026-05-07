'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, Database, X, Save } from 'lucide-react';
import {
  getHomeSections,
  createHomeSection,
  updateHomeSection,
  deleteHomeSection,
  seedHomeSections,
} from '@/app/actions/home-section';

interface HomeSection {
  _id: string;
  sectionName: string;
  sectionType: 'hero' | 'about' | 'services' | 'projects' | 'awards' | 'news' | 'donation' | 'cta';
  title: string;
  subtitle?: string;
  content?: string;
  ctaText?: string;
  ctaLink?: string;
  priority: number;
  isActive: boolean;
  isFirstFace: boolean;
  startDate: string;
  expiryDate: string;
}

const SECTION_TYPES = ['hero', 'about', 'services', 'projects', 'awards', 'news', 'donation', 'cta'] as const;

const sectionTypeColors: Record<string, string> = {
  hero: 'bg-purple-100 text-purple-700',
  about: 'bg-blue-100 text-blue-700',
  services: 'bg-green-100 text-green-700',
  projects: 'bg-orange-100 text-orange-700',
  awards: 'bg-yellow-100 text-yellow-700',
  news: 'bg-pink-100 text-pink-700',
  donation: 'bg-red-100 text-red-700',
  cta: 'bg-indigo-100 text-indigo-700',
};

const FAR_FUTURE = '2099-12-31';
const TODAY = new Date().toISOString().split('T')[0];

const EMPTY_FORM: Omit<HomeSection, '_id'> = {
  sectionName: '',
  sectionType: 'hero',
  title: '',
  subtitle: '',
  content: '',
  ctaText: '',
  ctaLink: '',
  priority: 50,
  isActive: true,
  isFirstFace: false,
  startDate: TODAY,
  expiryDate: FAR_FUTURE,
};

function SectionForm({
  initial,
  onSave,
  onClose,
  saving,
}: {
  initial: Omit<HomeSection, '_id'>;
  onSave: (data: Omit<HomeSection, '_id'>) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState(initial);
  const set = (field: keyof typeof form, value: any) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {initial.sectionName ? 'Edit Section' : 'Add Section'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Section Name *</label>
              <input
                value={form.sectionName}
                onChange={(e) => set('sectionName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g. Hero Banner"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Section Type *</label>
              <select
                value={form.sectionType}
                onChange={(e) => set('sectionType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {SECTION_TYPES.map((t) => (
                  <option key={t} value={t}>{t.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
            <input
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Section heading"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Subtitle</label>
            <input
              value={form.subtitle}
              onChange={(e) => set('subtitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Optional subtitle"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Content</label>
            <textarea
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Optional body text"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">CTA Text</label>
              <input
                value={form.ctaText}
                onChange={(e) => set('ctaText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Button label"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">CTA Link</label>
              <input
                value={form.ctaLink}
                onChange={(e) => set('ctaLink', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="/donate"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
              <input
                type="number"
                value={form.priority}
                onChange={(e) => set('priority', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={form.startDate?.toString().split('T')[0]}
                onChange={(e) => set('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Expiry Date</label>
              <input
                type="date"
                value={form.expiryDate?.toString().split('T')[0]}
                onChange={(e) => set('expiryDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => set('isActive', e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFirstFace}
                onChange={(e) => set('isFirstFace', e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium text-gray-700">First Face (Above the Fold)</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving || !form.sectionName || !form.title}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Section'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HomepageAdminPage() {
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSection, setEditingSection] = useState<HomeSection | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHomeSections();
  }, []);

  const fetchHomeSections = async () => {
    setLoading(true);
    try {
      const data = await getHomeSections();
      setSections(data);
    } catch (error) {
      console.error('Error fetching homepage sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: Omit<HomeSection, '_id'>) => {
    setSaving(true);
    try {
      if (editingSection) {
        await updateHomeSection(editingSection._id, formData);
      } else {
        await createHomeSection(formData);
      }
      setShowForm(false);
      setEditingSection(null);
      await fetchHomeSections();
    } catch (error) {
      alert('Failed to save section');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (section: HomeSection) => {
    setEditingSection(section);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this section?')) return;
    try {
      await deleteHomeSection(id);
      await fetchHomeSections();
    } catch {
      alert('Failed to delete section');
    }
  };

  const handleToggleActive = async (section: HomeSection) => {
    try {
      await updateHomeSection(section._id, { isActive: !section.isActive });
      await fetchHomeSections();
    } catch {
      alert('Failed to update section');
    }
  };

  const handlePriorityChange = async (section: HomeSection, direction: 'up' | 'down') => {
    const delta = direction === 'up' ? 10 : -10;
    try {
      await updateHomeSection(section._id, { priority: section.priority + delta });
      await fetchHomeSections();
    } catch {
      alert('Failed to update priority');
    }
  };

  const handleSeed = async () => {
    if (!confirm('This will replace all homepage sections with defaults. Continue?')) return;
    try {
      await seedHomeSections();
      await fetchHomeSections();
      alert('Homepage sections seeded successfully!');
    } catch {
      alert('Failed to seed sections');
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Homepage Sections</h1>
          <p className="text-gray-600 mt-1">Control homepage layout and section order</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSeed}
            className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-200 flex items-center gap-2 text-sm font-medium transition-all"
          >
            <Database className="w-4 h-4" />
            Seed Defaults
          </button>
          <button
            onClick={() => { setEditingSection(null); setShowForm(true); }}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Add Section
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-blue-900 mb-3">Homepage Layout Controls</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">First Face (Above the Fold)</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Hero Section</strong> — Always at top</li>
              <li>• <strong>Donation</strong> should be on second face</li>
              <li>• Toggle "First Face" for priority sections</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Display Logic</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Sections ordered by <strong>Priority</strong> (higher first)</li>
              <li>• Only <strong>Active</strong> sections within date range shown</li>
              <li>• Use ▲ ▼ to adjust priority by ±10</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading homepage sections...</div>
        ) : sections.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No sections found.{' '}
            <button onClick={handleSeed} className="text-primary underline">Seed defaults</button>{' '}
            or click "Add Section".
          </div>
        ) : (
          sections.map((section) => (
            <div
              key={section._id}
              className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${!section.isActive ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center gap-4">
                {/* Priority Controls */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handlePriorityChange(section, 'up')}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Increase priority"
                  >
                    <ArrowUp className="w-4 h-4 text-gray-500" />
                  </button>
                  <div className="bg-primary text-white px-3 py-2 rounded-lg font-bold text-sm text-center min-w-[48px]">
                    {section.priority}
                  </div>
                  <button
                    onClick={() => handlePriorityChange(section, 'down')}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Decrease priority"
                  >
                    <ArrowDown className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                {/* Section Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{section.sectionName}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sectionTypeColors[section.sectionType]}`}>
                      {section.sectionType.toUpperCase()}
                    </span>
                    {section.isFirstFace && (
                      <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                        FIRST FACE
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 font-medium">{section.title}</p>
                  {section.subtitle && <p className="text-sm text-gray-500">{section.subtitle}</p>}
                  {section.ctaText && (
                    <p className="text-xs text-blue-600 mt-1">
                      CTA: <strong>{section.ctaText}</strong>
                      {section.ctaLink && <span className="text-gray-400"> → {section.ctaLink}</span>}
                    </p>
                  )}
                </div>

                {/* Status & Actions */}
                <div className="flex flex-col items-end gap-2">
                  <div className="text-xs text-gray-400 text-right">
                    <div>{new Date(section.startDate).toLocaleDateString('en-IN')}</div>
                    <div>to {new Date(section.expiryDate).toLocaleDateString('en-IN')}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleActive(section)}
                      className={`p-2 rounded-lg transition-colors ${section.isActive ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                      title={section.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {section.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleEdit(section)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(section._id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <SectionForm
          initial={editingSection ? {
            sectionName: editingSection.sectionName,
            sectionType: editingSection.sectionType,
            title: editingSection.title,
            subtitle: editingSection.subtitle || '',
            content: editingSection.content || '',
            ctaText: editingSection.ctaText || '',
            ctaLink: editingSection.ctaLink || '',
            priority: editingSection.priority,
            isActive: editingSection.isActive,
            isFirstFace: editingSection.isFirstFace,
            startDate: editingSection.startDate,
            expiryDate: editingSection.expiryDate,
          } : EMPTY_FORM}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingSection(null); }}
          saving={saving}
        />
      )}
    </div>
  );
}
