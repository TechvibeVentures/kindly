import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, MessageCircle, Heart, UserPlus, 
  Bell, Mail, Megaphone
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Notifications() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [newMessages, setNewMessages] = useState(true);
  const [newMatches, setNewMatches] = useState(true);
  const [profileViews, setProfileViews] = useState(false);
  const [reminders, setReminders] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const pushNotifications = [
    {
      icon: MessageCircle,
      label: t.newMessages,
      description: t.newMessagesDesc,
      value: newMessages,
      onChange: setNewMessages,
    },
    {
      icon: Heart,
      label: t.newMatches,
      description: t.newMatchesDesc,
      value: newMatches,
      onChange: setNewMatches,
    },
    {
      icon: UserPlus,
      label: t.profileViews,
      description: t.profileViewsDesc,
      value: profileViews,
      onChange: setProfileViews,
    },
    {
      icon: Bell,
      label: t.reminders,
      description: t.remindersDesc,
      value: reminders,
      onChange: setReminders,
    },
  ];

  const emailNotifications = [
    {
      icon: Mail,
      label: t.weeklyDigest,
      description: t.weeklyDigestDesc,
      value: emailDigest,
      onChange: setEmailDigest,
    },
    {
      icon: Megaphone,
      label: t.marketingEmails,
      description: t.marketingEmailsDesc,
      value: marketingEmails,
      onChange: setMarketingEmails,
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
            <h1 className="text-xl font-bold">{t.notifications}</h1>
            <p className="text-sm text-muted-foreground">{t.notificationPreferences}</p>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block border-b border-border bg-background">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold">{t.notifications}</h1>
          <p className="text-muted-foreground mt-1">{t.notificationPreferences}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Push Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3 px-1">
            {t.pushNotifications}
          </h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {pushNotifications.map((item, index) => (
              <div
                key={item.label}
                className={`flex items-center justify-between px-4 py-4 ${
                  index !== pushNotifications.length - 1 ? 'border-b border-border/50' : ''
                }`}
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
                <Switch
                  checked={item.value}
                  onCheckedChange={item.onChange}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Email Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3 px-1">
            {t.emailPreferences}
          </h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {emailNotifications.map((item, index) => (
              <div
                key={item.label}
                className={`flex items-center justify-between px-4 py-4 ${
                  index !== emailNotifications.length - 1 ? 'border-b border-border/50' : ''
                }`}
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
                <Switch
                  checked={item.value}
                  onCheckedChange={item.onChange}
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
