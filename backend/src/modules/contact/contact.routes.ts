import express, { Request, Response, Router } from 'express';
import Contact, { IContactDocument } from './contact.model.js';

const router: Router = express.Router();

interface ContactRequestBody {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  status?: 'new' | 'read' | 'replied';
}

// GET all contacts with pagination
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const [contacts, total] = await Promise.all([
      Contact.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Contact.countDocuments()
    ]);

    res.json({
      success: true,
      contacts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch contacts' });
  }
});

// CREATE new contact
router.post('/', async (req: Request<{}, {}, ContactRequestBody>, res: Response): Promise<void> => {
  try {
    const contactData: ContactRequestBody = req.body;
    const newContact: IContactDocument = await Contact.create(contactData);
    res.status(201).json({ success: true, contact: newContact });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ success: false, error: 'Failed to create contact' });
  }
});

export default router;
