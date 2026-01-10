import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Globe, Moon, Sun, Volume2, VolumeX, 
  Smartphone, Mail, HelpCircle, FileText, Info, ChevronRight, Check, Shield, LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { useLanguage, languages } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Settings() {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const { isAdmin, signOut } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const currentLang = languages.find(l => l.code === language);

  const handleSignOut = async () => {
    await signOut();
    // signOut already handles navigation
  };

  return (
    <div className="pb-24 md:pb-0 bg-background min-h-screen">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{t.settings}</h1>
            <p className="text-sm text-muted-foreground">{t.appSettings}</p>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block border-b border-border bg-background">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold">{t.settings}</h1>
          <p className="text-muted-foreground mt-1">{t.appSettings}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3 px-1">
            {t.preferences}
          </h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {/* Language */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center justify-between px-4 py-4 border-b border-border/50 hover:bg-secondary/30 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <span className="font-medium block text-sm">{t.language}</span>
                      <span className="text-xs text-muted-foreground">{currentLang?.nativeLabel}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className="flex items-center justify-between"
                  >
                    <span>{lang.nativeLabel}</span>
                    {language === lang.code && <Check className="w-4 h-4 ml-2 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Dark Mode */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                  {darkMode ? <Moon className="w-4 h-4 text-muted-foreground" /> : <Sun className="w-4 h-4 text-muted-foreground" />}
                </div>
                <div>
                  <span className="font-medium block text-sm">{t.darkMode}</span>
                  <span className="text-xs text-muted-foreground">{t.darkModeDesc}</span>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            {/* Sound Effects */}
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-muted-foreground" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
                </div>
                <div>
                  <span className="font-medium block text-sm">{t.soundEffects}</span>
                  <span className="text-xs text-muted-foreground">{t.soundEffectsDesc}</span>
                </div>
              </div>
              <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            </div>
          </div>
        </motion.div>

        {/* Communication */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3 px-1">
            {t.communication}
          </h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div
              className="flex items-center justify-between px-4 py-4 border-b border-border/50 hover:bg-secondary/30 cursor-pointer"
              onClick={() => navigate('/settings/notifications')}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <span className="font-medium block text-sm">{t.pushNotifications}</span>
                  <span className="text-xs text-muted-foreground">{t.pushNotificationsDesc}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
            <div
              className="flex items-center justify-between px-4 py-4 hover:bg-secondary/30 cursor-pointer"
              onClick={() => {}}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <span className="font-medium block text-sm">{t.emailPreferences}</span>
                  <span className="text-xs text-muted-foreground">{t.emailPreferencesDesc}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3 px-1">
            {t.support}
          </h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {[
              { icon: HelpCircle, label: t.helpCenter, desc: t.helpCenterDesc },
              { icon: FileText, label: t.termsOfService, desc: t.termsOfServiceDesc },
              { icon: FileText, label: t.privacyPolicy, desc: t.privacyPolicyDesc },
              { icon: Info, label: t.aboutApp, desc: 'Version 1.0.0' },
            ].map((item, index, arr) => (
              <div
                key={item.label}
                className={`flex items-center justify-between px-4 py-4 hover:bg-secondary/30 cursor-pointer ${
                  index !== arr.length - 1 ? 'border-b border-border/50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <span className="font-medium block text-sm">{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.desc}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Admin Section */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3 px-1">
              Admin
            </h2>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div
                className="flex items-center justify-between px-4 py-4 hover:bg-secondary/30 cursor-pointer"
                onClick={() => navigate('/admin')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium block text-sm">Admin Dashboard</span>
                    <span className="text-xs text-muted-foreground">Manage members & invitations</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Sign Out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="outline"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
