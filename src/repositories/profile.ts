import { addAuditInfo, createAuditLog, handleDatabaseError } from '@/lib/db-utils';
import { Profile } from '@prisma/client';
import prisma from '@/lib/db';

export type ProfileData = Omit<Profile, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>;
export type ProfileUpdate = Partial<ProfileData>;

export const profileRepository = {
  /**
   * Get the single profile instance
   */
  async getProfile(): Promise<Profile | null> {
    try {
      return await prisma.profile.findFirst();
    } catch (error) {
      throw handleDatabaseError(error, 'Failed to retrieve profile');
    }
  },

  /**
   * Create or update the profile
   */
  async upsertProfile(data: ProfileData, userId?: string): Promise<Profile> {
    try {
      const existingProfile = await this.getProfile();
      const auditedData = addAuditInfo(data, userId, !existingProfile);

      const profile = await prisma.profile.upsert({
        where: {
          id: existingProfile?.id || 'singleton',
        },
        create: {
          id: 'singleton',
          ...auditedData,
        },
        update: auditedData,
      });

      // Create audit log
      await createAuditLog({
        userId: userId || 'system',
        action: existingProfile ? 'UPDATE' : 'CREATE',
        entityType: 'Profile',
        entityId: profile.id,
        oldValues: existingProfile || undefined,
        newValues: profile,
      });

      return profile;
    } catch (error) {
      throw handleDatabaseError(error, 'Failed to update profile');
    }
  },

  /**
   * Update specific profile fields
   */
  async updateProfile(data: ProfileUpdate, userId?: string): Promise<Profile> {
    try {
      const existingProfile = await this.getProfile();
      if (!existingProfile) {
        throw new Error('Profile not found');
      }

      const auditedData = addAuditInfo(data, userId, false);
      const profile = await prisma.profile.update({
        where: { id: existingProfile.id },
        data: auditedData,
      });

      // Create audit log
      await createAuditLog({
        userId: userId || 'system',
        action: 'UPDATE',
        entityType: 'Profile',
        entityId: profile.id,
        oldValues: existingProfile,
        newValues: profile,
      });

      return profile;
    } catch (error) {
      throw handleDatabaseError(error, 'Failed to update profile');
    }
  },
};