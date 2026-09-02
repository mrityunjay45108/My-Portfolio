import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';
import { config } from '../config/index.js';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const { token, user } = await AuthService.login(email, password);

      // Set secure HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: config.isProduction,
        sameSite: config.isProduction ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        domain: config.cookieDomain,
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user,
        },
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || 'Authentication failed',
      });
    }
  }

  static async logout(_req: Request, res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: config.isProduction,
      sameSite: config.isProduction ? 'strict' : 'lax',
      domain: config.cookieDomain,
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authenticated',
        });
      }

      const user = await AuthService.getMe(req.user.userId);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}
