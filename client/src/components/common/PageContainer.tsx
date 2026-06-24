import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return <div className={cn('mx-auto w-full max-w-6xl space-y-8', className)}>{children}</div>;
}

interface SectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  /** Optional id for in-page anchors and aria-labelledby wiring. */
  id?: string;
}

export function Section({ title, description, children, className, id }: SectionProps) {
  const headingId = id ? `${id}-heading` : undefined;
  return (
    <section aria-labelledby={headingId} className={cn('space-y-4', className)}>
      {title ? (
        <div className="space-y-1">
          <h2 id={headingId} className="text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
