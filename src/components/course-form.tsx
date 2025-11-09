'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseSchema, type CourseFormValues } from '@/lib/validations/course';
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
// using native textarea rather than a ui/textarea wrapper

interface CourseFormProps {
  initialData?: Partial<CourseFormValues>;
  onSubmit: (data: any) => Promise<void>;
}

export function CourseForm({ initialData, onSubmit }: CourseFormProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [certificateUrl, setCertificateUrl] = React.useState<string | null>(initialData?.certificateUrl || null);

  // Use a loose form type to avoid RHF/zod Date typing conflicts; we'll convert the date on submit
  const form = useForm<any>({
    resolver: zodResolver(courseSchema as any),
    defaultValues: {
      titleEn: initialData?.titleEn || '',
      titleAr: initialData?.titleAr || '',
      providerEn: initialData?.providerEn || '',
      providerAr: initialData?.providerAr || '',
      issuedOn: initialData?.issuedOn ? new Date(initialData.issuedOn).toISOString().slice(0, 10) : '',
      certificateUrl: initialData?.certificateUrl || '',
      notesEn: initialData?.notesEn || '',
      notesAr: initialData?.notesAr || '',
      displayOrder: initialData?.displayOrder || 0,
    },
  });

  async function handleFileUpload(file: File) {
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('ownerType', 'course');
      fd.append('ownerId', 'temp');

      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: fd,
      });
      if (!res.ok) throw new Error('Upload failed');
      const json = await res.json();
      setCertificateUrl(json.url);
      form.setValue('certificateUrl', json.url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  }

  async function submit(values: any) {
    // convert issuedOn string (from date input) into a Date object for the backend
    const issuedOnDate = values.issuedOn ? new Date(values.issuedOn) : undefined;
    await onSubmit({ ...values, issuedOn: issuedOnDate, certificateUrl: certificateUrl || values.certificateUrl || '' });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="titleEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title (EN)</FormLabel>
                <FormControl>
                  <Input placeholder="Course title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="providerEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provider (EN)</FormLabel>
                <FormControl>
                  <Input placeholder="Provider name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="issuedOn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issued On</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Certificate</FormLabel>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileUpload(f);
              }}
            />
            {isUploading && <span>Uploading...</span>}
            {certificateUrl && (
              <a href={certificateUrl} target="_blank" rel="noreferrer" className="text-sm text-primary">View</a>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isUploading}>Save Course</Button>
        </div>
      </form>
    </Form>
  );
}
