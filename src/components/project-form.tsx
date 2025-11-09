'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, type ProjectFormValues } from '@/lib/validations/project';
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

interface ProjectFormProps {
  initialData?: Partial<ProjectFormValues>;
  onSubmit: (data: ProjectFormValues) => Promise<void>;
}

export function ProjectForm({ initialData, onSubmit }: ProjectFormProps) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      titleEn: initialData?.titleEn || '',
      titleAr: initialData?.titleAr || '',
      descriptionEn: initialData?.descriptionEn || '',
      descriptionAr: initialData?.descriptionAr || '',
      url: initialData?.url || '',
      repoUrl: initialData?.repoUrl || '',
      techs: initialData?.techs || [],
      featured: initialData?.featured || false,
      imageUrl: initialData?.imageUrl || '',
    },
  });

  async function handleSubmit(data: ProjectFormValues) {
    await onSubmit(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="titleEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title (EN)</FormLabel>
                <FormControl>
                  <Input placeholder="Project title in English" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="titleAr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title (AR)</FormLabel>
                <FormControl>
                  <Input placeholder="عنوان المشروع" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="descriptionEn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (EN)</FormLabel>
              <FormControl>
                  <textarea
                    placeholder="Short description"
                    className="w-full rounded-md border px-3 py-2"
                    {...field}
                  />
                </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descriptionAr"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (AR)</FormLabel>
              <FormControl>
                <textarea
                  placeholder="وصف قصير"
                  className="w-full rounded-md border px-3 py-2"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Live URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="repoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repository URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/user/repo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">Save Project</Button>
        </div>
      </form>
    </Form>
  );
}
