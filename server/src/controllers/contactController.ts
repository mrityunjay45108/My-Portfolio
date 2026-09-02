import { Request, Response, NextFunction } from 'express';
import { ContactService } from '../services/contactService.js';

export class ContactController {
  static async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const message = await ContactService.createMessage(req.body);
      res.status(201).json({
        success: true,
        message: 'Your message has been sent successfully. Mrityunjay will get back to you soon!',
        data: {
          id: message.id,
          createdAt: message.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMessages(_req: Request, res: Response, next: NextFunction) {
    try {
      const messages = await ContactService.getAllMessages();
      res.status(200).json({
        success: true,
        data: messages,
      });
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
      const { isRead } = req.body;
      const message = await ContactService.markAsRead(id, isRead !== undefined ? isRead : true);
      res.status(200).json({
        success: true,
        message: 'Message status updated',
        data: message,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
      await ContactService.deleteMessage(id);
      res.status(200).json({
        success: true,
        message: 'Message deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
