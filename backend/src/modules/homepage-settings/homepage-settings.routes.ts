import express, { Request, Response, Router } from 'express';
import HomepageSettings from './homepage-settings.model.js';

const router: Router = express.Router();

// GET homepage settings (singleton)
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    let settings = await HomepageSettings.findOne();
    if (!settings) {
      settings = await HomepageSettings.create({});
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching homepage settings:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch homepage settings' });
  }
});

// UPDATE homepage settings (singleton upsert)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;
    let settings = await HomepageSettings.findOne();

    if (settings) {
      settings = await HomepageSettings.findByIdAndUpdate(settings._id, data, { new: true });
    } else {
      settings = await HomepageSettings.create(data);
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error saving homepage settings:', error);
    res.status(500).json({ success: false, error: 'Failed to save homepage settings' });
  }
});

// SEED defaults (reset to original values)
router.post('/seed', async (_req: Request, res: Response): Promise<void> => {
  try {
    await HomepageSettings.deleteMany({});
    const settings = await HomepageSettings.create({});
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error seeding homepage settings:', error);
    res.status(500).json({ success: false, error: 'Failed to seed homepage settings' });
  }
});

export default router;
