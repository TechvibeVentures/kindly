import kindlyLogo from '@/assets/kindly-logo.png';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <img src={kindlyLogo} alt="Kindly" className="h-12" />
      </div>
    </header>
  );
}
