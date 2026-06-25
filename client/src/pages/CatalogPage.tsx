import { useLocation } from 'react-router-dom';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { CategoryCard } from '@/components/common/CategoryCard';
import { ScrollReveal } from '@/components/common/ScrollReveal';
import { getCategoriesBySection, type ModuleSection } from '@/config/modules';

const SECTION_META: Record<ModuleSection, { title: string; description: string }> = {
  modules: {
    title: 'Modules',
    description: 'Browse practice modules by category, then open one to start automating.',
  },
  challenges: {
    title: 'Challenges',
    description: 'Tackle deliberately tricky, flaky-by-design scenarios that stress your selectors.',
  },
  workflows: {
    title: 'Workflows',
    description: 'Practice realistic, end-to-end journeys across full application flows.',
  },
};

/**
 * Section catalog — lists the categories under /modules, /challenges or
 * /workflows as cards. Picking a category opens its landing page.
 */
export default function CatalogPage() {
  const { pathname } = useLocation();
  const section = (pathname.split('/')[1] || 'modules') as ModuleSection;
  const meta = SECTION_META[section] ?? SECTION_META.modules;
  const categories = getCategoriesBySection(section);

  return (
    <PageContainer>
      <PageHeader title={meta.title} description={meta.description} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="catalog-grid">
        {categories.map((category, index) => (
          <ScrollReveal key={category} delay={index * 0.05}>
            <CategoryCard category={category} />
          </ScrollReveal>
        ))}
      </div>
    </PageContainer>
  );
}
