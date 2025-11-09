'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientSchema, type ClientFormValues } from '@/lib/validations/client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// Using native textarea to avoid dependency on missing ui/textarea wrapper

interface ClientFormProps {
  initialData?: Partial<ClientFormValues>;
  onSubmit: (data: ClientFormValues) => Promise<void>;
}

export function ClientForm({ initialData, onSubmit }: ClientFormProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [logoUrl, setLogoUrl] = React.useState<string | null>(initialData?.logoUrl || null);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      nameEn: initialData?.nameEn || '',
      nameAr: initialData?.nameAr || '',
      logoUrl: initialData?.logoUrl || '',
      websiteUrl: initialData?.websiteUrl || '',
      testimonialEn: initialData?.testimonialEn || '',
      testimonialAr: initialData?.testimonialAr || '',
      displayOrder: initialData?.displayOrder || 0,
    },
  });

  async function handleFileUpload(file: File) {
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('ownerType', 'client');
      fd.append('ownerId', 'temp');

      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: fd,
      });
      if (!res.ok) throw new Error('Upload failed');
      const json = await res.json();
      setLogoUrl(json.url);
      form.setValue('logoUrl', json.url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  }

  async function submit(values: ClientFormValues) {
    await onSubmit({ ...values, logoUrl: logoUrl || values.logoUrl || '' });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="nameEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name (EN)</FormLabel>
                <FormControl>
                  <Input placeholder="Client name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nameAr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name (AR)</FormLabel>
                <FormControl>
                  <Input placeholder="اسم العميل" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="testimonialEn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Testimonial (EN)</FormLabel>
              <FormControl>
                <textarea
                  placeholder="Testimonial"
                  className="w-full rounded-md border px-3 py-2"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Logo</FormLabel>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileUpload(f);
              }}
            />
            {isUploading && <span>Uploading...</span>}
            {logoUrl && (
              <img src={logoUrl} alt="logo" className="h-12 w-12 object-cover" />
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isUploading}>
            Save Client
          </Button>
        </div>
      </form>
    </Form>
  );
}
