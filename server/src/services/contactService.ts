import prisma from '../database/prisma.js';
import { analyticsService } from './analyticsService.js';

export interface CreateContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
  company?: string;
  purpose?: string;
  sessionId?: string;
}

export class ContactService {
  /**
   * Save a new contact message from visitor
   */
  async createMessage(payload: CreateContactPayload) {
    if (!payload.name || !payload.email || !payload.message) {
      throw new Error('Name, Email, and Message are required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      throw new Error('Please enter a valid email address');
    }

    const cleanName = payload.name.trim().slice(0, 100);
    const cleanEmail = payload.email.trim().toLowerCase().slice(0, 150);
    const cleanMessage = payload.message.trim().slice(0, 4000);
    const cleanSubject = payload.subject?.trim().slice(0, 200) || 'New Portfolio Inquiry';
    const cleanCompany = payload.company?.trim().slice(0, 100) || null;
    const cleanPurpose = payload.purpose?.trim().slice(0, 50) || 'Job Opportunity';

    const message = await prisma.contactMessage.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        subject: cleanSubject,
        message: cleanMessage,
        company: cleanCompany,
        purpose: cleanPurpose,
        status: 'NEW',
        isRead: false,
      },
    });

    // Record analytics conversion event
    if (payload.sessionId) {
      analyticsService.recordEvent({
        eventType: 'CONTACT_FORM_SUBMIT',
        sessionId: payload.sessionId,
        page: '/#contact',
        resourceType: 'contact',
        resourceId: message.id,
        metadata: {
          purpose: cleanPurpose,
          hasCompany: !!cleanCompany,
        },
      }).catch(() => {});
    }

    return message;
  }

  /**
   * Admin: Get all contact messages with search & status filters
   */
  async getMessages(params: { status?: string; search?: string; page?: number; limit?: number }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, params.limit || 50);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params.status && params.status !== 'ALL') {
      where.status = params.status;
    }

    if (params.search) {
      const q = params.search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { subject: { contains: q, mode: 'insensitive' } },
        { company: { contains: q, mode: 'insensitive' } },
        { message: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [messages, total, unreadCount] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.contactMessage.count({ where }),
      prisma.contactMessage.count({ where: { status: 'NEW' } }),
    ]);

    return {
      messages,
      total,
      unreadCount,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Admin: Update message status (NEW, READ, REPLIED, ARCHIVED)
   */
  async updateStatus(id: string, status: 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED') {
    return prisma.contactMessage.update({
      where: { id },
      data: {
        status,
        isRead: status !== 'NEW',
      },
    });
  }

  /**
   * Admin: Delete contact message
   */
  async deleteMessage(id: string) {
    return prisma.contactMessage.delete({
      where: { id },
    });
  }
}

export const contactService = new ContactService();
