import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Key, Smartphone, Mail, 
  Shield, History, ChevronRight, AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AccountSecurity() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const securitySettings = [
    {
      icon: Key,
      label: t.changePassword,
      description: t.changePasswordDesc,
      action: 'navigate',
      onClick: () => {},
    },
    {
      icon: Mail,
      label: t.changeEmail,
      description: t.changeEmailDesc,
      action: 'navigate',
      onClick: () => {},
    },
    {
      icon: Smartphone,
      label: t.twoFactorAuth,
      description: t.twoFactorAuthDesc,
      action: 'toggle',
      value: twoFactorEnabled,
      onChange: setTwoFactorEnabled,
    },
  ];

  const securityActions = [
    {
      icon: History,
      label: t.loginHistory,
      description: t.loginHistoryDesc,
      onClick: () => {},
    },
    {
      icon: Shield,
      label: t.activeSessions,
      description: t.activeSessionsDesc,
      onClick: () => {},
    },
  ];

  return (
    <div className="pb-24 md:pb-0 bg-background min-h-screen">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{t.accountSecurity}</h1>
            <p className="text-sm text-muted-foreground">{t.securitySettings}</p>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block border-b border-border bg-background">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold">{t.accountSecurity}</h1>
          <p className="text-muted-foreground mt-1">{t.securitySettings}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3 px-1">
            {t.accountSecurity}
          </h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {securitySettings.map((item, index) => (
              <div
                key={item.label}
                className={`flex items-center justify-between px-4 py-4 ${
                  index !== securitySettings.length - 1 ? 'border-b border-border/50' : ''
                } ${item.action === 'navigate' ? 'hover:bg-secondary/30 cursor-pointer' : ''}`}
                onClick={item.action === 'navigate' ? item.onClick : undefined}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <span className="font-medium block text-sm">{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </div>
                </div>
                {item.action === 'toggle' ? (
                  <Switch
                    checked={item.value}
                    onCheckedChange={item.onChange}
                  />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3 px-1">
            Activity
          </h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {securityActions.map((item, index) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className={`w-full flex items-center justify-between px-4 py-4 hover:bg-secondary/30 transition-colors ${
                  index !== securityActions.length - 1 ? 'border-b border-border/50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <span className="font-medium block text-sm">{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm font-medium text-destructive uppercase tracking-wide mb-3 px-1">
            {t.dangerZone}
          </h2>
          <div className="bg-card rounded-xl border border-destructive/30 overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-4 py-4 hover:bg-destructive/5 transition-colors"
              onClick={() => {}}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                </div>
                <div className="text-left">
                  <span className="font-medium block text-sm text-destructive">{t.deleteAccount}</span>
                  <span className="text-xs text-muted-foreground">{t.deleteAccountDesc}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-destructive" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
