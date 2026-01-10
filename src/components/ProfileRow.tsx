import { ChevronRight, LucideIcon } from 'lucide-react';

interface ProfileRowProps {
  icon: LucideIcon;
  label: string;
  value?: string;
  placeholder?: string;
  onClick?: () => void;
}

export function ProfileRow({ icon: Icon, label, value, placeholder = 'Add', onClick }: ProfileRowProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 py-3.5 px-1 border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors text-left"
    >
      <Icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      <span className="text-foreground font-medium flex-shrink-0">{label}</span>
      <span className={`flex-1 text-right truncate ${value ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}>
        {value || placeholder}
      </span>
      <ChevronRight className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
    </button>
  );
}
