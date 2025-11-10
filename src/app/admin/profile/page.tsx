import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileForm } from '@/components/profile-form';
import { updateProfile } from '@/lib/actions/profile';
import { mapProfileToFormValues } from '@/lib/utils/profile';
import { profileRepository } from '@/repositories/profile';
import type { ProfileFormValues } from '@/lib/validations/profile';

export default async function AdminProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const profile = await profileRepository.getProfile();
  const initialValues = mapProfileToFormValues(profile);

  async function handleSubmit(data: ProfileFormValues) {
    'use server';

    await updateProfile(data);
  }

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Manage the information that powers your public portfolio profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={initialValues} onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
