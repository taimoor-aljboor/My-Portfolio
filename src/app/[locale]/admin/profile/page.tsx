import { AdminLayout } from '@/components/layouts/admin-layout';
import { ProfileForm } from '@/components/profile-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getTranslations } from 'next-intl/server';
import prisma from '@/lib/db';
import { updateProfile } from '@/lib/actions/profile';
import { mapProfileToFormValues } from '@/lib/utils/profile';

export async function generateMetadata() {
  const t = await getTranslations('seo');

  return {
    title: t('admin.profile'),
  };
}

export default async function AdminProfilePage() {
  // Get existing profile data
  const profile = await prisma.profile.findFirst();
  const profileData = mapProfileToFormValues(profile);

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Manage your profile information, which will be displayed on your portfolio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm 
            profile={profileData}
            onSubmit={async (data) => {
              'use server';
              await updateProfile(data);
            }}
          />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}