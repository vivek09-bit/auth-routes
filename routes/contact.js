import express from 'express';
const router = express.Router();
import { submitContact } from '../controllers/contactController.js';

// POST /api/contact
router.post('/', submitContact);

export default router;
