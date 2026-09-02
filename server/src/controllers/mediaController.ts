import { Request, Response, NextFunction } from 'express';

export class MediaController {
  static async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file provided for upload',
        });
      }

      // Return the relative URL served by static Express endpoint
      const fileUrl = `/uploads/${req.file.filename}`;

      res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          url: fileUrl,
          filename: req.file.filename,
          originalName: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
