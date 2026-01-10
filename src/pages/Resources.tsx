import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, FileText, Users, Scale, Heart, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Resources() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const resources = [
    {
      icon: Scale,
      title: t.legalFramework,
      description: t.legalFrameworkDesc,
      color: 'bg-kindly-blue-light',
      slug: 'legal-framework',
    },
    {
      icon: FileText,
      title: t.agreementTemplates,
      description: t.agreementTemplatesDesc,
      color: 'bg-kindly-mint',
      slug: 'agreement-templates',
    },
    {
      icon: Users,
      title: t.communityStories,
      description: t.communityStoriesDesc,
      color: 'bg-kindly-rose',
      slug: 'community-stories',
    },
    {
      icon: Heart,
      title: t.relationshipGuidance,
      description: t.relationshipGuidanceDesc,
      color: 'bg-kindly-lavender',
      slug: 'relationship-guidance',
    },
    {
      icon: Calendar,
      title: t.planningTools,
      description: t.planningToolsDesc,
      color: 'bg-kindly-warm',
      slug: 'planning-tools',
    },
    {
      icon: BookOpen,
      title: t.readingList,
      description: t.readingListDesc,
      color: 'bg-kindly-cream',
      slug: 'reading-list',
    },
  ];

  return (
    <div className="pb-24 md:pb-8">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-sm px-4 py-3 border-b border-border">
        <h1 className="text-xl font-bold">{t.resources}</h1>
        <p className="text-sm text-muted-foreground">
          {t.learnAboutCoParenting}
        </p>
      </div>

      {/* Desktop/Tablet Layout */}
      <div className="hidden md:block p-8 bg-background min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t.resources}</h1>
            <p className="text-muted-foreground">
              {t.everythingYouNeed}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <motion.button
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/resources/${resource.slug}`)}
                className="bg-card rounded-2xl p-6 text-left border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <div className={`p-4 rounded-xl ${resource.color} w-fit mb-4`}>
                  <resource.icon className="w-8 h-8 text-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
                <p className="text-sm text-muted-foreground">{resource.description}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden p-4 space-y-3">
        {resources.map((resource, index) => (
          <motion.button
            key={resource.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/resources/${resource.slug}`)}
            className="kindly-card w-full p-4 flex items-start gap-4 text-left"
          >
            <div className={`p-3 rounded-xl ${resource.color}`}>
              <resource.icon className="w-6 h-6 text-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">{resource.title}</h3>
              <p className="text-sm text-muted-foreground">{resource.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
