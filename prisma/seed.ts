import { PrismaClient, ProjectStatus } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@example.com';
  const defaultPassword = 'admin123456';
  const hashedPassword = await hash(defaultPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      loginAttempts: 0,
      lockedUntil: null,
      twoFactorEnabled: false,
      twoFactorSecret: null,
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      loginAttempts: 0,
      twoFactorEnabled: false,
    },
  });

  const profile = await prisma.profile.upsert({
    where: { email: 'hello@example.com' },
    update: {
      fullNameEn: 'John Doe',
      fullNameAr: 'جون دو',
      headlineEn: 'Full-Stack Developer & Consultant',
      headlineAr: 'مطور برمجيات متكامل ومستشار',
      bioEn:
        'I design and build modern web applications with a focus on performance, accessibility, and delightful user experiences.',
      bioAr:
        'أقوم بتصميم وبناء تطبيقات ويب حديثة مع التركيز على الأداء وسهولة الاستخدام وتجربة المستخدم الممتعة.',
      phone: '+1 (555) 123-4567',
      locationEn: 'Remote · Worldwide',
      locationAr: 'عن بعد · حول العالم',
      avatarUrl: 'https://avatars.githubusercontent.com/u/000000?v=4',
      cvPdfUrl: null,
      socialLinks: [
        { label: 'LinkedIn', url: 'https://linkedin.com/in/johndoe' },
        { label: 'GitHub', url: 'https://github.com/johndoe' },
        { label: 'YouTube', url: 'https://youtube.com/@johndoe' },
      ],
      updatedBy: adminEmail,
    },
    create: {
      fullNameEn: 'John Doe',
      fullNameAr: 'جون دو',
      headlineEn: 'Full-Stack Developer & Consultant',
      headlineAr: 'مطور برمجيات متكامل ومستشار',
      bioEn:
        'I design and build modern web applications with a focus on performance, accessibility, and delightful user experiences.',
      bioAr:
        'أقوم بتصميم وبناء تطبيقات ويب حديثة مع التركيز على الأداء وسهولة الاستخدام وتجربة المستخدم الممتعة.',
      email: 'hello@example.com',
      phone: '+1 (555) 123-4567',
      locationEn: 'Remote · Worldwide',
      locationAr: 'عن بعد · حول العالم',
      avatarUrl: 'https://avatars.githubusercontent.com/u/000000?v=4',
      cvPdfUrl: null,
      socialLinks: [
        { label: 'LinkedIn', url: 'https://linkedin.com/in/johndoe' },
        { label: 'GitHub', url: 'https://github.com/johndoe' },
        { label: 'YouTube', url: 'https://youtube.com/@johndoe' },
      ],
      createdBy: adminEmail,
      updatedBy: adminEmail,
    },
  });

  const settings = await prisma.settings.upsert({
    where: { id: 'default-settings' },
    update: {
      siteNameEn: 'John Doe Portfolio',
      siteNameAr: 'ملف جون دو',
      siteDescriptionEn: 'A modern portfolio showcasing full-stack craftsmanship.',
      siteDescriptionAr: 'ملف أعمال حديث يستعرض خبرة التطوير المتكاملة.',
      primaryColor: '#0ea5e9',
      accentColor: '#6366f1',
      defaultLanguage: 'en',
      seoMetaTitleEn: 'John Doe · Full-Stack Developer',
      seoMetaTitleAr: 'جون دو · مطور برمجيات',
      seoMetaDescriptionEn: 'Portfolio, case studies, and ways to work together.',
      seoMetaDescriptionAr: 'نماذج أعمال ودراسات حالة وطرق للتعاون.',
      googleAnalyticsId: 'G-XXXXXXX',
      emailRecipients: [adminEmail],
      smtpSettings: null,
      recaptchaSiteKey: null,
      recaptchaSecretKey: null,
      maintenanceMode: false,
      updatedBy: adminEmail,
    },
    create: {
      id: 'default-settings',
      siteNameEn: 'John Doe Portfolio',
      siteNameAr: 'ملف جون دو',
      siteDescriptionEn: 'A modern portfolio showcasing full-stack craftsmanship.',
      siteDescriptionAr: 'ملف أعمال حديث يستعرض خبرة التطوير المتكاملة.',
      primaryColor: '#0ea5e9',
      accentColor: '#6366f1',
      defaultLanguage: 'en',
      seoMetaTitleEn: 'John Doe · Full-Stack Developer',
      seoMetaTitleAr: 'جون دو · مطور برمجيات',
      seoMetaDescriptionEn: 'Portfolio, case studies, and ways to work together.',
      seoMetaDescriptionAr: 'نماذج أعمال ودراسات حالة وطرق للتعاون.',
      googleAnalyticsId: 'G-XXXXXXX',
      emailRecipients: [adminEmail],
      smtpSettings: null,
      recaptchaSiteKey: null,
      recaptchaSecretKey: null,
      maintenanceMode: false,
      updatedBy: adminEmail,
    },
  });

  const category = await prisma.projectCategory.upsert({
    where: { id: 'category-web-apps' },
    update: {
      nameEn: 'Web Applications',
      nameAr: 'تطبيقات الويب',
      slugEn: 'web-applications',
      slugAr: 'web-applications-ar',
      displayOrder: 1,
    },
    create: {
      id: 'category-web-apps',
      nameEn: 'Web Applications',
      nameAr: 'تطبيقات الويب',
      slugEn: 'web-applications',
      slugAr: 'web-applications-ar',
      displayOrder: 1,
    },
  });

  const clients = await Promise.all([
    prisma.client.upsert({
      where: { id: 'client-acme' },
      update: {
        nameEn: 'Acme Corporation',
        nameAr: 'شركة أكمي',
        logoUrl: 'https://dummyimage.com/120x120/0ea5e9/ffffff&text=A',
        websiteUrl: 'https://acme.example.com',
        testimonialEn:
          'Working with John unlocked new growth opportunities for our business.',
        testimonialAr: 'العمل مع جون فتح لنا فرص نمو جديدة لأعمالنا.',
        displayOrder: 1,
        updatedBy: adminEmail,
      },
      create: {
        id: 'client-acme',
        nameEn: 'Acme Corporation',
        nameAr: 'شركة أكمي',
        logoUrl: 'https://dummyimage.com/120x120/0ea5e9/ffffff&text=A',
        websiteUrl: 'https://acme.example.com',
        testimonialEn:
          'Working with John unlocked new growth opportunities for our business.',
        testimonialAr: 'العمل مع جون فتح لنا فرص نمو جديدة لأعمالنا.',
        displayOrder: 1,
        createdBy: adminEmail,
        updatedBy: adminEmail,
      },
    }),
    prisma.client.upsert({
      where: { id: 'client-zenith' },
      update: {
        nameEn: 'Zenith Studios',
        nameAr: 'استوديو زينيث',
        logoUrl: 'https://dummyimage.com/120x120/6366f1/ffffff&text=Z',
        websiteUrl: 'https://zenith.example.com',
        testimonialEn: 'A reliable partner who delivers on time every time.',
        testimonialAr: 'شريك موثوق يلتزم بالمواعيد في كل مرة.',
        displayOrder: 2,
        updatedBy: adminEmail,
      },
      create: {
        id: 'client-zenith',
        nameEn: 'Zenith Studios',
        nameAr: 'استوديو زينيث',
        logoUrl: 'https://dummyimage.com/120x120/6366f1/ffffff&text=Z',
        websiteUrl: 'https://zenith.example.com',
        testimonialEn: 'A reliable partner who delivers on time every time.',
        testimonialAr: 'شريك موثوق يلتزم بالمواعيد في كل مرة.',
        displayOrder: 2,
        createdBy: adminEmail,
        updatedBy: adminEmail,
      },
    }),
  ]);

  const project = await prisma.project.upsert({
    where: { id: 'project-portfolio-showcase' },
    update: {
      titleEn: 'Modern Portfolio Experience',
      titleAr: 'تجربة ملف أعمال حديثة',
      shortDescEn: 'A multilingual, CMS-driven portfolio platform.',
      shortDescAr: 'منصة ملف أعمال متعددة اللغات مدعومة بنظام إدارة المحتوى.',
      longDescEn:
        'Built with Next.js, Prisma, and a headless CMS to power a seamless editorial experience.',
      longDescAr:
        'تم البناء باستخدام Next.js و Prisma ونظام إدارة محتوى لتوفير تجربة تحرير سلسة.',
      slugEn: 'modern-portfolio',
      slugAr: 'modern-portfolio-ar',
      techStack: ['Next.js', 'TypeScript', 'Prisma', 'Tailwind CSS'],
      demoUrl: 'https://portfolio.example.com',
      repoUrl: 'https://github.com/example/portfolio',
      caseStudyUrl: 'https://example.com/case-studies/portfolio',
      status: ProjectStatus.PUBLISHED,
      featured: true,
      displayOrder: 1,
      dateFrom: new Date('2024-01-01'),
      dateTo: new Date('2024-04-01'),
      categoryId: category.id,
      updatedBy: adminEmail,
    },
    create: {
      id: 'project-portfolio-showcase',
      titleEn: 'Modern Portfolio Experience',
      titleAr: 'تجربة ملف أعمال حديثة',
      shortDescEn: 'A multilingual, CMS-driven portfolio platform.',
      shortDescAr: 'منصة ملف أعمال متعددة اللغات مدعومة بنظام إدارة المحتوى.',
      longDescEn:
        'Built with Next.js, Prisma, and a headless CMS to power a seamless editorial experience.',
      longDescAr:
        'تم البناء باستخدام Next.js و Prisma ونظام إدارة محتوى لتوفير تجربة تحرير سلسة.',
      slugEn: 'modern-portfolio',
      slugAr: 'modern-portfolio-ar',
      techStack: ['Next.js', 'TypeScript', 'Prisma', 'Tailwind CSS'],
      demoUrl: 'https://portfolio.example.com',
      repoUrl: 'https://github.com/example/portfolio',
      caseStudyUrl: 'https://example.com/case-studies/portfolio',
      status: ProjectStatus.PUBLISHED,
      featured: true,
      displayOrder: 1,
      dateFrom: new Date('2024-01-01'),
      dateTo: new Date('2024-04-01'),
      categoryId: category.id,
      createdBy: adminEmail,
      updatedBy: adminEmail,
    },
    include: {
      projectClients: true,
    },
  });

  await prisma.projectClient.deleteMany({ where: { projectId: project.id } });
  await Promise.all(
    clients.map((client) =>
      prisma.projectClient.create({
        data: {
          projectId: project.id,
          clientId: client.id,
        },
      })
    )
  );

  await prisma.mediaAsset.deleteMany({ where: { projectId: project.id } });
  await prisma.mediaAsset.create({
    data: {
      projectId: project.id,
      url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
      type: 'image',
      altTextEn: 'Preview of the modern portfolio experience',
      altTextAr: 'معاينة لتجربة ملف الأعمال الحديثة',
      displayOrder: 0,
      width: 1600,
      height: 900,
      bytes: 245678,
      contentType: 'image/jpeg',
      filename: 'portfolio-preview.jpg',
    },
  });

  await prisma.course.upsert({
    where: { id: 'course-advanced-nextjs' },
    update: {
      titleEn: 'Advanced Next.js Patterns',
      titleAr: 'أنماط متقدمة في Next.js',
      providerEn: 'Frontend Masters',
      providerAr: 'فرونت إند ماسترز',
      issuedOn: new Date('2023-06-01'),
      certificateUrl: 'https://example.com/certificates/nextjs.pdf',
      notesEn: 'Deep dive into server components and edge rendering.',
      notesAr: 'تعمق في مكونات الخادم والتصيير على الحافة.',
      displayOrder: 1,
      updatedBy: adminEmail,
    },
    create: {
      id: 'course-advanced-nextjs',
      titleEn: 'Advanced Next.js Patterns',
      titleAr: 'أنماط متقدمة في Next.js',
      providerEn: 'Frontend Masters',
      providerAr: 'فرونت إند ماسترز',
      issuedOn: new Date('2023-06-01'),
      certificateUrl: 'https://example.com/certificates/nextjs.pdf',
      notesEn: 'Deep dive into server components and edge rendering.',
      notesAr: 'تعمق في مكونات الخادم والتصيير على الحافة.',
      displayOrder: 1,
      createdBy: adminEmail,
      updatedBy: adminEmail,
    },
  });

  await prisma.achievement.upsert({
    where: { id: 'achievement-top-speaker' },
    update: {
      titleEn: 'Top Conference Speaker',
      titleAr: 'أفضل متحدث في المؤتمر',
      descriptionEn: 'Recognized for delivering a keynote on resilient web apps.',
      descriptionAr: 'تم تكريمه لتقديم كلمة رئيسية حول تطبيقات الويب المرنة.',
      issuedByEn: 'JSConf',
      issuedByAr: 'JSConf',
      achievedOn: new Date('2022-11-15'),
      linkUrl: 'https://example.com/achievements/jsconf',
      logoUrl: 'https://dummyimage.com/120x120/f97316/ffffff&text=JS',
      displayOrder: 1,
      updatedBy: adminEmail,
    },
    create: {
      id: 'achievement-top-speaker',
      titleEn: 'Top Conference Speaker',
      titleAr: 'أفضل متحدث في المؤتمر',
      descriptionEn: 'Recognized for delivering a keynote on resilient web apps.',
      descriptionAr: 'تم تكريمه لتقديم كلمة رئيسية حول تطبيقات الويب المرنة.',
      issuedByEn: 'JSConf',
      issuedByAr: 'JSConf',
      achievedOn: new Date('2022-11-15'),
      linkUrl: 'https://example.com/achievements/jsconf',
      logoUrl: 'https://dummyimage.com/120x120/f97316/ffffff&text=JS',
      displayOrder: 1,
      createdBy: adminEmail,
      updatedBy: adminEmail,
    },
  });

  await prisma.auditLog.upsert({
    where: { id: 'seed-log-initial' },
    update: {
      userId: adminUser.id,
      action: 'SEED',
      entityType: 'SYSTEM',
      entityId: 'initial-seed',
      newValues: { seededAt: new Date().toISOString() },
    },
    create: {
      id: 'seed-log-initial',
      userId: adminUser.id,
      action: 'SEED',
      entityType: 'SYSTEM',
      entityId: 'initial-seed',
      newValues: { seededAt: new Date().toISOString() },
    },
  });

  console.log('Seed completed successfully', {
    adminUser: { email: adminUser.email },
    profile: { email: profile.email },
    settings: { id: settings.id },
    project: { id: project.id },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
