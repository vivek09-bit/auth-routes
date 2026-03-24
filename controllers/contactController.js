import ContactMessage from '../models/ContactMessage.js';
import { sendEmail } from '../utils/emailService.js';

export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required' });
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      subject: subject ? subject.trim() : 'Contact Form Submission',
      message: message.trim(),
      ip: req.ip || req.headers['x-forwarded-for'] || null,
      userAgent: req.get('User-Agent') || null
    };

    // Save to DB
    const saved = await ContactMessage.create(payload);

    // Send email to one or many recipients (comma-separated list in env)
    // recipients list (allow env override); always include team addresses
    const defaultList = ['contact@igniverse.in', 'satyamsinghs408@gmail.com', 'vkg1257@gmail.com'];
    const rawReceiver = process.env.CONTACT_RECEIVER || process.env.EMAIL_TO || process.env.EMAIL_FROM || '';
    const envList = rawReceiver.split(',').map(r => r.trim()).filter(r => r);
    const receivers = Array.from(new Set([...defaultList, ...envList]));
    if (receivers.length) {
      const html = `
        <h3>New contact form submission</h3>
        <p><strong>Name:</strong> ${payload.name}</p>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Subject:</strong> ${payload.subject}</p>
        <p><strong>Message:</strong><br/>${payload.message.replace(/\n/g, '<br/>')}</p>
        <p><small>IP: ${payload.ip || 'N/A'} | UA: ${payload.userAgent || 'N/A'}</small></p>
      `;

      try {
        for (const to of receivers) {
          await sendEmail(to, `Contact: ${payload.subject}`, html);
        }
      } catch (e) {
        // Log email errors but don't fail the request
        console.error('Failed to send contact email:', e?.response || e);
      }
    }

    // Send confirmation email to the user
    try {
      const confirmationHtml = `
        <h3>Thank you for contacting us!</h3>
        <p>Hello ${payload.name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <hr/>
        <p><strong>Your Message Details:</strong></p>
        <p><strong>Subject:</strong> ${payload.subject}</p>
        <p><strong>Message:</strong><br/>${payload.message.replace(/\n/g, '<br/>')}</p>
        <hr/>
        <p>Thank you for reaching out to us!</p>
        <p>Best regards,<br/>Ignite Verse Team</p>
      `;
      await sendEmail(payload.email, `We received your message - ${payload.subject}`, confirmationHtml);
    } catch (e) {
      // Log email errors but don't fail the request
      console.error('Failed to send confirmation email to user:', e?.response || e);
    }

    return res.status(201).json({ message: 'Contact message received', id: saved._id });
  } catch (err) {
    console.error('Contact submit error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export { submitContact };
