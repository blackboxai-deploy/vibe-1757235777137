import mongoose from 'mongoose';
import { User, Match, Message } from '@/types';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/loveos';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Global mongoose connection promise
interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: CachedConnection | undefined;
}

let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// User Schema
const PersonalityProfileSchema = new mongoose.Schema({
  openness: { type: Number, required: true, min: 0, max: 100 },
  conscientiousness: { type: Number, required: true, min: 0, max: 100 },
  extraversion: { type: Number, required: true, min: 0, max: 100 },
  agreeableness: { type: Number, required: true, min: 0, max: 100 },
  neuroticism: { type: Number, required: true, min: 0, max: 100 },
  emotionalIntelligence: { type: Number, required: true, min: 0, max: 100 },
  communicationStyle: {
    type: String,
    enum: ['direct', 'diplomatic', 'expressive', 'analytical'],
    required: true
  },
  conflictResolution: {
    type: String,
    enum: ['collaborative', 'competitive', 'accommodating', 'avoiding'],
    required: true
  },
  attachmentStyle: {
    type: String,
    enum: ['secure', 'anxious', 'avoidant', 'disorganized'],
    required: true
  },
  coreValues: [{ type: String }],
  lifestylePreferences: [{ type: String }],
  relationshipGoals: [{ type: String }],
  personalityVector: [{ type: Number }],
  valuesVector: [{ type: Number }]
});

const UserPreferencesSchema = new mongoose.Schema({
  ageRange: {
    min: { type: Number, required: true, min: 18, max: 100 },
    max: { type: Number, required: true, min: 18, max: 100 }
  },
  maxDistance: { type: Number, required: true, min: 1, max: 500 },
  relationshipType: {
    type: String,
    enum: ['romantic', 'friendship', 'professional', 'any'],
    required: true,
    default: 'romantic'
  },
  genderPreference: [{ type: String }],
  compatibilityThreshold: { type: Number, required: true, min: 0, max: 100, default: 60 }
});

const PrivacySettingsSchema = new mongoose.Schema({
  showAge: { type: Boolean, default: true },
  showLocation: { type: Boolean, default: true },
  showLastActive: { type: Boolean, default: true },
  allowMessages: {
    type: String,
    enum: ['matches', 'verified', 'anyone'],
    default: 'matches'
  },
  visibilityMode: {
    type: String,
    enum: ['public', 'limited', 'private'],
    default: 'public'
  }
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, min: 18, max: 100 },
  location: { type: String },
  bio: { type: String, maxlength: 500 },
  profileImage: { type: String },
  isProfileComplete: { type: Boolean, default: false },
  isQuestionnairComplete: { type: Boolean, default: false },
  personalityProfile: PersonalityProfileSchema,
  preferences: { type: UserPreferencesSchema, required: true },
  privacySettings: { type: PrivacySettingsSchema, required: true },
  lastActive: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date }
}, {
  timestamps: true
});

// Questionnaire Response Schema
const QuestionnaireResponseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: String, required: true },
  response: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now }
});

// Match Schema
const CompatibilityBreakdownSchema = new mongoose.Schema({
  overall: { type: Number, required: true, min: 0, max: 100 },
  personality: { type: Number, required: true, min: 0, max: 100 },
  values: { type: Number, required: true, min: 0, max: 100 },
  communication: { type: Number, required: true, min: 0, max: 100 },
  lifestyle: { type: Number, required: true, min: 0, max: 100 },
  emotionalCompatibility: { type: Number, required: true, min: 0, max: 100 },
  conflictResolutionCompatibility: { type: Number, required: true, min: 0, max: 100 },
  strengths: [{ type: String }],
  potentialChallenges: [{ type: String }],
  tips: [{ type: String }]
});

const MatchSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  matchedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  compatibilityScore: { type: Number, required: true, min: 0, max: 100 },
  compatibilityBreakdown: { type: CompatibilityBreakdownSchema, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'expired'],
    default: 'pending'
  },
  mutualMatch: { type: Boolean, default: false },
  userResponse: { type: String, enum: ['like', 'pass', 'super_like'] },
  matchedUserResponse: { type: String, enum: ['like', 'pass', 'super_like'] },
  expiresAt: { type: Date, required: true }
}, {
  timestamps: true
});

// Conversation Schema
const ConversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  lastActivity: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  unreadCount: {
    type: Map,
    of: Number,
    default: new Map()
  }
}, {
  timestamps: true
});

// Message Schema
const MessageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 1000 },
  messageType: {
    type: String,
    enum: ['text', 'image', 'system'],
    default: 'text'
  },
  readBy: {
    type: Map,
    of: Date,
    default: new Map()
  },
  edited: { type: Boolean, default: false },
  editedAt: { type: Date },
  isDeleted: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Moderation Report Schema
const ModerationReportSchema = new mongoose.Schema({
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reportedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['harassment', 'inappropriate_content', 'fake_profile', 'spam', 'other'],
    required: true
  },
  description: { type: String, required: true, maxlength: 500 },
  status: {
    type: String,
    enum: ['pending', 'investigating', 'resolved', 'dismissed'],
    default: 'pending'
  },
  resolvedAt: { type: Date },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: {
    type: String,
    enum: ['warning', 'temporary_ban', 'permanent_ban', 'profile_deletion']
  }
}, {
  timestamps: true
});

// Create indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ location: 1 });
UserSchema.index({ age: 1 });
UserSchema.index({ lastActive: -1 });

MatchSchema.index({ userId: 1, matchedUserId: 1 });
MatchSchema.index({ userId: 1, status: 1 });
MatchSchema.index({ compatibilityScore: -1 });
MatchSchema.index({ expiresAt: 1 });

ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ lastActivity: -1 });

MessageSchema.index({ conversationId: 1, timestamp: -1 });
MessageSchema.index({ senderId: 1 });

QuestionnaireResponseSchema.index({ userId: 1 });
QuestionnaireResponseSchema.index({ questionId: 1 });

// Models
export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export const QuestionnaireResponseModel = mongoose.models.QuestionnaireResponse || mongoose.model('QuestionnaireResponse', QuestionnaireResponseSchema);
export const MatchModel = mongoose.models.Match || mongoose.model('Match', MatchSchema);
export const ConversationModel = mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);
export const MessageModel = mongoose.models.Message || mongoose.model('Message', MessageSchema);
export const ModerationReportModel = mongoose.models.ModerationReport || mongoose.model('ModerationReport', ModerationReportSchema);

// Helper functions
export async function findUserByEmail(email: string) {
  await connectToDatabase();
  return UserModel.findOne({ email: email.toLowerCase() });
}

export async function findUserById(id: string) {
  await connectToDatabase();
  return UserModel.findById(id).select('-passwordHash');
}

export async function createUser(userData: Partial<User> & { passwordHash: string }) {
  await connectToDatabase();
  const user = new UserModel(userData);
  return user.save();
}

export async function updateUser(id: string, updates: Partial<User>) {
  await connectToDatabase();
  return UserModel.findByIdAndUpdate(id, updates, { new: true }).select('-passwordHash');
}

export async function deleteUser(id: string) {
  await connectToDatabase();
  return UserModel.findByIdAndDelete(id);
}

// Match-related functions
export async function findPotentialMatches(userId: string, preferences: any, limit: number = 50) {
  await connectToDatabase();
  
  // Get user's existing matches to exclude them
  const existingMatches = await MatchModel.find({ userId }).select('matchedUserId');
  const excludeIds = existingMatches.map(match => match.matchedUserId);
  excludeIds.push(new mongoose.Types.ObjectId(userId));
  
  return UserModel.find({
    _id: { $nin: excludeIds },
    age: { 
      $gte: preferences.ageRange.min, 
      $lte: preferences.ageRange.max 
    },
    isActive: true,
    isQuestionnairComplete: true
  }).limit(limit);
}

export async function createMatch(matchData: Partial<Match>) {
  await connectToDatabase();
  const match = new MatchModel(matchData);
  return match.save();
}

export async function getUserMatches(userId: string, status?: string) {
  await connectToDatabase();
  const query: any = { userId };
  if (status) query.status = status;
  
  return MatchModel.find(query)
    .populate('matchedUserId', 'name age location profileImage')
    .sort({ createdAt: -1 });
}

// Conversation and messaging functions
export async function createConversation(participants: string[], matchId: string) {
  await connectToDatabase();
  const conversation = new ConversationModel({
    participants,
    matchId,
    unreadCount: new Map(participants.map(p => [p, 0]))
  });
  return conversation.save();
}

export async function getUserConversations(userId: string) {
  await connectToDatabase();
  return ConversationModel.find({ participants: userId })
    .populate('participants', 'name profileImage lastActive')
    .sort({ lastActivity: -1 });
}

export async function createMessage(messageData: Partial<Message>) {
  await connectToDatabase();
  const message = new MessageModel(messageData);
  return message.save();
}

export async function getConversationMessages(conversationId: string, limit: number = 50) {
  await connectToDatabase();
  return MessageModel.find({ conversationId, isDeleted: false })
    .populate('senderId', 'name profileImage')
    .sort({ createdAt: -1 })
    .limit(limit);
}