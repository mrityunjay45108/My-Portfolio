import { Request, Response, NextFunction } from 'express';
import { TechnologyService } from '../services/technologyService.js';

export class TechnologyController {
  static async getTechnologies(req: Request, res: Response, next: NextFunction) {
    try {
      const { category } = req.query;
      const technologies = await TechnologyService.getAllTechnologies(category as string);
      res.status(200).json({
        success: true,
        data: technologies,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createTechnology(req: Request, res: Response, next: NextFunction) {
    try {
      const tech = await TechnologyService.createTechnology(req.body);
      res.status(201).json({
        success: true,
        message: 'Technology added successfully',
        data: tech,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateTechnology(req: Request, res: Response, next: NextFunction) {
    try {
      const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
      const tech = await TechnologyService.updateTechnology(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Technology updated successfully',
        data: tech,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTechnology(req: Request, res: Response, next: NextFunction) {
    try {
      const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
      await TechnologyService.deleteTechnology(id);
      res.status(200).json({
        success: true,
        message: 'Technology deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
