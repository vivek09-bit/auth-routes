import mongoose from 'mongoose';

const ContactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String },
  message: { type: String, required: true },
  ip: { type: String },
  userAgent: { type: String },
  receivedAt: { type: Date, default: Date.now }
});

export default mongoose.model('ContactMessage', ContactMessageSchema);
