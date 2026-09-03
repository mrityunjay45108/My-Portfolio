import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/projectService.js';

export class ProjectController {
  static async getProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, featured, search } = req.query;
      const isAdmin = req.user?.role === 'ADMIN';

      const projects = await ProjectService.getAllProjects({
        publishedOnly: !isAdmin,
        featuredOnly: featured === 'true',
        category: category as string,
        search: search as string,
      });

      res.status(200).json({
        success: true,
        data: projects,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getFeaturedProjects(_req: Request, res: Response, next: NextFunction) {
    try {
      const projects = await ProjectService.getFeaturedProjects();
      res.status(200).json({
        success: true,
        data: projects,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProject(req: Request, res: Response, next: NextFunction) {
    try {
      const slugOrId = (Array.isArray(req.params.slugOrId) ? req.params.slugOrId[0] : req.params.slugOrId) as string;
      const isAdmin = req.user?.role === 'ADMIN';

      const project = await ProjectService.getProjectBySlugOrId(slugOrId, !isAdmin);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found',
        });
      }

      if (!project.published && !isAdmin) {
        return res.status(404).json({
          success: false,
          message: 'Project not found',
        });
      }

      res.status(200).json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createProject(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.createProject(req.body);
      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProject(req: Request, res: Response, next: NextFunction) {
    try {
      const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
      const project = await ProjectService.updateProject(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Project updated successfully',
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProject(req: Request, res: Response, next: NextFunction) {
    try {
      const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
      const result = await ProjectService.deleteProject(id);
      if (!result) {
        return res.status(200).json({
          success: true,
          message: 'Project removed or was not present in database',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Project deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async addImage(req: Request, res: Response, next: NextFunction) {
    try {
      const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
      const { url, altText, order } = req.body;
      const image = await ProjectService.addImage(id, url, altText, order);
      res.status(201).json({
        success: true,
        message: 'Image added successfully',
        data: image,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteImage(req: Request, res: Response, next: NextFunction) {
    try {
      const imageId = (Array.isArray(req.params.imageId) ? req.params.imageId[0] : req.params.imageId) as string;
      await ProjectService.deleteImage(imageId);
      res.status(200).json({
        success: true,
        message: 'Image deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async reorderImages(req: Request, res: Response, next: NextFunction) {
    try {
      const { images } = req.body;
      await ProjectService.reorderImages(images);
      res.status(200).json({
        success: true,
        message: 'Images reordered successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async reorderProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const { projects } = req.body;
      await ProjectService.reorderProjects(projects);
      res.status(200).json({
        success: true,
        message: 'Projects reordered successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
