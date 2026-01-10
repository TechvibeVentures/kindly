import { useNavigate } from 'react-router-dom';
import { Heart, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { CandidateCard } from '@/components/CandidateCard';
import { Button } from '@/components/ui/button';

export default function Shortlist() {
  const navigate = useNavigate();
  const { shortlist, candidates } = useApp();
  const { t } = useLanguage();
  
  const shortlistedCandidates = candidates.filter(c => shortlist.includes(c.id));

  return (
    <div className="pb-24 md:pb-0 bg-background">
      {/* Desktop Header */}
      <div className="hidden md:block bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{t.shortlist}</h1>
              <p className="text-muted-foreground mt-1">
                {shortlistedCandidates.length} {t.savedProfiles.toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-sm px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/profile')} className="p-2 -ml-2">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold">{t.shortlist}</h1>
            <p className="text-sm text-muted-foreground">
              {shortlistedCandidates.length} {t.savedProfiles.toLowerCase()}
            </p>
          </div>
          <div className="w-10" />
        </div>
      </div>

      {/* Desktop Grid View */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 py-8">
        {shortlistedCandidates.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <div className="w-16 h-16 mx-auto bg-kindly-rose/20 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-kindly-rose" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{t.noMatches}</h3>
            <p className="text-muted-foreground mb-6">
              {t.savedProfiles}
            </p>
            <Button onClick={() => navigate('/discover')}>
              {t.discover}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {shortlistedCandidates.map((candidate, index) => (
              <CandidateCard key={candidate.id} candidate={candidate} index={index} variant="grid" />
            ))}
          </div>
        )}
      </div>

      {/* Mobile List View */}
      <div className="md:hidden p-4">
        {shortlistedCandidates.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border/50">
            <div className="w-14 h-14 mx-auto bg-kindly-rose/20 rounded-full flex items-center justify-center mb-3">
              <Heart className="w-7 h-7 text-kindly-rose" />
            </div>
            <h3 className="font-semibold mb-1">{t.noMatches}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t.savedProfiles}
            </p>
            <button 
              onClick={() => navigate('/discover')}
              className="kindly-btn-primary"
            >
              {t.discover}
            </button>
          </div>
        ) : (
          shortlistedCandidates.map((candidate, index) => (
            <CandidateCard key={candidate.id} candidate={candidate} index={index} />
          ))
        )}
      </div>
    </div>
  );
}
