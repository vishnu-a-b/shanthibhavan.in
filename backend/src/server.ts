import dotenv from 'dotenv';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import bannerRoutes from './modules/banner/banner.routes.js';
import paymentRoutes from './modules/payment/payment.routes.js';
import volunteerRoutes from './modules/volunteer/volunteer.routes.js';
import contactRoutes from './modules/contact/contact.routes.js';
import statsRoutes from './modules/stats/stats.routes.js';
// CMS Routes
import serviceRoutes from './modules/service/service.routes.js';
import servicesPageRoutes from './modules/service/services-page.routes.js';
import projectRoutes from './modules/featured-project/featured-project.routes.js';
import awardRoutes from './modules/award/award.routes.js';
import newsEventRoutes from './modules/news-event/news-event.routes.js';
import teamMemberRoutes from './modules/team-member/team-member.routes.js';
import homeSectionRoutes from './modules/home-section/home-section.routes.js';
import aboutRoutes from './modules/about/about.routes.js';
import aboutImageRoutes from './modules/about/about-image.routes.js';
import benevityRoutes from './modules/benevity/benevity.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import donationRoutes from './modules/donation/donation.routes.js';
import fellowshipRoutes from './modules/fellowship/fellowship.routes.js';
import campaignRoutes from './modules/campaign/campaign.routes.js';
import footerRoutes from './modules/footer/footer.routes.js';
import uploadRoutes from './modules/upload/upload.routes.js';
import galleryRoutes from './modules/gallery/gallery.routes.js';
import homepageSettingsRoutes from './modules/homepage-settings/homepage-settings.routes.js';

// Load environment variables
dotenv.config();

const app: Express = express();

// Connect to MongoDB
connectDB();

// Trust reverse proxy (Nginx) so req.ip returns the real client IP from X-Forwarded-For
app.set('trust proxy', true);

// Middleware
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} | Origin: ${req.headers.origin}`);
  next();
});

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3005',
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, '../public')));

// Routes - Operations
app.use('/v1/api/banner', bannerRoutes);
app.use('/v1/api/payment', paymentRoutes);
app.use('/v1/api/volunteer', volunteerRoutes);
app.use('/v1/api/contact', contactRoutes);
app.use('/v1/api/stats', statsRoutes);

// Routes - CMS Content
app.use('/v1/api/about', aboutRoutes);
app.use('/v1/api/about-image', aboutImageRoutes);
app.use('/v1/api/services', serviceRoutes);
app.use('/v1/api/services-page', servicesPageRoutes);
app.use('/v1/api/projects', projectRoutes);
app.use('/v1/api/awards', awardRoutes);
app.use('/v1/api/news-events', newsEventRoutes);
app.use('/v1/api/team', teamMemberRoutes);
app.use('/v1/api/homepage', homeSectionRoutes);
app.use('/v1/api/benevity', benevityRoutes);
app.use('/v1/api/admin', adminRoutes);
app.use('/v1/api/donation', donationRoutes);
app.use('/v1/api/fellowship', fellowshipRoutes);
app.use('/v1/api/campaign', campaignRoutes);
app.use('/v1/api/footer', footerRoutes);
app.use('/v1/api/upload', uploadRoutes);
app.use('/v1/api/gallery', galleryRoutes);
app.use('/v1/api/homepage-settings', homepageSettingsRoutes);

// Health check route
app.get('/v1/api/health', (_req: Request, res: Response): void => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

// Error handling middleware
interface ErrorWithStack extends Error {
  stack?: string;
}

app.use((err: ErrorWithStack, _req: Request, res: Response, _next: NextFunction): void => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!',
    message: err.message
  });
});

const PORT: number = parseInt(process.env.PORT || '5001', 10);

app.listen(PORT, (): void => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
