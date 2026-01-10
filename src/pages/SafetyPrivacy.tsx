import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Eye, EyeOff, Users, MapPin, 
  Clock, Shield, UserX, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrentUserProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';

export default function SafetyPrivacy() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { data: profile, isLoading } = useCurrentUserProfile();
  const updateProfileMutation = useUpdateProfile();
  const { toast } = useToast();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize state from profile
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showLocation, setShowLocation] = useState(true);
  const [showLastActive, setShowLastActive] = useState(false);
  const [profileVisible, setProfileVisible] = useState(true);
  
  // Load privacy settings from profile
  useEffect(() => {
    if (profile) {
      setShowOnlineStatus(profile.show_online_status ?? true);
      setShowLocation(profile.show_location ?? true);
      setShowLastActive(profile.show_last_active ?? false);
      setProfileVisible(profile.is_public ?? true);
    }
  }, [profile]);
  
  // Save privacy setting to database (debounced)
  const savePrivacySetting = async (key: string, value: boolean) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await updateProfileMutation.mutateAsync({ [key]: value } as any);
      } catch (error: any) {
        console.error('Error saving privacy setting:', error);
        toast({
          title: 'Failed to save',
          description: error.message || 'Could not update privacy setting',
          variant: 'destructive'
        });
      }
    }, 300);
  };
  
  const handleShowOnlineStatusChange = (checked: boolean) => {
    setShowOnlineStatus(checked);
    savePrivacySetting('show_online_status', checked);
  };
  
  const handleShowLocationChange = (checked: boolean) => {
    setShowLocation(checked);
    savePrivacySetting('show_location', checked);
  };
  
  const handleShowLastActiveChange = (checked: boolean) => {
    setShowLastActive(checked);
    savePrivacySetting('show_last_active', checked);
  };
  
  const handleProfileVisibilityChange = async (checked: boolean) => {
    setProfileVisible(checked);
    try {
      await updateProfileMutation.mutateAsync({ is_public: checked } as any);
      toast({
        title: 'Profile visibility updated',
        description: checked ? 'Your profile is now visible to others' : 'Your profile is now hidden'
      });
    } catch (error: any) {
      console.error('Error updating profile visibility:', error);
      toast({
        title: 'Failed to save',
        description: error.message || 'Could not update profile visibility',
        variant: 'destructive'
      });
      // Revert on error
      setProfileVisible(!checked);
    }
  };

  const privacySettings = [
    {
      icon: Eye,
      label: t.profileVisibility,
      description: t.profileVisibilityDesc,
      value: profileVisible,
      onChange: handleProfileVisibilityChange,
    },
    {
      icon: Users,
      label: t.showOnlineStatus,
      description: t.showOnlineStatusDesc,
      value: showOnlineStatus,
      onChange: handleShowOnlineStatusChange,
    },
    {
      icon: MapPin,
      label: t.showLocation,
      description: t.showLocationDesc,
      value: showLocation,
      onChange: handleShowLocationChange,
    },
    {
      icon: Clock,
      label: t.showLastActive,
      description: t.showLastActiveDesc,
      value: showLastActive,
      onChange: handleShowLastActiveChange,
    },
  ];
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="pb-24 md:pb-0 bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading privacy settings...</p>
        </div>
      </div>
    );
  }

  const safetyActions = [
    {
      icon: UserX,
      label: t.blockedUsers,
      description: t.blockedUsersDesc,
      onClick: () => {},
    },
    {
      icon: Shield,
      label: t.reportHistory,
      description: t.reportHistoryDesc,
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
            <h1 className="text-xl font-bold">{t.safetyPrivacy}</h1>
            <p className="text-sm text-muted-foreground">{t.privacySettings}</p>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block border-b border-border bg-background">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold">{t.safetyPrivacy}</h1>
          <p className="text-muted-foreground mt-1">{t.privacySettings}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Privacy Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3 px-1">
            {t.safetyPrivacy}
          </h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {privacySettings.map((item, index) => (
              <div
                key={item.label}
                className={`flex items-center justify-between px-4 py-4 ${
                  index !== privacySettings.length - 1 ? 'border-b border-border/50' : ''
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

        {/* Safety Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3 px-1">
            {t.support}
          </h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {safetyActions.map((item, index) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className={`w-full flex items-center justify-between px-4 py-4 hover:bg-secondary/30 transition-colors ${
                  index !== safetyActions.length - 1 ? 'border-b border-border/50' : ''
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

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-primary/5 rounded-xl p-4 border border-primary/20"
        >
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm">{t.safetyPriority}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {t.safetyPriorityDesc}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
