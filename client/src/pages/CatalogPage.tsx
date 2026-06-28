import { useLocation } from 'react-router-dom';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { CategoryCard } from '@/components/common/CategoryCard';
import { ModuleCard } from '@/components/common/ModuleCard';
import { ScrollReveal } from '@/components/common/ScrollReveal';
import { Badge } from '@/components/ui/badge';
import { getCategoriesBySection, getModulesByCategory, type ModuleSection } from '@/config/modules';
import { buildPracticeTree } from '@/config/navigation';

const SECTION_META: Record<ModuleSection, { title: string; description: string }> = {
  modules: {
    title: 'Practice Modules',
    description: 'Browse 40 hands-on modules, grouped into three domains. Open a category, then pick a module to automate.',
  },
  challenges: {
    title: 'Challenges',
    description: 'Deliberately tricky, flaky-by-design scenarios that stress your selectors, waits and timing.',
  },
  workflows: {
    title: 'Workflows',
    description: 'Realistic, end-to-end journeys across full application flows (sign-in required).',
  },
};

/**
 * Section catalog. The Practice section is grouped by domain → category; the
 * Challenges and Workflows sections list their modules directly.
 */
export default function CatalogPage() {
  const { pathname } = useLocation();
  const section = (pathname.split('/')[1] || 'modules') as ModuleSection;
  const meta = SECTION_META[section] ?? SECTION_META.modules;

  if (section === 'modules') {
    const tree = buildPracticeTree();
    return (
      <PageContainer>
        <PageHeader title={meta.title} description={meta.description} />
        {tree.map((node) => {
          const Icon = node.domain.icon;
          return (
            <section key={node.domain.id} className="space-y-4" data-testid={`catalog-domain-${node.domain.id}`}>
              <div className="flex flex-col gap-1 rounded-xl border bg-card/50 p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${node.domain.accent}`}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="text-lg font-bold text-foreground">{node.domain.label}</h2>
                  <Badge variant="secondary" className="rounded-full">
                    {node.categories.length} categories · {node.moduleCount} modules
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{node.domain.description}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {node.categories.map((cat, index) => (
                  <ScrollReveal key={cat.slug} delay={index * 0.05}>
                    <CategoryCard category={cat.category} />
                  </ScrollReveal>
                ))}
              </div>
            </section>
          );
        })}
      </PageContainer>
    );
  }

  // Challenges / Workflows — show the modules directly.
  const categories = getCategoriesBySection(section);
  const modules = categories.flatMap((c) => getModulesByCategory(c));
  return (
    <PageContainer>
      <PageHeader
        title={meta.title}
        description={meta.description}
        actions={
          <Badge variant="secondary" className="rounded-full">
            {modules.length} {modules.length === 1 ? 'module' : 'modules'}
          </Badge>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="catalog-grid">
        {modules.map((module, index) => (
          <ScrollReveal key={module.id} delay={index * 0.04}>
            <ModuleCard module={module} />
          </ScrollReveal>
        ))}
      </div>
    </PageContainer>
  );
}
