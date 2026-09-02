import prisma from '../database/prisma.js';

export interface ContactMessageInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export class ContactService {
  static async createMessage(data: ContactMessageInput) {
    return prisma.contactMessage.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        subject: data.subject?.trim() || null,
        message: data.message.trim(),
      },
    });
  }

  static async getAllMessages() {
    return prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async markAsRead(id: string, isRead = true) {
    return prisma.contactMessage.update({
      where: { id },
      data: { isRead },
    });
  }

  static async deleteMessage(id: string) {
    return prisma.contactMessage.delete({
      where: { id },
    });
  }
}
