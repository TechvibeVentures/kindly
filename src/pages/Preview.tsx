import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, MapPin, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const previewProfile = {
  name: 'Your Name',
  age: 35,
  district: 'Kreis 4',
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
  vision: 'I dream of raising a curious, kind child in a collaborative partnership built on mutual respect and shared values.',
  values: ['Stability', 'Education', 'Nature', 'Communication'],
  involvement: '50/50 custody',
  compatibilityScore: 0, // This is just preview data - will be calculated dynamically for real profiles
};

export default function Preview() {
  const [viewMode, setViewMode] = useState<'card' | 'detail'>('card');
  const { t } = useLanguage();

  return (
    <div className="pb-24">
      <div className="md:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-sm px-4 py-3 border-b border-border">
        <h1 className="text-xl font-bold">{t.profilePreview}</h1>
        <p className="text-sm text-muted-foreground">{t.seeHowSeekersView}</p>
      </div>

      <div className="p-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setViewMode('card')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'card' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
          >
            {t.cardView}
          </button>
          <button
            onClick={() => setViewMode('detail')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'detail' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
          >
            {t.detailView}
          </button>
        </div>

        {viewMode === 'card' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="kindly-card overflow-hidden"
          >
            <div className="relative">
              <img 
                src={previewProfile.photo} 
                alt={previewProfile.name}
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
              
              <div className="absolute top-3 right-3">
                <div className="flex items-center gap-1.5 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">{previewProfile.compatibilityScore}%</span>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 text-background">
                <h3 className="text-2xl font-bold">{previewProfile.name}, {previewProfile.age}</h3>
                <div className="flex items-center gap-1.5 mt-1 opacity-90">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{previewProfile.district}</span>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <p className="text-foreground/80 leading-relaxed">{previewProfile.vision}</p>

              <div className="flex flex-wrap gap-2">
                {previewProfile.values.map((value) => (
                  <span key={value} className="kindly-chip">{value}</span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-muted-foreground font-medium">{previewProfile.involvement}</span>
                <div className="flex gap-2">
                  <button className="kindly-btn-primary flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    <span>{t.view}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="relative">
              <img src={previewProfile.photo} alt={previewProfile.name} className="w-full h-64 object-cover rounded-2xl" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent rounded-2xl" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-background">
                <h1 className="text-3xl font-bold">{previewProfile.name}, {previewProfile.age}</h1>
                <div className="flex items-center gap-2 mt-2 opacity-90">
                  <MapPin className="w-4 h-4" />
                  <span>{previewProfile.district}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {previewProfile.values.map((value) => (
                <span key={value} className="kindly-chip-primary">{value}</span>
              ))}
            </div>
            <div className="kindly-card p-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">{t.vision}</h3>
              <p className="text-foreground">{previewProfile.vision}</p>
            </div>
            <div className="kindly-card p-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">{t.custodyPreference}</h3>
              <p className="text-foreground">{previewProfile.involvement}</p>
            </div>
          </motion.div>
        )}

        <p className="text-center text-sm text-muted-foreground mt-6">{t.completeProfileToImprove}</p>
      </div>
    </div>
  );
}