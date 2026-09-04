import prisma from '../database/prisma.js';

export const DEFAULT_RESUME_URL =
  'https://res.cloudinary.com/dpd6q8ex4/image/upload/v1788340801/Mrityunjay_kumar_resume0._ydptl9.pdf';

let tableEnsured = false;

export class SettingsService {
  private static async ensureTable() {
    if (tableEnsured) return;
    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS portfolio_settings (
          key VARCHAR(100) PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      tableEnsured = true;
    } catch (err) {
      console.warn('[SettingsService] Could not ensure portfolio_settings table:', err);
    }
  }

  static async getResumeUrl(): Promise<string> {
    await this.ensureTable();
    try {
      const setting = await prisma.portfolioSetting.findUnique({
        where: { key: 'resume_url' },
      });

      if (setting?.value && setting.value.trim().length > 0) {
        return setting.value.trim();
      }
    } catch (err) {
      console.warn('[SettingsService] Error reading resume_url, falling back to default:', err);
    }

    return DEFAULT_RESUME_URL;
  }

  static async updateResumeUrl(rawUrl: string): Promise<string> {
    await this.ensureTable();

    if (!rawUrl || typeof rawUrl !== 'string') {
      throw new Error('Resume URL is required.');
    }

    const trimmed = rawUrl.trim();

    // Basic URL validation
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      throw new Error('Invalid URL format. URL must start with http:// or https://');
    }

    try {
      new URL(trimmed);
    } catch {
      throw new Error('Invalid URL syntax.');
    }

    try {
      await prisma.portfolioSetting.upsert({
        where: { key: 'resume_url' },
        create: {
          key: 'resume_url',
          value: trimmed,
        },
        update: {
          value: trimmed,
        },
      });
      return trimmed;
    } catch (prismaErr) {
      console.warn('[SettingsService] Prisma upsert failed, attempting fallback raw upsert:', prismaErr);
      // Raw SQL fallback upsert with escaped string
      const escaped = trimmed.replace(/'/g, "''");
      await prisma.$executeRawUnsafe(`
        INSERT INTO portfolio_settings (key, value, updated_at)
        VALUES ('resume_url', '${escaped}', CURRENT_TIMESTAMP)
        ON CONFLICT (key) DO UPDATE
        SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP;
      `);
      return trimmed;
    }
  }

  static async getAllSettings(): Promise<Record<string, string>> {
    await this.ensureTable();
    try {
      const settings = await prisma.portfolioSetting.findMany();
      const map: Record<string, string> = {
        resume_url: DEFAULT_RESUME_URL,
      };
      settings.forEach((s) => {
        map[s.key] = s.value;
      });
      return map;
    } catch (err) {
      console.warn('[SettingsService] Failed to load all settings:', err);
      return {
        resume_url: DEFAULT_RESUME_URL,
      };
    }
  }
}
