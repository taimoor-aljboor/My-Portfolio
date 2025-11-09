'use client';

import * as React from 'react';
import { useForm, type FieldValues, type Control, type ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';

type FieldProps = {
  field: ControllerRenderProps<ProfileFormValues, any>;
};

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RichTextEditor } from '@/components/rich-text-editor';
import { profileFormSchema, type ProfileFormValues } from '@/lib/validations/profile';

interface ProfileFormProps {
  profile?: ProfileFormValues;
  onSubmit: (data: ProfileFormValues) => Promise<void>;
}

export function ProfileForm({ profile, onSubmit }: ProfileFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const t = useTranslations();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullNameEn: profile?.fullNameEn || '',
      fullNameAr: profile?.fullNameAr || '',
      headlineEn: profile?.headlineEn || '',
      headlineAr: profile?.headlineAr || '',
      bioEn: profile?.bioEn || '',
      bioAr: profile?.bioAr || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      locationEn: profile?.locationEn || '',
      locationAr: profile?.locationAr || '',
      avatarUrl: profile?.avatarUrl || '',
      cvPdfUrl: profile?.cvPdfUrl || '',
      socialLinks: profile?.socialLinks || {
        linkedin: '',
        github: '',
        twitter: '',
        whatsapp: '',
        instagram: '',
        youtube: '',
        facebook: '',
        other: [],
      },
    },
  });

  async function handleSubmit(data: ProfileFormValues) {
    try {
      setIsLoading(true);
      await onSubmit(data);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* English Content */}
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.profile.englishContent')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="fullNameEn"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>{t('admin.profile.fullName')}</FormLabel>
                    <FormControl>
                      <Input dir="ltr" placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="headlineEn"
                render={({ field }: FieldProps) => (
                  <FormItem>
                    <FormLabel>{t('admin.profile.headline')}</FormLabel>
                    <FormControl>
                      <Input
                        dir="ltr"
                        placeholder="Full Stack Developer & UI/UX Designer"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bioEn"
                render={({ field }: FieldProps) => (
                  <FormItem>
                    <FormLabel>{t('admin.profile.bio')}</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        content={field.value}
                        onChange={field.onChange}
                        dir="ltr"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="locationEn"
                render={({ field }: FieldProps) => (
                  <FormItem>
                    <FormLabel>{t('admin.profile.location')}</FormLabel>
                    <FormControl>
                      <Input
                        dir="ltr"
                        placeholder="Amman, Jordan"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Arabic Content */}
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.profile.arabicContent')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="fullNameAr"
                render={({ field }: FieldProps) => (
                  <FormItem>
                    <FormLabel>{t('admin.profile.fullName')}</FormLabel>
                    <FormControl>
                      <Input dir="rtl" placeholder="جون دو" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="headlineAr"
                render={({ field }: FieldProps) => (
                  <FormItem>
                    <FormLabel>{t('admin.profile.headline')}</FormLabel>
                    <FormControl>
                      <Input
                        dir="rtl"
                        placeholder="مطور ويب ومصمم واجهات المستخدم"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bioAr"
                render={({ field }: FieldProps) => (
                  <FormItem>
                    <FormLabel>{t('admin.profile.bio')}</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        content={field.value}
                        onChange={field.onChange}
                        dir="rtl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="locationAr"
                render={({ field }: FieldProps) => (
                  <FormItem>
                    <FormLabel>{t('admin.profile.location')}</FormLabel>
                    <FormControl>
                      <Input
                        dir="rtl"
                        placeholder="عمان، الأردن"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.profile.contactInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }: FieldProps) => (
                  <FormItem>
                    <FormLabel>{t('admin.profile.email')}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }: FieldProps) => (
                  <FormItem>
                    <FormLabel>{t('admin.profile.phone')}</FormLabel>
                    <FormControl>
                      <Input placeholder="+962 79 123 4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="avatarUrl"
                render={({ field }: FieldProps) => (
                  <FormItem>
                    <FormLabel>{t('admin.profile.avatarUrl')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/avatar.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cvPdfUrl"
                render={({ field }: FieldProps) => (
                  <FormItem>
                    <FormLabel>{t('admin.profile.cvPdfUrl')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/cv.pdf"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.profile.socialLinks')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="socialLinks.linkedin"
                render={({ field }: FieldProps) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://linkedin.com/in/username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="socialLinks.github"
                render={({ field }: FieldProps) => (
                  <FormItem>
                    <FormLabel>GitHub</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://github.com/username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="socialLinks.twitter"
                render={({ field }: FieldProps) => (
                  <FormItem>
                    <FormLabel>Twitter</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://twitter.com/username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="socialLinks.whatsapp"
                render={({ field }: FieldProps) => (
                  <FormItem>
                    <FormLabel>WhatsApp</FormLabel>
                    <FormControl>
                      <Input placeholder="+962791234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('common.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}