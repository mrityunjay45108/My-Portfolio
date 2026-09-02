import prisma from '../database/prisma.js';

export interface BlogPostInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  status?: 'DRAFT' | 'PREVIEW' | 'PUBLISHED' | 'ARCHIVED';
  categoryId?: string;
  tags?: string[];
  readingTime?: number;
}

export class BlogService {
  static async getPosts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    categorySlug?: string;
    tagSlug?: string;
    status?: 'DRAFT' | 'PREVIEW' | 'PUBLISHED' | 'ARCHIVED';
    isAdmin?: boolean;
  }) {
    const page = Math.max(1, params?.page || 1);
    const limit = Math.min(50, Math.max(1, params?.limit || 9));
    const skip = (page - 1) * limit;

    const where: any = {};

    // Public users only see PUBLISHED
    if (!params?.isAdmin) {
      where.status = 'PUBLISHED';
    } else if (params?.status) {
      where.status = params.status;
    }

    if (params?.categorySlug) {
      where.category = { slug: params.categorySlug };
    }

    if (params?.tagSlug) {
      where.tags = {
        some: {
          tag: { slug: params.tagSlug },
        },
      };
    }

    if (params?.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { excerpt: { contains: params.search, mode: 'insensitive' } },
        { content: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        include: {
          author: { select: { id: true, name: true, email: true } },
          category: true,
          tags: { include: { tag: true } },
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getPostBySlug(slug: string, isAdmin = false, incrementView = true) {
    const where: any = { slug };
    if (!isAdmin) {
      where.status = 'PUBLISHED';
    }

    const post = await prisma.blogPost.findFirst({
      where,
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
        tags: { include: { tag: true } },
      },
    });

    if (!post) return null;

    if (incrementView) {
      await prisma.blogPost.update({
        where: { id: post.id },
        data: { viewCount: { increment: 1 } },
      });
    }

    // Get previous and next published posts
    const [prevPost, nextPost] = await Promise.all([
      prisma.blogPost.findFirst({
        where: {
          status: 'PUBLISHED',
          createdAt: { lt: post.createdAt },
        },
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, slug: true, featuredImage: true },
      }),
      prisma.blogPost.findFirst({
        where: {
          status: 'PUBLISHED',
          createdAt: { gt: post.createdAt },
        },
        orderBy: { createdAt: 'asc' },
        select: { id: true, title: true, slug: true, featuredImage: true },
      }),
    ]);

    // Related posts by category
    const relatedPosts = post.categoryId
      ? await prisma.blogPost.findMany({
          where: {
            status: 'PUBLISHED',
            categoryId: post.categoryId,
            id: { not: post.id },
          },
          take: 3,
          orderBy: { createdAt: 'desc' },
          include: { category: true },
        })
      : [];

    return {
      ...post,
      prevPost,
      nextPost,
      relatedPosts,
    };
  }

  static async createPost(authorId: string, data: BlogPostInput) {
    const { tags = [], categoryId, ...postData } = data;

    // Calculate reading time roughly (words / 200 wpm)
    const wordCount = postData.content.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const post = await prisma.blogPost.create({
      data: {
        ...postData,
        readingTime: data.readingTime || readingTime,
        authorId,
        categoryId: categoryId || null,
        publishedAt: postData.status === 'PUBLISHED' ? new Date() : null,
      },
    });

    if (tags.length > 0) {
      for (const tagName of tags) {
        const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        let tag = await prisma.tag.findFirst({ where: { slug } });
        if (!tag) {
          tag = await prisma.tag.create({ data: { name: tagName, slug } });
        }
        await prisma.postTag.create({
          data: { postId: post.id, tagId: tag.id },
        });
      }
    }

    return this.getPostBySlug(post.slug, true, false);
  }

  static async updatePost(id: string, data: Partial<BlogPostInput>) {
    const { tags, categoryId, ...postData } = data;

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) throw new Error('Blog post not found');

    let publishedAt = existing.publishedAt;
    if (postData.status === 'PUBLISHED' && !existing.publishedAt) {
      publishedAt = new Date();
    }

    let readingTime = existing.readingTime;
    if (postData.content) {
      const wordCount = postData.content.trim().split(/\s+/).length;
      readingTime = Math.max(1, Math.ceil(wordCount / 200));
    }

    await prisma.blogPost.update({
      where: { id },
      data: {
        ...postData,
        readingTime: data.readingTime || readingTime,
        categoryId: categoryId === '' ? null : categoryId,
        publishedAt,
      },
    });

    if (tags !== undefined) {
      await prisma.postTag.deleteMany({ where: { postId: id } });
      for (const tagName of tags) {
        const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        let tag = await prisma.tag.findFirst({ where: { slug } });
        if (!tag) {
          tag = await prisma.tag.create({ data: { name: tagName, slug } });
        }
        await prisma.postTag.create({
          data: { postId: id, tagId: tag.id },
        });
      }
    }

    return this.getPostBySlug(existing.slug, true, false);
  }

  static async deletePost(id: string) {
    return prisma.blogPost.delete({ where: { id } });
  }

  static async getCategories() {
    return prisma.blogCategory.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { posts: { where: { status: 'PUBLISHED' } } },
        },
      },
    });
  }

  static async createCategory(name: string, description?: string) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    return prisma.blogCategory.create({
      data: { name, slug, description },
    });
  }

  static async deleteCategory(id: string) {
    return prisma.blogCategory.delete({ where: { id } });
  }

  static async getTags() {
    return prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { posts: { where: { post: { status: 'PUBLISHED' } } } },
        },
      },
    });
  }
}
