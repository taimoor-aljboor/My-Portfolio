# My Portfolio

Modern bilingual portfolio powered by Next.js 14 with an integrated admin dashboard. The public site supports English and Arabic with automatic RTL switching, dynamic SEO metadata, and a contact workflow backed by Prisma.

## Features

- **Bilingual site** – English and Arabic localisation via `next-intl`, including RTL-aware layouts.
- **Dynamic portfolio content** – Projects, achievements, education, courses, and clients rendered from Prisma models.
- **Contact form workflow** – Spam-protected form storing messages in Postgres with optional SMTP notifications and reCAPTCHA validation.
- **Media-aware theming** – Brand colours taken from admin settings and applied as CSS variables for light/dark themes.
- **SEO tooling** – Dynamic metadata per locale, structured data, sitemap generation, and robots directives.
- **Admin dashboard** – Manage portfolio content, media, and site settings with NextAuth-protected routes.

## Getting started

1. Install dependencies (includes Prisma client generation):

   ```bash
   npm install
   ```

2. Create a `.env` file with your database URL and optional SMTP configuration. Example variables:

   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/portfolio"
   NEXTAUTH_SECRET="replace-with-strong-secret"
   NEXT_PUBLIC_APP_URL="https://example.com"
   SMTP_HOST="smtp.mailprovider.com"
   SMTP_PORT="465"
   SMTP_USER="no-reply@example.com"
   SMTP_PASS="app-specific-password"
   ```

3. Apply database migrations and seed initial content:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   The site is available at `http://localhost:3000/en` and `http://localhost:3000/ar`.

## Testing and quality

- Run ESLint checks: `npm run lint`
- Type-check the project: `npm run type-check`
- Execute unit tests (Vitest): `npm run test`

CI should execute the same commands to guarantee schema and localisation integrity.

## Contact form configuration

- **SMTP**: Provide `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASS` or configure SMTP settings through the admin UI. Without valid credentials email notifications are skipped gracefully.
- **reCAPTCHA**: Store site and secret keys in the `Settings` record to enable verification for public submissions.

## Deployment notes

- Expose `NEXT_PUBLIC_APP_URL` so sitemap/robots use the correct canonical host.
- Ensure `images` domains allow any remote avatar or media host you configure.
- Run `npm run build` followed by `npm run start` on production infrastructure.

For additional customisation (colours, metadata defaults, etc.) manage the values from the admin dashboard's settings section.
