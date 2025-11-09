import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center gradient-subtle">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-in">
              {t('hero.greeting')} <span className="gradient-text">Your Name</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-in" style={{ animationDelay: '0.1s' }}>
              Full Stack Developer | UI/UX Designer | Problem Solver
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in" style={{ animationDelay: '0.2s' }}>
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                {t('hero.cta')}
              </button>
              <button className="px-8 py-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors">
                {t('hero.downloadCV')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('featuredProjects.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder project cards */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-hover border rounded-lg p-6">
                <div className="h-40 bg-muted rounded-lg mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">Project {i}</h3>
                <p className="text-muted-foreground mb-4">Short project description goes here.</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">React</span>
                  <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">TypeScript</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="text-primary hover:underline">
              {t('featuredProjects.viewAll')}
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">25+</div>
              <div className="text-muted-foreground">{t('stats.projects')}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">5+</div>
              <div className="text-muted-foreground">{t('stats.experience')}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">15+</div>
              <div className="text-muted-foreground">{t('stats.clients')}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">20+</div>
              <div className="text-muted-foreground">{t('stats.technologies')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            {t('cta.button')}
          </button>
        </div>
      </section>
    </div>
  );
}