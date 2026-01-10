import { ChevronRight } from 'lucide-react';

interface ProfileChipCardProps {
  chips: string[];
  onClick?: () => void;
  emptyText?: string;
  showChevron?: boolean;
}

export function ProfileChipCard({ 
  chips, 
  onClick, 
  emptyText = 'Add',
  showChevron = true 
}: ProfileChipCardProps) {
  if (chips.length === 0) {
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card hover:bg-secondary/30 transition-colors"
      >
        <span className="text-muted-foreground/60">{emptyText}</span>
        {showChevron && <ChevronRight className="w-4 h-4 text-muted-foreground/50" />}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 p-4 rounded-xl border border-border/50 bg-card hover:bg-secondary/30 transition-colors"
    >
      <div className="flex-1 flex flex-wrap gap-2">
        {chips.map((chip, index) => (
          <span
            key={index}
            className="px-3 py-1.5 rounded-full text-sm bg-secondary text-secondary-foreground"
          >
            {chip}
          </span>
        ))}
      </div>
      {showChevron && <ChevronRight className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />}
    </button>
  );
}
