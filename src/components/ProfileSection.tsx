import { ReactNode } from 'react';

interface ProfileSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function ProfileSection({ title, description, children }: ProfileSectionProps) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}
