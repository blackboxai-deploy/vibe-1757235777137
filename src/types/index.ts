// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  age?: number;
  location?: string;
  bio?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
  isProfileComplete: boolean;
  isQuestionnairComplete: boolean;
  personalityProfile?: PersonalityProfile;
  preferences: UserPreferences;
  privacySettings: PrivacySettings;
}

export interface UserPreferences {
  ageRange: {
    min: number;
    max: number;
  };
  maxDistance: number;
  relationshipType: 'romantic' | 'friendship' | 'professional' | 'any';
  genderPreference: string[];
  compatibilityThreshold: number;
}

export interface PrivacySettings {
  showAge: boolean;
  showLocation: boolean;
  showLastActive: boolean;
  allowMessages: 'matches' | 'verified' | 'anyone';
  visibilityMode: 'public' | 'limited' | 'private';
}

// Questionnaire and Psychology Types
export interface QuestionnaireQuestion {
  id: string;
  category: QuestionCategory;
  question: string;
  type: 'scale' | 'multiple_choice' | 'ranking' | 'boolean';
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: { min: string; max: string };
  required: boolean;
  weight: number;
}

export type QuestionCategory = 
  | 'personality' 
  | 'values' 
  | 'communication' 
  | 'lifestyle' 
  | 'relationship_goals' 
  | 'emotional_intelligence'
  | 'conflict_resolution';

export interface QuestionnaireResponse {
  questionId: string;
  response: number | string | string[];
  timestamp: Date;
}

export interface PersonalityProfile {
  // Big Five Personality Traits (0-100 scale)
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  
  // Additional Psychological Metrics
  emotionalIntelligence: number;
  communicationStyle: 'direct' | 'diplomatic' | 'expressive' | 'analytical';
  conflictResolution: 'collaborative' | 'competitive' | 'accommodating' | 'avoiding';
  attachmentStyle: 'secure' | 'anxious' | 'avoidant' | 'disorganized';
  
  // Values and Lifestyle
  coreValues: string[];
  lifestylePreferences: string[];
  relationshipGoals: string[];
  
  // Computed compatibility factors
  personalityVector: number[];
  valuesVector: number[];
}

// Matching and Compatibility Types
export interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  compatibilityScore: number;
  compatibilityBreakdown: CompatibilityBreakdown;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  mutualMatch: boolean;
  createdAt: Date;
  expiresAt: Date;
}

export interface CompatibilityBreakdown {
  overall: number;
  personality: number;
  values: number;
  communication: number;
  lifestyle: number;
  emotionalCompatibility: number;
  conflictResolutionCompatibility: number;
  strengths: string[];
  potentialChallenges: string[];
  tips: string[];
}

export interface MatchingPreferences {
  includePersonality: boolean;
  includeValues: boolean;
  includeCommunication: boolean;
  includeLifestyle: boolean;
  weightPersonality: number;
  weightValues: number;
  weightCommunication: number;
  weightLifestyle: number;
}

// Chat and Communication Types
export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  lastActivity: Date;
  unreadCount: { [userId: string]: number };
  isActive: boolean;
  matchId: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  readBy: { [userId: string]: Date };
  messageType: 'text' | 'image' | 'system';
  edited?: boolean;
  editedAt?: Date;
}

// Dashboard and Analytics Types
export interface UserStats {
  totalMatches: number;
  activeConversations: number;
  profileViews: number;
  compatibilityAverage: number;
  responseRate: number;
  lastActive: Date;
  memberSince: Date;
}

export interface DashboardData {
  user: User;
  stats: UserStats;
  recentMatches: Match[];
  activeConversations: Conversation[];
  compatibilityInsights: CompatibilityInsight[];
  recommendations: Recommendation[];
}

export interface CompatibilityInsight {
  type: 'strength' | 'challenge' | 'tip';
  title: string;
  description: string;
  category: QuestionCategory;
  actionable?: boolean;
}

export interface Recommendation {
  type: 'profile_improvement' | 'questionnaire_update' | 'preference_adjustment';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  action?: string;
}

// Admin and Moderation Types
export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'moderator';
  permissions: string[];
  createdAt: Date;
}

export interface ModerationReport {
  id: string;
  reporterId: string;
  reportedUserId: string;
  type: 'harassment' | 'inappropriate_content' | 'fake_profile' | 'spam' | 'other';
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  action?: 'warning' | 'temporary_ban' | 'permanent_ban' | 'profile_deletion';
}

export interface PlatformAnalytics {
  totalUsers: number;
  activeUsers: number;
  totalMatches: number;
  successfulMatches: number;
  averageCompatibilityScore: number;
  messagesSent: number;
  reportRate: number;
  retentionRate: number;
  conversionRate: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  };
}

// Form and Validation Types
export interface FormErrors {
  [key: string]: string | undefined;
}

export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  age: number;
  agreeToTerms: boolean;
}

export interface ProfileForm {
  name: string;
  age: number;
  location: string;
  bio: string;
  profileImage?: File;
}

// State Management Types (for Zustand)
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterForm) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export interface MatchesState {
  matches: Match[];
  isLoading: boolean;
  filters: MatchingPreferences;
  fetchMatches: () => Promise<void>;
  updateFilters: (filters: Partial<MatchingPreferences>) => void;
  respondToMatch: (matchId: string, response: 'accept' | 'decline') => Promise<void>;
}

export interface ChatState {
  conversations: Conversation[];
  activeConversation: string | null;
  messages: { [conversationId: string]: Message[] };
  isLoading: boolean;
  fetchConversations: () => Promise<void>;
  setActiveConversation: (conversationId: string) => void;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
}