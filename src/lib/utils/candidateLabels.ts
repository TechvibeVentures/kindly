/**
 * Label mappings for candidate fields
 * Extracted from candidates.ts for reuse
 */

export const exerciseLabels: Record<string, string> = {
  daily: 'Daily',
  several_weekly: 'Several times a week',
  weekly: 'Weekly',
  occasionally: 'Occasionally',
  rarely: 'Rarely'
};

export const alcoholLabels: Record<string, string> = {
  never: 'Never drinks',
  rarely: 'Rarely',
  socially: 'Socially',
  regularly: 'Regularly'
};

export const smokingLabels: Record<string, string> = {
  never: 'Non-smoker',
  occasionally: 'Occasionally',
  regularly: 'Smoker',
  former: 'Former smoker'
};

export const cannabisLabels: Record<string, string> = {
  never: 'Never',
  sometimes: 'Sometimes',
  often: 'Frequently'
};

export const drugsLabels: Record<string, string> = {
  never: 'Never',
  sometimes: 'Sometimes',
  often: 'Frequently'
};

export const religionLabels: Record<string, string> = {
  agnostic: 'Agnostic',
  atheist: 'Atheist',
  buddhist: 'Buddhist',
  christian: 'Christian',
  hindu: 'Hindu',
  jewish: 'Jewish',
  muslim: 'Muslim',
  spiritual: 'Spiritual',
  other: 'Other'
};

export const politicsLabels: Record<string, string> = {
  liberal: 'Liberal',
  moderate: 'Moderate',
  conservative: 'Conservative',
  apolitical: 'Not political',
  other: 'Other'
};

export const ethnicityLabels: Record<string, string> = {
  asian: 'Asian',
  black: 'Black',
  caucasian: 'White/Caucasian',
  hispanic: 'Hispanic/Latino',
  'middle-eastern': 'Middle Eastern',
  mixed: 'Mixed',
  'south-asian': 'South Asian',
  other: 'Other'
};

export const starSignLabels: Record<string, string> = {
  aries: 'Aries',
  taurus: 'Taurus',
  gemini: 'Gemini',
  cancer: 'Cancer',
  leo: 'Leo',
  virgo: 'Virgo',
  libra: 'Libra',
  scorpio: 'Scorpio',
  sagittarius: 'Sagittarius',
  capricorn: 'Capricorn',
  aquarius: 'Aquarius',
  pisces: 'Pisces'
};

export const petsLabels: Record<string, string> = {
  dog: 'Dog',
  cat: 'Cat',
  fish: 'Fish',
  bird: 'Bird',
  other: 'Other',
  none: 'No pets',
  allergic: 'Allergic'
};

export const allLanguages = [
  "English", "German", "French", "Spanish", "Italian", "Dutch",
  "Portuguese", "Swedish", "Norwegian", "Danish", "Finnish",
  "Polish", "Russian", "Mandarin", "Japanese", "Korean", "Arabic"
];

export const allValues = [
  "Stability", "Education", "Nature", "Communication", "Creativity", 
  "Health", "Balance", "Kindness", "Openness", "Adventure", "Learning", 
  "Humor", "Integrity", "Family", "Growth", "Sustainability", "Partnership", 
  "Respect", "Wellness", "Community", "Patience", "Music", "Presence", 
  "Simplicity", "Trust", "Culture", "Joy", "Playfulness", "Support", 
  "Excellence", "Travel", "Equality", "Mindfulness", "Connection", 
  "Acceptance", "Freedom", "Responsibility", "Roots", "Love", "Security", 
  "Authenticity", "Foundation", "Planning"
];

export const involvementOptions = [
  "40/60 custody",
  "50/50 custody",
  "60/40 custody"
];

export const genderOptions = [
  { value: 'male', label: 'Men' },
  { value: 'female', label: 'Women' },
  { value: 'non-binary', label: 'Non-binary' }
];

export const methodOptions = [
  { value: 'natural', label: 'Natural conception' },
  { value: 'assisted', label: 'Assisted reproduction' },
  { value: 'open', label: 'Open to discuss' }
];


