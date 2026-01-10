import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { CandidateCard } from '@/components/CandidateCard';
import { FilterModal } from '@/components/FilterModal';
import { Button } from '@/components/ui/button';

export default function Discover() {
  const { filteredCandidates } = useApp();
  const { t } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="pb-24 md:pb-0">
      {/* Desktop Header */}
      <div className="hidden md:block bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{t.discover}</h1>
              <p className="text-muted-foreground mt-1">
                {filteredCandidates.length} {t.potentialCoParents}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => setShowFilters(true)} variant="outline">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                {t.filters}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-sm px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{t.discover}</h1>
            <p className="text-sm text-muted-foreground">
              {filteredCandidates.length} {t.potentialCoParents}
            </p>
          </div>
          <motion.button
            onClick={() => setShowFilters(true)}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 kindly-btn-secondary"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {t.filters}
          </motion.button>
        </div>
      </div>

      {/* Desktop Grid View */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 py-8">
        {filteredCandidates.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <p className="text-muted-foreground text-lg">{t.noMatches}</p>
            <Button onClick={() => setShowFilters(true)} className="mt-4">
              {t.adjustFilters}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCandidates.map((candidate, index) => (
              <CandidateCard key={candidate.id} candidate={candidate} index={index} variant="grid" />
            ))}
          </div>
        )}
      </div>

      {/* Mobile List View */}
      <div className="md:hidden p-4">
        {filteredCandidates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t.noMatches}</p>
            <button 
              onClick={() => setShowFilters(true)}
              className="kindly-btn-primary mt-4"
            >
              {t.adjustFilters}
            </button>
          </div>
        ) : (
          filteredCandidates.map((candidate, index) => (
            <CandidateCard key={candidate.id} candidate={candidate} index={index} />
          ))
        )}
      </div>

      <FilterModal isOpen={showFilters} onClose={() => setShowFilters(false)} />
    </div>
  );
}
