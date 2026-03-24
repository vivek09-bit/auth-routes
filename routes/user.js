import express from 'express';
const router = express.Router();
import { UserTestRecord } from '../models/Structure.js';

// Get test records for a user
router.get('/tests/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const records = await UserTestRecord.find({ userId })
      .populate('testId', 'category examTarget stage type') // Populate missing metadata
      .lean();

    if (!records || records.length === 0) {
      return res.status(200).json({ success: true, records: [] });
    }
    res.json({ success: true, records });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

export default router;
