import { Request, Response } from 'express';
import { contactService } from '../services/contactService.js';

export const contactController = {
  /**
   * Public contact submission
   */
  async submitContact(req: Request, res: Response) {
    try {
      const { name, email, subject, message, company, purpose, sessionId } = req.body;
      const result = await contactService.createMessage({
        name,
        email,
        subject,
        message,
        company,
        purpose,
        sessionId,
      });

      return res.status(201).json({
        success: true,
        message: 'Thank you! Your message has been sent successfully. Mrityunjay will get back to you shortly.',
        data: { id: result.id },
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  /**
   * Admin: Get messages with search & status filters
   */
  async getMessages(req: Request, res: Response) {
    try {
      const status = req.query.status as string;
      const search = req.query.search as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      const data = await contactService.getMessages({ status, search, page, limit });
      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Admin: Update status
   */
  async updateStatus(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const { status } = req.body;
      const updated = await contactService.updateStatus(id, status);
      return res.json({ success: true, data: updated });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  /**
   * Admin: Delete message
   */
  async deleteMessage(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      await contactService.deleteMessage(id);
      return res.json({ success: true, message: 'Message deleted successfully' });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },
};
