import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/prisma';
import { githubService } from '../services/githubService';

export const getAdminFeaturedRepositories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repos = await prisma.gitHubRepository.findMany({
      include: {
        project: {
          select: { id: true, title: true, slug: true },
        },
      },
      orderBy: [{ featured: 'desc' }, { displayOrder: 'asc' }],
    });

    res.json({ success: true, count: repos.length, data: repos });
  } catch (err) {
    next(err);
  }
};

export const createAdminFeaturedRepository = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { owner, name, fullName, description, url, language, stars, forks, topics, featured, displayOrder, customDescription, projectId } = req.body;

    const full = fullName || `${owner}/${name}`;

    const repo = await prisma.gitHubRepository.upsert({
      where: { fullName: full },
      update: {
        owner,
        name,
        description,
        url,
        language,
        stars: stars || 0,
        forks: forks || 0,
        topics: topics || [],
        featured: featured ?? true,
        displayOrder: displayOrder || 0,
        customDescription,
        projectId: projectId || null,
      },
      create: {
        owner,
        name,
        fullName: full,
        description,
        url,
        language,
        stars: stars || 0,
        forks: forks || 0,
        topics: topics || [],
        featured: featured ?? true,
        displayOrder: displayOrder || 0,
        customDescription,
        projectId: projectId || null,
      },
      include: {
        project: {
          select: { id: true, title: true, slug: true },
        },
      },
    });

    res.status(201).json({ success: true, data: repo });
  } catch (err) {
    next(err);
  }
};

export const updateAdminFeaturedRepository = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    const { featured, displayOrder, customDescription, projectId } = req.body;

    const updated = await prisma.gitHubRepository.update({
      where: { id },
      data: {
        ...(featured !== undefined && { featured }),
        ...(displayOrder !== undefined && { displayOrder }),
        ...(customDescription !== undefined && { customDescription }),
        ...(projectId !== undefined && { projectId: projectId || null }),
      },
      include: {
        project: {
          select: { id: true, title: true, slug: true },
        },
      },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteAdminFeaturedRepository = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;

    await prisma.gitHubRepository.delete({
      where: { id },
    });

    res.json({ success: true, message: 'Repository removed successfully' });
  } catch (err) {
    next(err);
  }
};

export const syncGitHubRepositories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await githubService.syncWithDatabase();
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};
