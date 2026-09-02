import { Request, Response, NextFunction } from 'express';
import { githubService } from '../services/githubService';

export const getGitHubProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await githubService.getProfile();
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};

export const getGitHubRepositories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refresh = req.query.refresh === 'true';
    const repos = await githubService.getRepositories(refresh);
    res.json({ success: true, count: repos.length, data: repos });
  } catch (err) {
    next(err);
  }
};

export const getGitHubRepository = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const owner = (Array.isArray(req.params.owner) ? req.params.owner[0] : req.params.owner) as string;
    const repo = (Array.isArray(req.params.repo) ? req.params.repo[0] : req.params.repo) as string;

    const repoData = await githubService.getRepository(owner, repo);
    res.json({ success: true, data: repoData });
  } catch (err) {
    next(err);
  }
};

export const getGitHubLanguages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const languages = await githubService.getLanguages();
    res.json({ success: true, data: languages });
  } catch (err) {
    next(err);
  }
};

export const getGitHubActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activity = await githubService.getActivity();
    res.json({ success: true, count: activity.length, data: activity });
  } catch (err) {
    next(err);
  }
};

export const getGitHubContributions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contributions = await githubService.getContributions();
    res.json({ success: true, data: contributions });
  } catch (err) {
    next(err);
  }
};
