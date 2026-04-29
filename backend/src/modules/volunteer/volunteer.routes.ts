import express, { Request, Response, Router } from 'express';
import Volunteer, { IVolunteerDocument } from './volunteer.model.js';

const router: Router = express.Router();

interface VolunteerRequestBody {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  message?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

// GET all volunteers with pagination
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const [volunteers, total] = await Promise.all([
      Volunteer.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Volunteer.countDocuments()
    ]);

    res.json({
      success: true,
      volunteers,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch volunteers' });
  }
});

// CREATE new volunteer
router.post('/', async (req: Request<{}, {}, VolunteerRequestBody>, res: Response): Promise<void> => {
  try {
    const volunteerData: VolunteerRequestBody = req.body;
    const newVolunteer: IVolunteerDocument = await Volunteer.create(volunteerData);
    res.status(201).json({ success: true, volunteer: newVolunteer });
  } catch (error) {
    console.error('Error creating volunteer:', error);
    res.status(500).json({ success: false, error: 'Failed to create volunteer' });
  }
});

export default router;
