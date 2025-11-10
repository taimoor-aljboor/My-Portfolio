'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactFormValues } from '@/lib/validations/contact';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

export function ContactForm() {
  const t = useTranslations('contact.form');
  const locale = useLocale();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      locale,
      honeypot: '',
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setStatus('idle');

    if (values.honeypot) {
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, locale }),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      form.reset({
        name: '',
        email: '',
        phone: '',
        message: '',
        locale,
        honeypot: '',
      });
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('name')}</FormLabel>
              <FormControl>
                <Input placeholder={t('name')} {...field} />
              </FormControl>
              {form.formState.errors.name?.message ? (
                <p className="text-sm font-medium text-destructive">
                  {t(`validations.${form.formState.errors.name.message}`)}
                </p>
              ) : null}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('email')}</FormLabel>
              <FormControl>
                <Input type="email" placeholder={t('email')} {...field} />
              </FormControl>
              {form.formState.errors.email?.message ? (
                <p className="text-sm font-medium text-destructive">
                  {t(`validations.${form.formState.errors.email.message}`)}
                </p>
              ) : null}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('phone')}</FormLabel>
              <FormControl>
                <Input placeholder={t('phone')} {...field} />
              </FormControl>
              {form.formState.errors.phone?.message ? (
                <p className="text-sm font-medium text-destructive">
                  {t(`validations.${form.formState.errors.phone.message}`)}
                </p>
              ) : null}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('message')}</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  rows={5}
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder={t('message')}
                />
              </FormControl>
              {form.formState.errors.message?.message ? (
                <p className="text-sm font-medium text-destructive">
                  {t(`validations.${form.formState.errors.message.message}`)}
                </p>
              ) : null}
            </FormItem>
          )}
        />

        <input type="text" className="hidden" tabIndex={-1} autoComplete="off" {...form.register('honeypot')} />

        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full sm:w-auto">
          {form.formState.isSubmitting ? t('submitting') : t('submit')}
        </Button>

        {status === 'success' ? (
          <p className="text-sm text-green-600">{t('success')}</p>
        ) : null}
        {status === 'error' ? (
          <p className="text-sm text-destructive">{t('error')}</p>
        ) : null}
      </form>
    </Form>
  );
}
