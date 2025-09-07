import { PersonalityProfile, CompatibilityBreakdown, QuestionnaireResponse } from '@/types';

// Questionnaire configuration with psychology-based questions
export const QUESTIONNAIRE_DATA = {
  personality: [
    {
      id: 'p1',
      question: 'I see myself as someone who is talkative and outgoing.',
      category: 'personality' as const,
      type: 'scale' as const,
      scaleMin: 1,
      scaleMax: 7,
      scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' },
      trait: 'extraversion',
      reverse: false,
      weight: 1.0
    },
    {
      id: 'p2',
      question: 'I see myself as someone who tends to find fault with others.',
      category: 'personality' as const,
      type: 'scale' as const,
      scaleMin: 1,
      scaleMax: 7,
      scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' },
      trait: 'agreeableness',
      reverse: true,
      weight: 1.0
    },
    {
      id: 'p3',
      question: 'I see myself as someone who does a thorough job.',
      category: 'personality' as const,
      type: 'scale' as const,
      scaleMin: 1,
      scaleMax: 7,
      scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' },
      trait: 'conscientiousness',
      reverse: false,
      weight: 1.0
    },
    {
      id: 'p4',
      question: 'I see myself as someone who gets nervous easily.',
      category: 'personality' as const,
      type: 'scale' as const,
      scaleMin: 1,
      scaleMax: 7,
      scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' },
      trait: 'neuroticism',
      reverse: false,
      weight: 1.0
    },
    {
      id: 'p5',
      question: 'I see myself as someone who has an active imagination.',
      category: 'personality' as const,
      type: 'scale' as const,
      scaleMin: 1,
      scaleMax: 7,
      scaleLabels: { min: 'Strongly Disagree', max: 'Strongly Agree' },
      trait: 'openness',
      reverse: false,
      weight: 1.0
    }
  ],
  values: [
    {
      id: 'v1',
      question: 'How important is financial security to you?',
      category: 'values' as const,
      type: 'scale' as const,
      scaleMin: 1,
      scaleMax: 10,
      scaleLabels: { min: 'Not Important', max: 'Extremely Important' },
      valueType: 'security',
      weight: 1.0
    },
    {
      id: 'v2',
      question: 'How important is personal growth and self-improvement?',
      category: 'values' as const,
      type: 'scale' as const,
      scaleMin: 1,
      scaleMax: 10,
      scaleLabels: { min: 'Not Important', max: 'Extremely Important' },
      valueType: 'growth',
      weight: 1.0
    },
    {
      id: 'v3',
      question: 'How important is having close family relationships?',
      category: 'values' as const,
      type: 'scale' as const,
      scaleMin: 1,
      scaleMax: 10,
      scaleLabels: { min: 'Not Important', max: 'Extremely Important' },
      valueType: 'family',
      weight: 1.0
    }
  ],
  communication: [
    {
      id: 'c1',
      question: 'When discussing disagreements, I prefer to:',
      category: 'communication' as const,
      type: 'multiple_choice' as const,
      options: [
        'Address issues directly and immediately',
        'Take time to think before discussing',
        'Focus on finding common ground',
        'Express feelings openly during discussion'
      ],
      communicationStyle: ['direct', 'analytical', 'diplomatic', 'expressive'],
      weight: 1.0
    },
    {
      id: 'c2',
      question: 'In conversations, I tend to:',
      category: 'communication' as const,
      type: 'multiple_choice' as const,
      options: [
        'Listen more than I speak',
        'Share personal experiences',
        'Ask lots of questions',
        'Focus on facts and logic'
      ],
      communicationStyle: ['diplomatic', 'expressive', 'diplomatic', 'analytical'],
      weight: 1.0
    }
  ],
  lifestyle: [
    {
      id: 'l1',
      question: 'Your ideal weekend would be:',
      category: 'lifestyle' as const,
      type: 'multiple_choice' as const,
      options: [
        'Quiet time at home with a good book',
        'Out socializing with friends',
        'Trying a new adventure or activity',
        'Working on personal projects'
      ],
      lifestyleType: ['introverted', 'extraverted', 'adventurous', 'productive'],
      weight: 1.0
    }
  ]
};

// Convert questionnaire responses to personality profile
export function generatePersonalityProfile(responses: QuestionnaireResponse[]): PersonalityProfile {
  // Initialize traits
  const traits = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0,
    emotionalIntelligence: 0
  };

  const traitCounts = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0,
    emotionalIntelligence: 0
  };

  // Process personality questions
  responses.forEach(response => {
    const question = [...QUESTIONNAIRE_DATA.personality].find(q => q.id === response.questionId);
    if (question && typeof response.response === 'number') {
      let score = response.response;
      
      // Reverse scoring if needed
      if (question.reverse) {
        score = 8 - score; // For 1-7 scale
      }
      
      // Convert to 0-100 scale
      const normalizedScore = ((score - 1) / 6) * 100;
      
      traits[question.trait as keyof typeof traits] += normalizedScore;
      traitCounts[question.trait as keyof typeof traitCounts]++;
    }
  });

  // Average the traits
  Object.keys(traits).forEach(trait => {
    const count = traitCounts[trait as keyof typeof traitCounts];
    if (count > 0) {
      traits[trait as keyof typeof traits] = traits[trait as keyof typeof traits] / count;
    }
  });

  // Determine communication style and other attributes
  const communicationResponses = responses.filter(r => 
    QUESTIONNAIRE_DATA.communication.some(q => q.id === r.questionId)
  );
  
  const communicationStyle = determineCommunicationStyle(communicationResponses);
  const conflictResolution = determineConflictResolution(traits);
  const attachmentStyle = determineAttachmentStyle(traits);

  // Extract values and lifestyle preferences
  const coreValues = extractCoreValues(responses);
  const lifestylePreferences = extractLifestylePreferences(responses);
  const relationshipGoals = ['long-term relationship', 'emotional intimacy', 'mutual growth'];

  // Create vectors for compatibility calculation
  const personalityVector = [
    traits.openness,
    traits.conscientiousness,
    traits.extraversion,
    traits.agreeableness,
    traits.neuroticism,
    traits.emotionalIntelligence
  ];

  const valuesVector = createValuesVector(responses);

  return {
    ...traits,
    communicationStyle,
    conflictResolution,
    attachmentStyle,
    coreValues,
    lifestylePreferences,
    relationshipGoals,
    personalityVector,
    valuesVector
  };
}

// Calculate compatibility between two personality profiles
export function calculateCompatibility(
  profile1: PersonalityProfile,
  profile2: PersonalityProfile
): CompatibilityBreakdown {
  
  // Personality compatibility using cosine similarity
  const personalityScore = cosineSimilarity(profile1.personalityVector, profile2.personalityVector);
  
  // Values compatibility
  const valuesScore = cosineSimilarity(profile1.valuesVector, profile2.valuesVector);
  
  // Communication compatibility
  const communicationScore = calculateCommunicationCompatibility(
    profile1.communicationStyle,
    profile2.communicationStyle
  );
  
  // Lifestyle compatibility
  const lifestyleScore = calculateLifestyleCompatibility(
    profile1.lifestylePreferences,
    profile2.lifestylePreferences
  );
  
  // Emotional compatibility based on attachment styles and EI
  const emotionalCompatibility = calculateEmotionalCompatibility(profile1, profile2);
  
  // Conflict resolution compatibility
  const conflictResolutionCompatibility = calculateConflictResolutionCompatibility(
    profile1.conflictResolution,
    profile2.conflictResolution
  );
  
  // Weighted overall score
  const overall = Math.round(
    (personalityScore * 0.25) +
    (valuesScore * 0.25) +
    (communicationScore * 0.20) +
    (lifestyleScore * 0.15) +
    (emotionalCompatibility * 0.10) +
    (conflictResolutionCompatibility * 0.05)
  );

  // Generate insights
  const strengths = generateCompatibilityStrengths(profile1, profile2, {
    personality: personalityScore,
    values: valuesScore,
    communication: communicationScore,
    lifestyle: lifestyleScore
  });

  const potentialChallenges = generateCompatibilityChallenges(profile1, profile2, {
    personality: personalityScore,
    values: valuesScore,
    communication: communicationScore,
    lifestyle: lifestyleScore
  });

  const tips = generateCompatibilityTips(profile1, profile2);

  return {
    overall,
    personality: Math.round(personalityScore),
    values: Math.round(valuesScore),
    communication: Math.round(communicationScore),
    lifestyle: Math.round(lifestyleScore),
    emotionalCompatibility: Math.round(emotionalCompatibility),
    conflictResolutionCompatibility: Math.round(conflictResolutionCompatibility),
    strengths,
    potentialChallenges,
    tips
  };
}

// Helper functions
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  
  return (dotProduct / (magnitudeA * magnitudeB)) * 100;
}

function determineCommunicationStyle(responses: QuestionnaireResponse[]): 'direct' | 'diplomatic' | 'expressive' | 'analytical' {
  // Simple logic - in real implementation, this would be more sophisticated
  const styles = ['direct', 'diplomatic', 'expressive', 'analytical'] as const;
  return styles[Math.floor(Math.random() * styles.length)];
}

function determineConflictResolution(traits: any): 'collaborative' | 'competitive' | 'accommodating' | 'avoiding' {
  if (traits.agreeableness > 70 && traits.extraversion > 60) return 'collaborative';
  if (traits.agreeableness < 40 && traits.extraversion > 60) return 'competitive';
  if (traits.agreeableness > 70 && traits.extraversion < 50) return 'accommodating';
  return 'avoiding';
}

function determineAttachmentStyle(traits: any): 'secure' | 'anxious' | 'avoidant' | 'disorganized' {
  if (traits.neuroticism < 40 && traits.agreeableness > 60) return 'secure';
  if (traits.neuroticism > 70 && traits.extraversion > 50) return 'anxious';
  if (traits.neuroticism < 50 && traits.extraversion < 40) return 'avoidant';
  return 'disorganized';
}

function extractCoreValues(responses: QuestionnaireResponse[]): string[] {
  const values = ['authenticity', 'growth', 'security', 'family', 'creativity'];
  return values.slice(0, 3); // Return top 3 values
}

function extractLifestylePreferences(responses: QuestionnaireResponse[]): string[] {
  const preferences = ['active', 'social', 'intellectual', 'creative', 'peaceful'];
  return preferences.slice(0, 3); // Return top 3 preferences
}

function createValuesVector(responses: QuestionnaireResponse[]): number[] {
  // Create a vector representing core values
  const valueCategories = ['security', 'growth', 'family', 'creativity', 'achievement'];
  return valueCategories.map(category => {
    // Find responses related to this value category
    const relatedResponse = responses.find(r => 
      QUESTIONNAIRE_DATA.values.some(q => q.id === r.questionId && q.valueType === category)
    );
    return relatedResponse ? Number(relatedResponse.response) * 10 : 50; // Default to 50 if no response
  });
}

function calculateCommunicationCompatibility(style1: string, style2: string): number {
  const compatibilityMatrix: { [key: string]: { [key: string]: number } } = {
    direct: { direct: 85, diplomatic: 60, expressive: 70, analytical: 75 },
    diplomatic: { direct: 60, diplomatic: 90, expressive: 80, analytical: 65 },
    expressive: { direct: 70, diplomatic: 80, expressive: 85, analytical: 55 },
    analytical: { direct: 75, diplomatic: 65, expressive: 55, analytical: 90 }
  };
  
  return compatibilityMatrix[style1]?.[style2] || 50;
}

function calculateLifestyleCompatibility(preferences1: string[], preferences2: string[]): number {
  const commonPreferences = preferences1.filter(pref => preferences2.includes(pref));
  const compatibilityScore = (commonPreferences.length / Math.max(preferences1.length, preferences2.length)) * 100;
  return Math.max(30, compatibilityScore); // Minimum 30% compatibility
}

function calculateEmotionalCompatibility(profile1: PersonalityProfile, profile2: PersonalityProfile): number {
  // Secure attachment is most compatible with any style
  if (profile1.attachmentStyle === 'secure' || profile2.attachmentStyle === 'secure') {
    return 85;
  }
  
  // Anxious and avoidant can be challenging but workable
  if ((profile1.attachmentStyle === 'anxious' && profile2.attachmentStyle === 'avoidant') ||
      (profile1.attachmentStyle === 'avoidant' && profile2.attachmentStyle === 'anxious')) {
    return 60;
  }
  
  // Same styles can work well
  if (profile1.attachmentStyle === profile2.attachmentStyle) {
    return 75;
  }
  
  return 65; // Default compatibility
}

function calculateConflictResolutionCompatibility(style1: string, style2: string): number {
  const compatibilityMatrix: { [key: string]: { [key: string]: number } } = {
    collaborative: { collaborative: 95, competitive: 50, accommodating: 80, avoiding: 60 },
    competitive: { collaborative: 50, competitive: 40, accommodating: 70, avoiding: 30 },
    accommodating: { collaborative: 80, competitive: 70, accommodating: 85, avoiding: 75 },
    avoiding: { collaborative: 60, competitive: 30, accommodating: 75, avoiding: 70 }
  };
  
  return compatibilityMatrix[style1]?.[style2] || 50;
}

function generateCompatibilityStrengths(
  profile1: PersonalityProfile, 
  profile2: PersonalityProfile,
  scores: { personality: number; values: number; communication: number; lifestyle: number }
): string[] {
  const strengths: string[] = [];
  
  if (scores.personality > 75) {
    strengths.push('Strong personality alignment creates natural understanding');
  }
  
  if (scores.values > 75) {
    strengths.push('Shared core values provide solid relationship foundation');
  }
  
  if (scores.communication > 75) {
    strengths.push('Compatible communication styles foster clear dialogue');
  }
  
  if (scores.lifestyle > 75) {
    strengths.push('Similar lifestyle preferences enable shared activities');
  }
  
  // Add specific strengths based on profiles
  if (profile1.attachmentStyle === 'secure' || profile2.attachmentStyle === 'secure') {
    strengths.push('Secure attachment style promotes relationship stability');
  }
  
  return strengths.slice(0, 4); // Limit to top 4 strengths
}

function generateCompatibilityChallenges(
  profile1: PersonalityProfile, 
  profile2: PersonalityProfile,
  scores: { personality: number; values: number; communication: number; lifestyle: number }
): string[] {
  const challenges: string[] = [];
  
  if (scores.communication < 60) {
    challenges.push('Different communication styles may require extra understanding');
  }
  
  if (Math.abs(profile1.extraversion - profile2.extraversion) > 40) {
    challenges.push('Different energy levels might need conscious balancing');
  }
  
  if (profile1.conflictResolution !== profile2.conflictResolution) {
    challenges.push('Different conflict resolution styles may need attention');
  }
  
  return challenges.slice(0, 3); // Limit to top 3 challenges
}

function generateCompatibilityTips(profile1: PersonalityProfile, profile2: PersonalityProfile): string[] {
  const tips: string[] = [
    'Focus on shared values when navigating differences',
    'Practice active listening to understand each other\'s perspectives',
    'Celebrate your complementary strengths',
    'Be patient with different communication styles'
  ];
  
  // Add specific tips based on profiles
  if (profile1.communicationStyle !== profile2.communicationStyle) {
    tips.push('Discuss your communication preferences openly');
  }
  
  return tips.slice(0, 4); // Limit to top 4 tips
}