import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Clock, BookOpen, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ResourceDetail() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { t } = useLanguage();

  const resourceContent: Record<string, {
    title: string;
    subtitle: string;
    readTime: string;
    sections: { heading: string; content: string }[];
  }> = {
    'legal-framework': {
      title: t.legalFramework,
      subtitle: t.legalFrameworkSubtitle,
      readTime: `8 ${t.minRead}`,
      sections: [
        { heading: t.legalSection1Title, content: t.legalSection1Content },
        { heading: t.legalSection2Title, content: t.legalSection2Content },
        { heading: t.legalSection3Title, content: t.legalSection3Content },
        { heading: t.legalSection4Title, content: t.legalSection4Content },
      ],
    },
    'agreement-templates': {
      title: t.agreementTemplates,
      subtitle: t.agreementTemplatesSubtitle,
      readTime: `5 ${t.minRead}`,
      sections: [
        { heading: t.agreementSection1Title, content: t.agreementSection1Content },
        { heading: t.agreementSection2Title, content: t.agreementSection2Content },
        { heading: t.agreementSection3Title, content: t.agreementSection3Content },
      ],
    },
    'community-stories': {
      title: t.communityStories,
      subtitle: t.communityStoriesSubtitle,
      readTime: `10 ${t.minRead}`,
      sections: [
        { heading: t.communitySection1Title, content: t.communitySection1Content },
        { heading: t.communitySection2Title, content: t.communitySection2Content },
        { heading: t.communitySection3Title, content: t.communitySection3Content },
      ],
    },
    'relationship-guidance': {
      title: t.relationshipGuidance,
      subtitle: t.relationshipGuidanceSubtitle,
      readTime: `7 ${t.minRead}`,
      sections: [
        { heading: t.relationshipSection1Title, content: t.relationshipSection1Content },
        { heading: t.relationshipSection2Title, content: t.relationshipSection2Content },
        { heading: t.relationshipSection3Title, content: t.relationshipSection3Content },
      ],
    },
    'planning-tools': {
      title: t.planningTools,
      subtitle: t.planningToolsSubtitle,
      readTime: `6 ${t.minRead}`,
      sections: [
        { heading: t.planningSection1Title, content: t.planningSection1Content },
        { heading: t.planningSection2Title, content: t.planningSection2Content },
        { heading: t.planningSection3Title, content: t.planningSection3Content },
      ],
    },
    'reading-list': {
      title: t.readingList,
      subtitle: t.readingListSubtitle,
      readTime: `4 ${t.minRead}`,
      sections: [
        { heading: t.readingSection1Title, content: t.readingSection1Content },
        { heading: t.readingSection2Title, content: t.readingSection2Content },
        { heading: t.readingSection3Title, content: t.readingSection3Content },
      ],
    },
  };
  
  const resource = slug ? resourceContent[slug] : null;

  if (!resource) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">{t.resourceNotFound}</p>
      </div>
    );
  }

  return (
    <div className="pb-24 md:pb-0 bg-background min-h-screen">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold truncate">{resource.title}</h1>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block border-b border-border bg-background">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4 -ml-2">
            <ChevronLeft className="w-4 h-4 mr-1" />
            {t.backToResources}
          </Button>
          <h1 className="text-4xl font-bold">{resource.title}</h1>
          <p className="text-lg text-muted-foreground mt-2">{resource.subtitle}</p>
          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {resource.readTime}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {resource.sections.length} {t.sectionsLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="space-y-8">
          {resource.sections.map((section, index) => (
            <motion.div
              key={section.heading}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h2 className="text-xl font-semibold mb-3">{section.heading}</h2>
              <p className="text-muted-foreground leading-relaxed">{section.content}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 p-6 bg-primary/5 rounded-2xl border border-primary/20 text-center"
        >
          <h3 className="font-semibold text-lg mb-2">{t.needMoreGuidance}</h3>
          <p className="text-muted-foreground text-sm mb-4">
            {t.connectWithProfessionals}
          </p>
          <Button>
            {t.findProfessional}
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}