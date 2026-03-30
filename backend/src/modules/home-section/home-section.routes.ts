import express, { Request, Response, Router } from 'express';
import HomeSection, { IHomeSectionDocument } from './home-section.model.js';

const router: Router = express.Router();

interface HomeSectionRequestBody {
  sectionName?: string;
  sectionType?: 'hero' | 'about' | 'services' | 'projects' | 'awards' | 'news' | 'donation' | 'cta';
  title?: string;
  subtitle?: string;
  content?: string;
  ctaText?: string;
  ctaLink?: string;
  priority?: number;
  isActive?: boolean;
  isFirstFace?: boolean;
  startDate?: Date;
  expiryDate?: Date;
}

// SEED default homepage sections
router.post('/seed', async (_req: Request, res: Response): Promise<void> => {
  try {
    await HomeSection.deleteMany({});

    const farFuture = new Date('2099-12-31');
    const now = new Date();

    const sections = [
      {
        sectionName: 'Hero Banner',
        sectionType: 'hero',
        title: 'India\'s First No-Bill Palliative Hospital',
        subtitle: 'Providing compassionate care with dignity and love — completely free of charge.',
        priority: 100,
        isActive: true,
        isFirstFace: true,
        startDate: now,
        expiryDate: farFuture,
      },
      {
        sectionName: 'About Shanthibhavan',
        sectionType: 'about',
        title: 'The First Palliative Hospital in India',
        subtitle: 'Established 1993',
        content: 'Shanthibhavan Palliative Hospital operates as a division of the Franciscan Sisters of St. Clare Charitable Trust. We function as a no-bill hospital with 49 beds, providing comprehensive palliative care without bills and cash counters.',
        ctaText: 'Learn More About Us',
        ctaLink: '/about',
        priority: 90,
        isActive: true,
        isFirstFace: false,
        startDate: now,
        expiryDate: farFuture,
      },
      {
        sectionName: 'Our Services',
        sectionType: 'services',
        title: 'Our Services',
        subtitle: 'Comprehensive care and support for patients and their families, provided with radical compassion and zero cost.',
        ctaText: 'View All Services',
        ctaLink: '/services',
        priority: 80,
        isActive: true,
        isFirstFace: false,
        startDate: now,
        expiryDate: farFuture,
      },
      {
        sectionName: 'Active Campaigns',
        sectionType: 'donation',
        title: 'Support Our Campaigns',
        subtitle: 'Help us reach specific goals for important initiatives.',
        ctaText: 'Donate Now',
        ctaLink: '/donate',
        priority: 70,
        isActive: true,
        isFirstFace: false,
        startDate: now,
        expiryDate: farFuture,
      },
      {
        sectionName: 'Featured Projects',
        sectionType: 'projects',
        title: 'Our Projects',
        subtitle: 'Initiatives we are working on to extend our reach and impact.',
        priority: 60,
        isActive: true,
        isFirstFace: false,
        startDate: now,
        expiryDate: farFuture,
      },
      {
        sectionName: 'Awards & Recognition',
        sectionType: 'awards',
        title: 'Awards & Recognition',
        subtitle: 'Honoured for our commitment to compassionate palliative care.',
        priority: 50,
        isActive: true,
        isFirstFace: false,
        startDate: now,
        expiryDate: farFuture,
      },
      {
        sectionName: 'News & Events',
        sectionType: 'news',
        title: 'News & Events',
        subtitle: 'Stay updated with the latest from Shanthibhavan.',
        ctaText: 'View All',
        ctaLink: '/news-events',
        priority: 40,
        isActive: true,
        isFirstFace: false,
        startDate: now,
        expiryDate: farFuture,
      },
      {
        sectionName: 'Donate CTA',
        sectionType: 'cta',
        title: 'You Can Make a Difference',
        subtitle: 'Your support helps us continue providing free care to those who need it most.',
        ctaText: 'Donate Today',
        ctaLink: '/donate',
        priority: 30,
        isActive: true,
        isFirstFace: false,
        startDate: now,
        expiryDate: farFuture,
      },
    ];

    const result = await HomeSection.insertMany(sections);
    res.json({ success: true, message: 'Seeded homepage sections', count: result.length });
  } catch (error) {
    console.error('Error seeding homepage sections:', error);
    res.status(500).json({ success: false, error: 'Failed to seed homepage sections' });
  }
});

// GET all homepage sections (with CMS filtering)
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const sections: IHomeSectionDocument[] = await HomeSection.find({
      isActive: true,
      startDate: { $lte: now },
      expiryDate: { $gte: now },
    })
      .sort({ priority: -1, createdAt: -1 })
      .exec();

    res.json({ success: true, sections });
  } catch (error) {
    console.error('Error fetching homepage sections:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch homepage sections' });
  }
});

// GET all homepage sections (admin - no filtering)
router.get('/admin', async (_req: Request, res: Response): Promise<void> => {
  try {
    const sections: IHomeSectionDocument[] = await HomeSection.find()
      .sort({ priority: -1, createdAt: -1 })
      .exec();

    res.json({ success: true, sections });
  } catch (error) {
    console.error('Error fetching homepage sections:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch homepage sections' });
  }
});

// CREATE new homepage section
router.post('/', async (req: Request<{}, {}, HomeSectionRequestBody>, res: Response): Promise<void> => {
  try {
    const sectionData: HomeSectionRequestBody = req.body;
    const newSection: IHomeSectionDocument = await HomeSection.create(sectionData);
    res.status(201).json({ success: true, section: newSection });
  } catch (error) {
    console.error('Error creating homepage section:', error);
    res.status(500).json({ success: false, error: 'Failed to create homepage section' });
  }
});

// UPDATE homepage section by ID
router.put('/:id', async (req: Request<{ id: string }, {}, HomeSectionRequestBody>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: HomeSectionRequestBody = req.body;
    const updatedSection: IHomeSectionDocument | null = await HomeSection.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedSection) {
      res.status(404).json({ success: false, error: 'Homepage section not found' });
      return;
    }

    res.json({ success: true, section: updatedSection });
  } catch (error) {
    console.error('Error updating homepage section:', error);
    res.status(500).json({ success: false, error: 'Failed to update homepage section' });
  }
});

// DELETE homepage section by ID
router.delete('/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedSection: IHomeSectionDocument | null = await HomeSection.findByIdAndDelete(id);

    if (!deletedSection) {
      res.status(404).json({ success: false, error: 'Homepage section not found' });
      return;
    }

    res.json({ success: true, message: 'Homepage section deleted successfully' });
  } catch (error) {
    console.error('Error deleting homepage section:', error);
    res.status(500).json({ success: false, error: 'Failed to delete homepage section' });
  }
});

export default router;
