import express from 'express';
const router = express.Router();
import authMiddleware from '../middleware/authMiddleware.js'; // Use existing auth middleware
import upload from '../middleware/upload.js'; // New upload middleware
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  getPreferences,
  updatePreferences,
  getStats,
  deleteAccount
} from '../controllers/userController.js'; // New user controller

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.post('/upload-avatar', authMiddleware, upload.single('avatar'), uploadAvatar);
router.get('/preferences', authMiddleware, getPreferences);
router.put('/preferences', authMiddleware, updatePreferences);
router.get('/stats', authMiddleware, getStats);
router.delete('/account', authMiddleware, deleteAccount);

export default router;
