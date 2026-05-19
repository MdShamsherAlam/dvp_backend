// src/routes/auth.routes.ts
// Defines all routes for the auth-service.

import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth.middleware';
import {
  registerSchema,
  loginSchema,
  refreshSchema,
} from '../validators/auth.validator';

const router = Router();

// ── Public Routes ─────────────────────────────────────────────
router.post('/register', validate(registerSchema), authController.register.bind(authController));
router.post('/login',    validate(loginSchema),    authController.login.bind(authController));
router.post('/refresh',  validate(refreshSchema),  authController.refresh.bind(authController));

// ── Protected Routes (require valid JWT) ─────────────────────
router.post('/logout',    authenticate, authController.logout.bind(authController));
router.get('/me',         authenticate, authController.me.bind(authController));
router.get('/validate',   authenticate, authController.validate.bind(authController));

export default router;
