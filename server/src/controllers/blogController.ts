import { Request, Response, NextFunction } from 'express';
import { BlogService } from '../services/blogService.js';

export class BlogController {
  static async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search, category, tag, status } = req.query;
      const isAdmin = req.user?.role === 'ADMIN';

      const result = await BlogService.getPosts({
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 9,
        search: search as string,
        categorySlug: category as string,
        tagSlug: tag as string,
        status: status as any,
        isAdmin,
      });

      res.status(200).json({
        success: true,
        data: result.posts,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPost(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = (Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug) as string;
      const isAdmin = req.user?.role === 'ADMIN';

      const post = await BlogService.getPostBySlug(slug, isAdmin, !isAdmin);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Article not found',
        });
      }

      res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const post = await BlogService.createPost(req.user.userId, req.body);
      res.status(201).json({
        success: true,
        message: 'Article created successfully',
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updatePost(req: Request, res: Response, next: NextFunction) {
    try {
      const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
      const post = await BlogService.updatePost(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Article updated successfully',
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
      await BlogService.deletePost(id);
      res.status(200).json({
        success: true,
        message: 'Article deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await BlogService.getCategories();
      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body;
      const category = await BlogService.createCategory(name, description);
      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
      await BlogService.deleteCategory(id);
      res.status(200).json({
        success: true,
        message: 'Category deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTags(_req: Request, res: Response, next: NextFunction) {
    try {
      const tags = await BlogService.getTags();
      res.status(200).json({
        success: true,
        data: tags,
      });
    } catch (error) {
      next(error);
    }
  }
}
