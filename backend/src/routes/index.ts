import { Router } from 'express';
import authRoutes from './authRoutes';
import signageRoutes from './signageRoutes';
import authorizedPersonRoutes from './authorizedPersonRoutes';
import emergencyPlanRoutes from './emergencyPlanRoutes';
import organizationChartRoutes from './organizationChartRoutes';
import templateRoutes from './templateRoutes';
import blogRoutes from './blogRoutes';
import brandingRoutes from './brandingRoutes';
import settingsRoutes from './settingsRoutes';
import adminRoutes from './adminRoutes';
import uploadRoutes from './uploadRoutes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
router.use('/auth', authRoutes);
router.use('/signages', signageRoutes);
router.use('/authorized-persons', authorizedPersonRoutes);
router.use('/emergency-plans', emergencyPlanRoutes);
router.use('/organization-charts', organizationChartRoutes);
router.use('/templates', templateRoutes);
router.use('/blog', blogRoutes);
router.use('/branding', brandingRoutes);
router.use('/settings', settingsRoutes);
router.use('/admin', adminRoutes);
router.use('/uploads', uploadRoutes);

export default router;
