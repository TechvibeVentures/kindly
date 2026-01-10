import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import { DesktopHeader } from './DesktopHeader';
import { DesktopFooter } from './DesktopFooter';
import { SidebarNav } from './SidebarNav';

interface ResponsiveLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export function ResponsiveLayout({ children, showFooter = true }: ResponsiveLayoutProps) {
  return (
    <div className="min-h-screen bg-muted">
      {/* Desktop/Tablet Layout */}
      <div className="hidden md:block">
        <DesktopHeader />
        <div className="flex">
          <SidebarNav />
          <div className="flex-1 flex flex-col min-h-[calc(100vh-64px)] ml-48">
            <main className="flex-1">
              {children}
            </main>
            {showFooter && <DesktopFooter />}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex items-start justify-center">
        <div className="w-full max-w-md relative shadow-strong bg-background min-h-screen">
          <div className="pb-20">
            {children}
          </div>
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
