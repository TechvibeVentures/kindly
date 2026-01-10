import { ReactNode } from 'react';
import { X, LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: ReactNode;
  onSave?: () => void;
  saveLabel?: string;
}

export function ProfileEditDialog({ open, onOpenChange, title, subtitle, icon, children, onSave, saveLabel = 'Save' }: ProfileEditDialogProps) {
  const Icon = icon;
  
  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    onOpenChange(false);
  };
  
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50"
          />
          
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-background rounded-t-3xl z-50 max-h-[85vh] overflow-hidden flex flex-col"
          >
            <div className="sticky top-0 bg-background border-b border-border px-4 py-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{title}</h2>
                  {subtitle && (
                    <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
                  )}
                </div>
                <button 
                  onClick={() => onOpenChange(false)} 
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
              {Icon && (
                <div className="flex justify-center py-6">
                  <Icon className="w-12 h-12 text-foreground" strokeWidth={1.5} />
                </div>
              )}
              <div className="pb-4">
                {children}
              </div>
            </div>
            <div className="flex-shrink-0 border-t border-border px-4 py-4 bg-background">
              <Button onClick={handleSave} className="w-full h-12 kindly-button-primary">
                {saveLabel}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
