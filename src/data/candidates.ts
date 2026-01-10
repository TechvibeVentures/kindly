export interface Candidate {
  id: string;
  // Basic Info
  firstName: string;
  displayName: string;
  gender: 'male' | 'female' | 'non-binary';
  age: number;
  city: string;
  country: string;
  nationality: string;
  languages: string[];
  photo: string;
  
  // About Me
  bio: string;
  lookingFor: string;
  
  // Vision & Values
  vision: string;
  values: string[];
  parentingPhilosophy: string;
  
  // Co-Parenting Preferences
  involvement: string;
  involvementFlexibility: string;
  preferredMethod: 'natural' | 'assisted' | 'open';
  openToRelocation: boolean;
  
  // Life Situation
  relationshipStatus: string;
  parentingStatus: string;
  occupation: string;
  education: string;
  financialSituation: string;
  lifestyleRhythm: string;
  familySupport: string;
  
  // Lifestyle & Health
  smoking: 'never' | 'occasionally' | 'regularly' | 'former';
  alcohol: 'never' | 'rarely' | 'socially' | 'regularly';
  exercise: 'daily' | 'several_weekly' | 'weekly' | 'occasionally' | 'rarely';
  diet: string;
  cannabis?: 'never' | 'sometimes' | 'often';
  drugs?: 'never' | 'sometimes' | 'often';
  
  // Physical (optional display)
  height?: number; // in cm
  weight?: number; // in kg
  
  // Additional Info
  religion?: string;
  politics?: string;
  ethnicity?: string;
  starSign?: string;
  pets?: string;
  
  // Compatibility
  compatibilityScore: number;
}

export const candidates: Candidate[] = [
  {
    id: "1",
    firstName: "Lukas",
    displayName: "Lukas",
    gender: "male",
    age: 35,
    city: "Zurich",
    country: "Switzerland",
    nationality: "Swiss",
    languages: ["German", "English", "French"],
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face",
    bio: "Software engineer with a passion for the outdoors. I value meaningful conversations and believe in building strong foundations.",
    lookingFor: "A like-minded partner for intentional co-parenting based on mutual respect and shared values.",
    vision: "I dream of raising a curious, kind child in a collaborative partnership built on mutual respect and shared values.",
    values: ["Stability", "Education", "Nature", "Communication"],
    parentingPhilosophy: "Attachment-based parenting with clear boundaries. I believe in fostering independence while providing emotional security.",
    involvement: "50/50 custody",
    involvementFlexibility: "Open to discussion based on practical needs",
    preferredMethod: "open",
    openToRelocation: false,
    relationshipStatus: "Single",
    parentingStatus: "No children yet",
    occupation: "Software Engineer",
    education: "Master's in Computer Science",
    financialSituation: "Stable income, own apartment, prepared for childcare costs",
    lifestyleRhythm: "Structured weekdays, flexible weekends. Early riser who values routine but makes room for spontaneity.",
    familySupport: "Close relationship with parents and siblings nearby",
    smoking: "never",
    alcohol: "socially",
    exercise: "several_weekly",
    diet: "Balanced, mostly home-cooked meals",
    height: 182,
    compatibilityScore: 92
  },
  {
    id: "2",
    firstName: "Marco",
    displayName: "Marco",
    gender: "male",
    age: 38,
    city: "Berlin",
    country: "Germany",
    nationality: "German-Italian",
    languages: ["German", "English", "Italian"],
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face",
    bio: "Architect and creative thinker. I find joy in designing spaces and experiences that nurture growth and wellbeing.",
    lookingFor: "Someone who shares my vision of raising a child with creativity, health, and balance at the core.",
    vision: "Creating a nurturing home where a child can explore their passions while feeling completely secure and loved.",
    values: ["Creativity", "Health", "Balance", "Kindness"],
    parentingPhilosophy: "Montessori-inspired approach. I believe children learn best through exploration and hands-on experiences.",
    involvement: "60/40 custody",
    involvementFlexibility: "Flexible - happy to adjust based on child's needs",
    preferredMethod: "open",
    openToRelocation: true,
    relationshipStatus: "Single",
    parentingStatus: "No children yet",
    occupation: "Architect",
    education: "Master's in Architecture",
    financialSituation: "Self-employed with steady client base, good savings",
    lifestyleRhythm: "Active lifestyle with hiking and swimming. Calm evenings focused on quality time.",
    familySupport: "Parents live nearby, supportive extended family",
    smoking: "never",
    alcohol: "rarely",
    exercise: "daily",
    diet: "Mediterranean, mostly plant-based",
    height: 178,
    compatibilityScore: 88
  },
  {
    id: "3",
    firstName: "Emma",
    displayName: "Emma",
    gender: "female",
    age: 34,
    city: "London",
    country: "United Kingdom",
    nationality: "British",
    languages: ["English", "Spanish"],
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&crop=face",
    bio: "Documentary filmmaker with a love for storytelling and human connection. Ready to write the most important story of my life.",
    lookingFor: "A thoughtful co-parent who values openness, adventure, and raising children with a global perspective.",
    vision: "Building a loving, unconventional family where every member feels valued and supported in their growth.",
    values: ["Openness", "Adventure", "Learning", "Humor"],
    parentingPhilosophy: "Democratic parenting style. I value involving children in age-appropriate decisions.",
    involvement: "50/50 custody",
    involvementFlexibility: "Very flexible - open to whatever works best",
    preferredMethod: "assisted",
    openToRelocation: true,
    relationshipStatus: "Single",
    parentingStatus: "No children yet",
    occupation: "Documentary Filmmaker",
    education: "BA in Film Studies",
    financialSituation: "Variable income but stable, good savings, freelance flexibility",
    lifestyleRhythm: "Balanced mix of social activities and quiet home time. Night owl but adaptable.",
    familySupport: "Small family, close friends are like extended family",
    smoking: "never",
    alcohol: "socially",
    exercise: "weekly",
    diet: "Flexitarian",
    height: 168,
    compatibilityScore: 90
  },
  {
    id: "4",
    firstName: "Thomas",
    displayName: "Thomas",
    gender: "male",
    age: 40,
    city: "Amsterdam",
    country: "Netherlands",
    nationality: "Dutch",
    languages: ["Dutch", "English", "German"],
    photo: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=500&fit=crop&crop=face",
    bio: "Financial consultant who has reached a point where career success means less than personal fulfillment. Ready for fatherhood.",
    lookingFor: "An engaged, present co-parent who wants to design a stable, intentional parenting partnership.",
    vision: "I want to be an engaged, present father who helps raise a child to be confident, compassionate, and curious.",
    values: ["Integrity", "Family", "Growth", "Sustainability"],
    parentingPhilosophy: "Gentle parenting with emphasis on emotional intelligence and natural consequences.",
    involvement: "50/50 custody",
    involvementFlexibility: "Prefer equal involvement but can discuss",
    preferredMethod: "natural",
    openToRelocation: false,
    relationshipStatus: "Divorced",
    parentingStatus: "No children",
    occupation: "Financial Consultant",
    education: "MBA",
    financialSituation: "Excellent financial stability, own home",
    lifestyleRhythm: "Organized and structured during week, nature-focused weekends.",
    familySupport: "Good relationship with family, supportive network",
    smoking: "never",
    alcohol: "rarely",
    exercise: "several_weekly",
    diet: "Balanced, health-conscious",
    height: 185,
    compatibilityScore: 91
  },
  {
    id: "5",
    firstName: "Sofia",
    displayName: "Sofia",
    gender: "female",
    age: 36,
    city: "Barcelona",
    country: "Spain",
    nationality: "Spanish",
    languages: ["Spanish", "Catalan", "English", "French"],
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&crop=face",
    bio: "Pediatric nurse with a deep understanding of child development. My career prepared me for the most meaningful role of all.",
    lookingFor: "A partner who values wellness, community, and equal partnership in raising our child.",
    vision: "Raising a child together as true partners, sharing the joys and challenges equally.",
    values: ["Partnership", "Respect", "Wellness", "Community"],
    parentingPhilosophy: "Positive discipline approach. Focus on connection before correction.",
    involvement: "50/50 custody",
    involvementFlexibility: "Strongly prefer equal custody",
    preferredMethod: "assisted",
    openToRelocation: true,
    relationshipStatus: "Single",
    parentingStatus: "No children yet",
    occupation: "Pediatric Nurse",
    education: "BSc Nursing, Pediatric Specialization",
    financialSituation: "Good salary, comprehensive benefits including parental leave",
    lifestyleRhythm: "Active mornings, creative evenings. Love cooking and outdoor activities.",
    familySupport: "Large extended family, very involved grandparents potential",
    smoking: "never",
    alcohol: "rarely",
    exercise: "daily",
    diet: "Mediterranean diet",
    height: 165,
    compatibilityScore: 93
  },
  {
    id: "6",
    firstName: "Jonas",
    displayName: "Jonas",
    gender: "male",
    age: 34,
    city: "Copenhagen",
    country: "Denmark",
    nationality: "Danish",
    languages: ["Danish", "English", "Swedish"],
    photo: "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=400&h=500&fit=crop&crop=face",
    bio: "Professional musician and music teacher. I believe music opens doors to emotional expression and connection.",
    lookingFor: "Someone who appreciates creativity and wants to create a warm, stable environment for a child.",
    vision: "Creating a warm, stable environment where a child can thrive and develop their unique personality.",
    values: ["Stability", "Patience", "Education", "Music"],
    parentingPhilosophy: "Structured approach with lots of room for creative expression and music.",
    involvement: "40/60 custody",
    involvementFlexibility: "Happy to take less if schedule demands",
    preferredMethod: "open",
    openToRelocation: false,
    relationshipStatus: "Single",
    parentingStatus: "No children yet",
    occupation: "Musician & Music Teacher",
    education: "Conservatory Degree in Music",
    financialSituation: "Variable income but manageable, strong savings habit",
    lifestyleRhythm: "Evening performer but mornings free. Very present during daytime.",
    familySupport: "Close-knit family nearby",
    smoking: "never",
    alcohol: "socially",
    exercise: "weekly",
    diet: "Scandinavian, organic preference",
    height: 180,
    compatibilityScore: 82
  },
  {
    id: "7",
    firstName: "Anna",
    displayName: "Anna",
    gender: "female",
    age: 37,
    city: "Vienna",
    country: "Austria",
    nationality: "Austrian",
    languages: ["German", "English"],
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=face",
    bio: "Environmental engineer passionate about sustainability. I want to raise children who care for our planet.",
    lookingFor: "A hands-on co-parent who values nature, simplicity, and being fully present.",
    vision: "Being a hands-on parent who is fully present and engaged in every aspect of raising our child.",
    values: ["Presence", "Health", "Nature", "Simplicity"],
    parentingPhilosophy: "Nature-based parenting. I believe outdoor experiences are fundamental to healthy development.",
    involvement: "50/50 custody",
    involvementFlexibility: "Open to adjustments as child grows",
    preferredMethod: "assisted",
    openToRelocation: false,
    relationshipStatus: "Single",
    parentingStatus: "No children yet",
    occupation: "Environmental Engineer",
    education: "MSc Environmental Engineering",
    financialSituation: "Stable government job, good pension, modest lifestyle",
    lifestyleRhythm: "Early riser, active lifestyle, early bedtimes. Weekend hiking and camping.",
    familySupport: "Parents live in countryside, love visiting grandparents",
    smoking: "never",
    alcohol: "rarely",
    exercise: "daily",
    diet: "Vegetarian, mostly organic",
    height: 172,
    compatibilityScore: 87
  },
  {
    id: "8",
    firstName: "Sebastian",
    displayName: "Sebastian",
    gender: "male",
    age: 39,
    city: "Munich",
    country: "Germany",
    nationality: "German",
    languages: ["German", "English", "French"],
    photo: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=500&fit=crop&crop=face",
    bio: "Physician with a passion for cultural experiences. I believe in building families on trust and clear communication.",
    lookingFor: "A collaborative partner for intentional co-parenting built on trust and shared commitment.",
    vision: "A collaborative parenting partnership built on trust, clear communication, and shared commitment.",
    values: ["Trust", "Communication", "Balance", "Culture"],
    parentingPhilosophy: "Research-based parenting combining best practices from different approaches.",
    involvement: "50/50 custody",
    involvementFlexibility: "Prefer 50/50 but flexible for right situation",
    preferredMethod: "natural",
    openToRelocation: true,
    relationshipStatus: "Single",
    parentingStatus: "No children yet",
    occupation: "Physician",
    education: "MD, Medical Specialty",
    financialSituation: "Very stable income, comprehensive healthcare knowledge",
    lifestyleRhythm: "Structured work week, cultural activities on weekends. Theater, museums, travel.",
    familySupport: "International family background, relatives in multiple countries",
    smoking: "never",
    alcohol: "socially",
    exercise: "several_weekly",
    diet: "Balanced, enjoys cooking",
    height: 183,
    compatibilityScore: 91
  },
  {
    id: "9",
    firstName: "Clara",
    displayName: "Clara",
    gender: "female",
    age: 32,
    city: "Paris",
    country: "France",
    nationality: "French",
    languages: ["French", "English", "Italian"],
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face",
    bio: "Physical therapist with my own practice. I'm drawn to play-based learning and creating joyful family experiences.",
    lookingFor: "A co-parent who shares my love for playfulness, education, and creating a loving environment.",
    vision: "Raising a child in a loving, playful environment with strong values and lots of laughter.",
    values: ["Joy", "Playfulness", "Education", "Family"],
    parentingPhilosophy: "Play-based learning with emphasis on emotional regulation and social skills.",
    involvement: "60/40 custody",
    involvementFlexibility: "Very flexible and accommodating",
    preferredMethod: "assisted",
    openToRelocation: true,
    relationshipStatus: "Single",
    parentingStatus: "No children yet",
    occupation: "Physical Therapist",
    education: "Doctorate in Physical Therapy",
    financialSituation: "Growing practice, stable income, flexible hours",
    lifestyleRhythm: "Energetic and active, always up for adventures but respects rest time.",
    familySupport: "Large family, many cousins for potential playmates",
    smoking: "never",
    alcohol: "socially",
    exercise: "daily",
    diet: "French cuisine with healthy balance",
    height: 167,
    compatibilityScore: 89
  },
  {
    id: "10",
    firstName: "Raphael",
    displayName: "Raphael",
    gender: "male",
    age: 41,
    city: "Geneva",
    country: "Switzerland",
    nationality: "Swiss-French",
    languages: ["French", "English", "German", "Italian"],
    photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=500&fit=crop&crop=face",
    bio: "International business consultant with a global perspective. Ready to establish roots and share cultural richness with a child.",
    lookingFor: "Someone open to international lifestyle while committed to providing stability and support.",
    vision: "Providing a child with every opportunity to explore their interests while feeling unconditionally loved.",
    values: ["Support", "Excellence", "Culture", "Travel"],
    parentingPhilosophy: "Encouraging autonomy and curiosity. Every question deserves a thoughtful answer.",
    involvement: "40/60 custody",
    involvementFlexibility: "Flexible due to travel schedule",
    preferredMethod: "open",
    openToRelocation: true,
    relationshipStatus: "Single",
    parentingStatus: "No children yet",
    occupation: "International Business Consultant",
    education: "MBA, International Business",
    financialSituation: "High income, excellent benefits, can afford quality childcare",
    lifestyleRhythm: "International lifestyle but committed to establishing stable home base.",
    familySupport: "Small family, partner's family would become important support",
    smoking: "former",
    alcohol: "socially",
    exercise: "weekly",
    diet: "International cuisine, health-conscious",
    height: 179,
    compatibilityScore: 79
  },
  {
    id: "11",
    firstName: "Adrian",
    displayName: "Adrian",
    gender: "male",
    age: 35,
    city: "Stockholm",
    country: "Sweden",
    nationality: "Swedish",
    languages: ["Swedish", "English", "Norwegian"],
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=500&fit=crop&crop=face",
    bio: "Psychologist focused on mindfulness and emotional wellness. I bring presence and attunement to all my relationships.",
    lookingFor: "An equally invested partner who values mindfulness, growth, and emotional connection.",
    vision: "Building a family based on partnership, where both parents are equally invested and present.",
    values: ["Equality", "Mindfulness", "Growth", "Connection"],
    parentingPhilosophy: "Mindful parenting with focus on presence and emotional attunement.",
    involvement: "50/50 custody",
    involvementFlexibility: "Strongly committed to equal involvement",
    preferredMethod: "natural",
    openToRelocation: false,
    relationshipStatus: "Single",
    parentingStatus: "No children yet",
    occupation: "Psychologist",
    education: "PhD in Psychology",
    financialSituation: "Stable income, flexible schedule, work from home possible",
    lifestyleRhythm: "Balanced lifestyle with meditation practice, yoga, and quality family time.",
    familySupport: "Parents nearby, very involved potential grandparents",
    smoking: "never",
    alcohol: "rarely",
    exercise: "daily",
    diet: "Mostly plant-based, mindful eating",
    height: 181,
    compatibilityScore: 93
  },
  {
    id: "12",
    firstName: "Mia",
    displayName: "Mia",
    gender: "female",
    age: 36,
    city: "Oslo",
    country: "Norway",
    nationality: "Norwegian",
    languages: ["Norwegian", "English", "Swedish"],
    photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop&crop=face",
    bio: "Creative director who values freedom and responsibility equally. I believe in unconditional acceptance and creative expression.",
    lookingFor: "A co-parent who believes in acceptance, creativity, and allowing children to become who they're meant to be.",
    vision: "Co-creating a nurturing environment where our child feels safe to become whoever they want to be.",
    values: ["Acceptance", "Creativity", "Freedom", "Responsibility"],
    parentingPhilosophy: "Unconditional acceptance with age-appropriate boundaries and natural consequences.",
    involvement: "50/50 custody",
    involvementFlexibility: "Open to discussion but prefer equal time",
    preferredMethod: "assisted",
    openToRelocation: true,
    relationshipStatus: "Single",
    parentingStatus: "No children yet",
    occupation: "Creative Director",
    education: "BFA Graphic Design",
    financialSituation: "Good income from agency work and freelance projects",
    lifestyleRhythm: "Creative professional with flexible schedule, values work-life balance.",
    familySupport: "Supportive family, strong community connections",
    smoking: "never",
    alcohol: "socially",
    exercise: "several_weekly",
    diet: "Nordic cuisine, local and seasonal",
    height: 170,
    compatibilityScore: 88
  },
  {
    id: "13",
    firstName: "Nico",
    displayName: "Nico",
    gender: "male",
    age: 34,
    city: "Milan",
    country: "Italy",
    nationality: "Italian",
    languages: ["Italian", "English", "Spanish"],
    photo: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400&h=500&fit=crop&crop=face",
    bio: "Chef passionate about slow food and slow living. I want to raise grounded children with strong roots and wings to explore.",
    lookingFor: "Someone who values simplicity, kindness, and letting children develop at their own pace.",
    vision: "Raising a grounded, curious child with strong roots and wings to explore the world.",
    values: ["Roots", "Adventure", "Kindness", "Simplicity"],
    parentingPhilosophy: "Slow parenting - letting children develop at their own pace without over-scheduling.",
    involvement: "50/50 custody",
    involvementFlexibility: "Flexible and easy-going",
    preferredMethod: "natural",
    openToRelocation: false,
    relationshipStatus: "Single",
    parentingStatus: "No children yet",
    occupation: "Chef",
    education: "Culinary Institute",
    financialSituation: "Modest but stable income, very low expenses",
    lifestyleRhythm: "Relaxed pace of life, values quality over quantity in all things.",
    familySupport: "Multi-generational household with grandmother nearby",
    smoking: "never",
    alcohol: "socially",
    exercise: "weekly",
    diet: "Italian cuisine, farm-to-table",
    height: 175,
    compatibilityScore: 81
  },
  {
    id: "14",
    firstName: "Oliver",
    displayName: "Oliver",
    gender: "male",
    age: 38,
    city: "Edinburgh",
    country: "United Kingdom",
    nationality: "British",
    languages: ["English", "German"],
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop&crop=face",
    bio: "University professor who believes in evidence-based approaches to everything, including parenting.",
    lookingFor: "A thoughtful partner focused on giving our child the best possible foundation for life.",
    vision: "A thoughtful partnership focused on giving our child the best possible foundation for life.",
    values: ["Foundation", "Education", "Health", "Planning"],
    parentingPhilosophy: "Evidence-based parenting with focus on cognitive and emotional development.",
    involvement: "50/50 custody",
    involvementFlexibility: "Prefer structured arrangement",
    preferredMethod: "assisted",
    openToRelocation: true,
    relationshipStatus: "Single",
    parentingStatus: "No children yet",
    occupation: "University Professor",
    education: "PhD, Academic Research",
    financialSituation: "Stable academic salary, sabbatical options, good work-life balance",
    lifestyleRhythm: "Organized and structured, believes routine provides security for children.",
    familySupport: "Parents supportive but not nearby",
    smoking: "never",
    alcohol: "rarely",
    exercise: "several_weekly",
    diet: "Balanced, health-conscious",
    height: 180,
    compatibilityScore: 85
  },
  {
    id: "15",
    firstName: "Lena",
    displayName: "Lena",
    gender: "female",
    age: 33,
    city: "Helsinki",
    country: "Finland",
    nationality: "Finnish",
    languages: ["Finnish", "English", "Swedish"],
    photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop&crop=face",
    bio: "UX designer who creates thoughtful experiences in work and life. Home-focused and ready to create a joyful family.",
    lookingFor: "A loving co-parent who values security, joy, and creating a home where a child knows they're loved.",
    vision: "Creating a joyful, secure home where our child knows they are loved exactly as they are.",
    values: ["Love", "Security", "Joy", "Authenticity"],
    parentingPhilosophy: "Attachment parenting principles with flexibility for modern life.",
    involvement: "60/40 custody",
    involvementFlexibility: "Happy to take more responsibility",
    preferredMethod: "assisted",
    openToRelocation: false,
    relationshipStatus: "Single",
    parentingStatus: "No children yet",
    occupation: "UX Designer",
    education: "MSc Human-Computer Interaction",
    financialSituation: "Good tech salary, remote work flexibility, parental leave available",
    lifestyleRhythm: "Home-focused, loves cooking, sauna culture, and creating cozy spaces.",
    familySupport: "Very close family, parents eager to be grandparents",
    smoking: "never",
    alcohol: "rarely",
    exercise: "several_weekly",
    diet: "Nordic, seasonal eating",
    height: 169,
    compatibilityScore: 94
  }
];

export const countries = [
  "Austria", "Belgium", "Denmark", "Finland", "France", "Germany", 
  "Ireland", "Italy", "Netherlands", "Norway", "Portugal", "Spain", 
  "Sweden", "Switzerland", "United Kingdom", "United States", "Canada",
  "Australia", "New Zealand"
];

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

export const smokingLabels: Record<string, string> = {
  never: 'Non-smoker',
  occasionally: 'Occasionally',
  regularly: 'Smoker',
  former: 'Former smoker'
};

export const alcoholLabels: Record<string, string> = {
  never: 'Never drinks',
  rarely: 'Rarely',
  socially: 'Socially',
  regularly: 'Regularly'
};

export const exerciseLabels: Record<string, string> = {
  daily: 'Daily',
  several_weekly: 'Several times a week',
  weekly: 'Weekly',
  occasionally: 'Occasionally',
  rarely: 'Rarely'
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

export const dietLabels: Record<string, string> = {
  omnivore: 'Omnivore',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  pescatarian: 'Pescatarian',
  flexitarian: 'Flexitarian',
  keto: 'Keto',
  halal: 'Halal',
  kosher: 'Kosher'
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
