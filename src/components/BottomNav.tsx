import { NavLink } from 'react-router-dom';
import { Compass, Heart, BookOpen, MessageCircle, User } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

export function BottomNav() {
  const { userRole } = useApp();
  const { t } = useLanguage();

  const seekerTabs = [
    { path: '/discover', icon: Compass, label: t.discover },
    { path: '/resources', icon: BookOpen, label: t.resources },
    { path: '/conversations', icon: MessageCircle, label: t.chats },
    { path: '/profile', icon: User, label: t.profile },
  ];

  const candidateTabs = [
    { path: '/profile', icon: User, label: t.myProfile },
    { path: '/preview', icon: Compass, label: t.preview },
    { path: '/conversations', icon: MessageCircle, label: t.requests },
  ];

  const tabs = userRole === 'seeker' ? seekerTabs : candidateTabs;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border safe-area-pb z-50">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) => 
              `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors ${
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  initial={false}
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <tab.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>
                <span className="text-xs font-medium">{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
