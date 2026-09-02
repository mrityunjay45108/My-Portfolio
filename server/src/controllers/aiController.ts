import { Request, Response } from 'express';
import { aiPortfolioService } from '../services/ai/ai-portfolio.service.js';

export const aiController = {
  /**
   * Standard JSON chat response
   */
  async chat(req: Request, res: Response) {
    try {
      const { message, conversationId, sessionId } = req.body;
      const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'ip-anon';

      const result = await aiPortfolioService.chat({
        message,
        conversationId,
        sessionId,
        ip: clientIp,
      });

      return res.json(result);
    } catch (error: any) {
      console.error('AI chat controller error:', error);
      return res.status(500).json({
        success: false,
        answer: "I'm temporarily experiencing an issue. You can explore Mrityunjay's Projects, Skills, and About sections directly!",
        sources: [],
        responseType: 'text',
      });
    }
  },

  /**
   * Real-time Server-Sent Events (SSE) streaming chat
   */
  async streamChat(req: Request, res: Response) {
    try {
      const { message, conversationId, sessionId } = req.body;
      const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'ip-anon';

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders?.();

      const meta = await aiPortfolioService.streamChat(
        {
          message,
          conversationId,
          sessionId,
          ip: clientIp,
        },
        (chunk) => {
          res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunk })}\n\n`);
        }
      );

      res.write(`data: ${JSON.stringify({ type: 'done', meta })}\n\n`);
      res.end();
    } catch (error: any) {
      console.error('AI stream chat error:', error);
      res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
      res.end();
    }
  },

  /**
   * Suggested starter questions
   */
  getSuggestedQuestions(_req: Request, res: Response) {
    const questions = aiPortfolioService.getSuggestedQuestions();
    return res.json({ success: true, questions });
  },

  /**
   * Admin analytics & usage stats
   */
  async getAdminStats(_req: Request, res: Response) {
    try {
      const stats = await aiPortfolioService.getAdminStats();
      return res.json({ success: true, data: stats });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Admin update settings
   */
  async updateSettings(req: Request, res: Response) {
    try {
      const { enabled, provider, model, rateLimitPerMin } = req.body;
      const updated = await aiPortfolioService.updateSettings({
        enabled,
        provider,
        model,
        rateLimitPerMin: rateLimitPerMin ? Number(rateLimitPerMin) : undefined,
      });
      return res.json({ success: true, data: updated });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Admin clear history
   */
  async clearConversations(_req: Request, res: Response) {
    try {
      await aiPortfolioService.clearConversations();
      return res.json({ success: true, message: 'All AI conversation history cleared' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};
