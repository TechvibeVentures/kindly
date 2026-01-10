import { ReactNode } from 'react';
import { ChevronLeft, LucideIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ProfileEditDialog } from '@/components/ProfileEditDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

interface ProfileEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: ReactNode;
  onSave?: () => void;
  saveLabel?: string;
}

export function ProfileEditSheet({ open, onOpenChange, title, subtitle, icon, children, onSave, saveLabel = 'Save' }: ProfileEditSheetProps) {
  const isMobile = useIsMobile();

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    onOpenChange(false);
  };

  // Use dialog popup on desktop/tablet, bottom sheet on mobile
  if (!isMobile) {
    return (
      <ProfileEditDialog
        open={open}
        onOpenChange={onOpenChange}
        title={title}
        subtitle={subtitle}
        icon={icon}
        onSave={handleSave}
        saveLabel={saveLabel}
      >
        {children}
      </ProfileEditDialog>
    );
  }

  const Icon = icon;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl flex flex-col" hideCloseButton>
        <SheetHeader className="flex flex-row items-center gap-3 pb-4 border-b border-border flex-shrink-0">
          <button 
            onClick={() => onOpenChange(false)}
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <SheetTitle className="text-lg font-bold text-left">{title}</SheetTitle>
            {subtitle && (
              <p className="text-sm text-muted-foreground text-left">{subtitle}</p>
            )}
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4 px-6 min-h-0">
          {Icon && (
            <div className="flex justify-center py-6">
              <Icon className="w-12 h-12 text-foreground" strokeWidth={1.5} />
            </div>
          )}
          <div className="pb-4">
            {children}
          </div>
        </div>
        <div className="flex-shrink-0 border-t border-border px-6 py-4 bg-background">
          <Button onClick={handleSave} className="w-full h-12 kindly-button-primary">
            {saveLabel}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}