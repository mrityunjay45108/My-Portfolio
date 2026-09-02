# Mrityunjay Kumar — Full Stack & AI Engineering Portfolio Platform

> A production-grade Personal Brand, Engineering Showcase, Technical Blog, Case Study CMS, and **GitHub Developer Activity Platform** built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, **Node.js**, **Express**, **PostgreSQL (Supabase)**, and **Prisma ORM**.

---

## 🌟 Key Highlights

- **Connected to Supabase PostgreSQL**: Fully configured and synced with live Supabase database.
- **GitHub Developer Activity Platform (`/github`)**:
  - Real-time profile statistics (Repos, Total Stars, Followers, Following, Bio).
  - Responsive 52-week contribution calendar heatmap with streak and daily activity telemetry.
  - Multi-color dynamic language breakdown bar with exact byte-level percentages.
  - Public repository catalog with multi-category filtering (*All, AI, Full Stack, Backend, Frontend, DevOps, Other*) and live search.
  - Real-time public GitHub activity feed with commit messages and release tags.
- **Project ↔ GitHub Association**: Link portfolio projects to their GitHub repositories for automatic bidirectional discovery.
- **Admin GitHub Manager (`/admin/github`)**: Live GitHub sync, featured repository selector, custom description editor, and project relation manager.
- **Recruiter & Client Ready**: Clean, modern dark aesthetic with high contrast, responsive typography, subtle animations, and zero clutter.
- **Dynamic Full-Stack CMS**: Admin console with complete CRUD for Projects, Blog Articles, Engineering Case Studies, Technologies, GitHub Repos, and Contact Messages.
- **Rich Media & Lightbox**: Interactive screenshot gallery with modal lightbox, responsive video player (supporting YouTube, Vimeo, MP4), and architecture diagrams.
- **Engineering Deep-Dives**: Dedicated Case Studies section detailing technical problem statements, architecture blueprints, concurrency challenges, and benchmark results.
- **Publication-Ready Blog**: Markdown editor with Prism code syntax highlighting, reading time calculator, reading progress bar, category & tag filters, and SEO tags.
- **Offline & Fallback Resilient**: Frontend includes seamless offline fallback data—if the backend or GitHub API is starting, public visitors always see a rich, fully populated experience.
- **Enterprise Security**: Bcrypt password hashing (12 rounds), JWT tokens via HTTP-only secure cookies / Bearer headers, Helmet security headers, rate limiting, and input sanitization.

---

## 📁 Repository Structure

```text
├── client/                     # React 19 + TypeScript + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── github/         # ContributionGraph, RepoCard, LanguageBreakdown, ActivityTimeline
│   │   │   ├── layout/         # Navbar, Footer, AdminLayout
│   │   │   ├── portfolio/      # Hero, About, Skills, FeaturedProjects, ProjectsGrid, GitHubTeaser, Experience, Education, Achievements, Services, Contact, Lightbox
│   │   │   └── ui/             # Button, Badge, Input, Textarea, Select, Modal, VideoPlayer, MarkdownRenderer, Icons
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── data/               # Centralized typed data schemas & offline fallbacks (projects, blogs, case studies, github)
│   │   ├── pages/
│   │   │   ├── HomePage.tsx            # Public portfolio homepage with GitHub teaser
│   │   │   ├── ProjectDetailsPage.tsx  # In-depth project showcase
│   │   │   ├── GitHubPage.tsx          # Full developer activity dashboard
│   │   │   ├── BlogListPage.tsx        # Blog catalog with search & tag filters
│   │   │   ├── BlogDetailPage.tsx      # Rich article reader with code highlighting
│   │   │   ├── CaseStudiesListPage.tsx # Case studies catalog
│   │   │   ├── CaseStudyDetailPage.tsx # Comprehensive system case study
│   │   │   ├── NotFoundPage.tsx        # 404 page
│   │   │   └── admin/                  # Admin Dashboard, Projects, GitHub, Blog, Case Studies, Tech, Messages, Analytics
│   │   ├── services/           # Typed API client with token & credentials handling
│   │   └── types/              # Full TypeScript interface definitions
│   └── package.json
│
├── server/                     # Node.js + Express + TypeScript + Prisma ORM Backend
│   ├── prisma/
│   │   ├── schema.prisma       # PostgreSQL models (Users, Projects, GitHubRepos, Blogs, Case Studies, Tech, Contact, Analytics)
│   │   └── seed.ts             # Complete database seed script
│   ├── src/
│   │   ├── config/             # Config loader & environment variables
│   │   ├── controllers/        # Express route controllers (Auth, Project, GitHub, Blog, CaseStudy, AdminGitHub, Contact, Analytics)
│   │   ├── database/           # Prisma client singleton
│   │   ├── middleware/         # Auth, rate limiting, file upload, request validator, error handler
│   │   ├── routes/             # REST API routes
│   │   ├── services/           # Business logic service layers (githubService.ts, authService.ts, projectService.ts, etc.)
│   │   ├── validators/         # Zod request validation schemas
│   │   └── index.ts            # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── .env.example                # Root environment sample
├── package.json                # Unified workspace orchestrator
└── README.md
```

---

## 🗄️ Database Schema Overview (Prisma Supabase PostgreSQL)

1. **User (Admin)**: `id`, `name`, `email` (unique), `passwordHash`, `role` (ADMIN, USER), `createdAt`, `updatedAt`
2. **Project**: `id`, `title`, `slug` (unique), `shortDescription`, `description`, `category`, `featured`, `published`, `githubUrl`, `githubOwner`, `githubRepository`, `liveUrl`, `architectureImage`, `architectureDescription`, `videoUrl`, `order`, `viewCount`, `createdAt`, `updatedAt`
3. **GitHubRepository**: `id`, `owner`, `name`, `fullName` (unique), `description`, `url`, `language`, `stars`, `forks`, `topics`, `featured`, `displayOrder`, `customDescription`, `projectId` (relation to Project), `lastSyncedAt`, `createdAt`, `updatedAt`
4. **ProjectImage**: `id`, `projectId`, `url`, `altText`, `order`, `createdAt`
5. **ProjectFeature**: `id`, `projectId`, `title`, `description`, `order`
6. **Technology**: `id`, `name`, `icon`, `category` (Languages, Frontend, Backend, Databases, DevOps & Cloud, AI & GenAI)
7. **BlogPost**: `id`, `title`, `slug` (unique), `excerpt`, `content`, `featuredImage`, `authorId`, `status` (DRAFT, PUBLISHED, ARCHIVED), `categoryId`, `readingTime`, `viewCount`, `publishedAt`, `createdAt`, `updatedAt`
8. **BlogCategory & Tag**: Categorization & tag taxonomy
9. **CaseStudy & CaseStudySection**: Architecture case study deep-dives with telemetry diagrams
10. **ContactMessage**: `id`, `name`, `email`, `subject`, `message`, `isRead`, `createdAt`
11. **VisitorAnalytics**: Anonymous telemetry (`path`, `type`, `resourceId`, `ipHash`, `referrer`, `createdAt`)

---

## 🚀 API Endpoints

### GitHub & Developer Activity
- `GET /api/github/profile` — Public profile details with total stars and repo metrics (cached)
- `GET /api/github/repositories` — Public repository list with categories & database relations
- `GET /api/github/repositories/:owner/:repo` — Specific repository details
- `GET /api/github/languages` — Byte-accurate language distribution percentages
- `GET /api/github/activity` — Recent public event feed (commits, PRs, releases, issues)
- `GET /api/github/contributions` — 52-week contribution heatmap matrix
- `GET /api/admin/github/featured` — *[Admin]* List all featured repositories with project relations
- `POST /api/admin/github/featured` — *[Admin]* Add/feature a repository
- `PUT /api/admin/github/featured/:id` — *[Admin]* Update custom description, display order, project link
- `DELETE /api/admin/github/featured/:id` — *[Admin]* Unfeature/delete repository
- `POST /api/admin/github/sync` — *[Admin]* Trigger live synchronization with GitHub API

### Authentication
- `POST /api/auth/login` — Rate-limited admin login (returns HTTP-only cookie + JWT)
- `POST /api/auth/logout` — Clears authentication cookie
- `GET /api/auth/me` — Returns current authenticated user

### Projects, Blog & Case Studies
- `GET /api/projects` — Public project list
- `GET /api/projects/:slugOrId` — Project details with features and architecture
- `GET /api/blog` — Public articles (filters: `page`, `limit`, `category`, `tag`, `search`)
- `GET /api/blog/:slug` — Article details with markdown, reading time, author, and related posts
- `GET /api/case-studies` — List published case studies
- `GET /api/case-studies/:slug` — Full case study breakdown

---

## ⚙️ Environment Variables

### Root / Backend (`server/.env`):
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Supabase PostgreSQL Connection String
DATABASE_URL="postgresql://postgres:Kumar%40456321123444@db.cmwruqnsfeehbamcekbp.supabase.co:5432/postgres"

# Authentication
JWT_SECRET="mrityunjay-super-secure-jwt-key-2026-production-min-32-chars-long"
JWT_EXPIRES_IN="7d"

# Initial Seed Credentials
INITIAL_ADMIN_EMAIL="admin@mrityunjay.dev"
INITIAL_ADMIN_PASSWORD="AdminSecurePassword123!"
INITIAL_ADMIN_NAME="Mrityunjay Kumar"

# GitHub Integration
GITHUB_USERNAME="mrityunjay45108"
GITHUB_TOKEN=""
GITHUB_API_URL="https://api.github.com"
```

---

## 🏃 Running the Application

### 1. Unified Development Mode (Runs Frontend & Backend Concurrently)
```bash
npm run dev
```
- Frontend starts on `http://localhost:5173`
- Backend starts on `http://localhost:5000`

### 2. Database Migration & Seeding
```bash
# Push schema to Supabase
npm run prisma:push

# Seed admin user, projects, blogs, case studies, technologies & GitHub repos
npm run seed
```

### 3. Default Admin Credentials
- **URL**: `http://localhost:5173/admin/login`
- **Email**: `admin@mrityunjay.dev`
- **Password**: `AdminSecurePassword123!`
