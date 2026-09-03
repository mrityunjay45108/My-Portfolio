import { PrismaClient } from '@prisma/client';

function getNormalizedDatabaseUrl(): string | undefined {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) return undefined;

  // Supabase direct connection host (db.<ref>.supabase.co) only resolves to IPv6.
  // Render and other IPv4-only cloud platforms fail with "Can't reach database server".
  // Auto-convert to Supabase's IPv4 Connection Pooler (Supavisor) on port 5432.
  const directMatch = rawUrl.match(/:\/\/([^:]+):([^@]+)@db\.([a-z0-9]+)\.supabase\.co(?::5432)?(\/[^?]*)?(\?.*)?/i);
  if (directMatch) {
    const [, user, pass, projectRef, dbPath, query] = directMatch;
    const region = projectRef === 'cmwruqnsfeehbamcekbp' ? 'ap-northeast-2' : 'ap-northeast-2';
    const poolerUser = user.includes('.') ? user : `${user}.${projectRef}`;
    const cleanDbPath = dbPath || '/postgres';
    const cleanQuery = query || '?sslmode=require';
    const poolerUrl = `postgresql://${poolerUser}:${pass}@aws-0-${region}.pooler.supabase.com:5432${cleanDbPath}${cleanQuery}`;
    console.log(`[Database] Auto-routing direct Supabase IPv6 host to IPv4 pooler (region: ${region}).`);
    process.env.DATABASE_URL = poolerUrl;
    return poolerUrl;
  }

  return rawUrl;
}

const dbUrl = getNormalizedDatabaseUrl();

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
