import { Prisma } from '@prisma/client';
import type { Settings } from '@prisma/client';
import prisma from '@/lib/db';
import { createAuditLog, handleDatabaseError } from '@/lib/db-utils';

export type SettingsData = Omit<
  Settings,
  'id' | 'createdAt' | 'updatedAt' | 'updatedBy'
>;

const SETTINGS_ID = 'singleton-settings';

export const settingsRepository = {
  async getSettings(): Promise<Settings | null> {
    try {
      return prisma.settings.findUnique({ where: { id: SETTINGS_ID } });
    } catch (error) {
      throw handleDatabaseError(error, 'Failed to load settings');
    }
  },

  async upsertSettings(data: SettingsData, userId?: string): Promise<Settings> {
    try {
      const existing = await prisma.settings.findUnique({ where: { id: SETTINGS_ID } });
      const now = new Date();
      const payload = {
        ...data,
        smtpSettings: data.smtpSettings ?? Prisma.JsonNull,
        updatedAt: now,
        updatedBy: userId,
      };

      const settings = await prisma.settings.upsert({
        where: { id: SETTINGS_ID },
        create: {
          id: SETTINGS_ID,
          ...payload,
        },
        update: payload,
      });

      await createAuditLog({
        userId: userId || 'system',
        action: existing ? 'UPDATE' : 'CREATE',
        entityType: 'Settings',
        entityId: settings.id,
        oldValues: existing || undefined,
        newValues: settings,
      });

      return settings;
    } catch (error) {
      throw handleDatabaseError(error, 'Failed to update settings');
    }
  },
};
