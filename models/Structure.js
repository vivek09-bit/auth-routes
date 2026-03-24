import mongoose from 'mongoose';

// ==================== USER SCHEMA ====================
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true }, // Unique username
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, unique: true },
  role: { type: String, enum: ["st", "ad"], default: "st" },
  subscription_status: { type: String, default: "inactive" },
  userID: { type: String, unique: true }, // Unique user ID
  profileURL: { type: String, unique: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
}, { timestamps: true });



// ==================== USER TEST RECORD SCHEMA ====================
const UserTestRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  testDetails: {
    testName: { type: String, required: true },
    totalQuestions: { type: Number, required: true },
    passingScore: { type: Number, required: true }
  },
  attempts: [
    {
      questionsAttempted: [
        {
          questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionSet.questions' },
          questionText: { type: String, required: true },
          selectedOption: { type: String, required: true }, // Changed from Number to String to match correct_option
          isCorrect: { type: Boolean, required: true }
        }
      ],
      score: { type: Number, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  bestScore: { type: Number, default: 0 },
  lastAttempted: { type: Date, default: null }
});

// ==================== SUBSCRIPTION SCHEMA ====================
const SubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubPlan', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['Active', 'Expired'], required: true }
});

// ==================== SUBSCRIPTION PLAN SCHEMA ====================
const SubPlanSchema = new mongoose.Schema({
  planName: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


//==============================================================
// ==================== DEPRECIATED ============================
// ==================== QUESTION SET SCHEMA ====================
const QuestionSetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, },
  topic: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  questions: [
    {
      topic: { type: String },
      subtopic: { type: String },
      question: {
        text: { type: String, required: true }
      },
      options: { type: [String], required: true },
      correct_option: { type: String, required: true },
      explanation: {
        text: { type: String }
      },
      tags: [String]
    }
  ],
  totalQuestions: { type: Number, default: 0 },
  difficultyDistribution: {
    easy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now }
});

// ==================== TEST SCHEMA ====================
const TestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  isPublic: { type: Boolean, default: true },
  accessPasscode: { type: String, default: null },
  category: { type: String, index: true },    // e.g., "Banking", "SSC"
  examTarget: { type: String, index: true },  // e.g., "SBI PO", "IBPS Clerk"
  stage: { type: String, enum: ['Prelims', 'Mains', 'Interview', 'Practice'] },
  type: { type: String, enum: ['Full Mock', 'Sectional', 'Topic Wise', 'Previous Year'] },
  questionSets: [
    {
      setId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionSet' },
      numToPick: { type: Number, required: true }
    }
  ],
  passingScore: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});







// ========================================================
// ==================== LATEST ====================
// ==================== QUESTION SCHEMA ====================
const QuestionSchema = new mongoose.Schema({
  subject: { type: String, required: true, index: true },
  category: [{ type: String, index: true }],       // Banking, SSC
  examTarget: [{ type: String, index: true }],     // SBI PO
  topic: { type: String, required: true, index: true },
  subtopic: { type: String, index: true },

  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    index: true
  },

  type: {
    type: String,
    enum: ['MCQ', 'MSQ', 'Numerical', 'TrueFalse'],
    default: 'MCQ'
  },

  question: {
    text: { type: String, required: true },
    image: { type: String }
  },

  options: [
    {
      key: { type: String }, // A,B,C,D
      text: { type: String },
      image: { type: String }
    }
  ],

  correctAnswer: {
    type: [String], // supports MSQ
    required: true
  },

  explanation: {
    text: { type: String },
    image: { type: String }
  },

  tags: [{ type: String, index: true }],

  marks: { type: Number, default: 1 },
  negativeMarks: { type: Number, default: 0 },

  language: { type: String, default: "en", index: true },

  stats: {
    attemptCount: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 }
  },

  isActive: { type: Boolean, default: true },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  createdAt: { type: Date, default: Date.now }
});


// ==================== STATIC TEST SCHEMA ====================
const StaticTestSchema = new mongoose.Schema({

  name: { type: String, required: true },
  description: String,

  category: { type: String, index: true },   // Banking
  examTarget: { type: String, index: true }, // SBI PO

  stage: {
    type: String,
    enum: ['Prelims', 'Mains', 'Interview', 'Practice']
  },

  type: {
    type: String,
    enum: ['Full Mock', 'Sectional', 'Previous Year']
  },

  duration: Number, // minutes

  questions: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
      marks: { type: Number, default: 1 },
      negativeMarks: { type: Number, default: 0 }
    }
  ],

  passingScore: Number,

  isPublic: { type: Boolean, default: true },
  accessPasscode: String,

  createdAt: { type: Date, default: Date.now }

});

// ==================== DYNAMIC TEST SCHEMA ====================
const DynamicTestSchema = new mongoose.Schema({

  name: { type: String, required: true },
  description: String,

  category: { type: String, index: true },
  examTarget: { type: String, index: true },

  stage: {
    type: String,
    enum: ['Prelims', 'Mains', 'Practice']
  },

  type: {
    type: String,
    enum: ['Topic Wise', 'Sectional', 'Adaptive']
  },

  duration: Number,

  rules: [
    {
      subject: String,
      topic: String,
      subtopic: String,

      difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard']
      },

      tags: [String],

      questionCount: Number
    }
  ],

  constraints: {
    avoidPreviouslyAttempted: { type: Boolean, default: true },
    uniqueQuestionsPerAttempt: { type: Boolean, default: true }
  },

  passingScore: Number,

  isPublic: { type: Boolean, default: true },

  createdAt: { type: Date, default: Date.now }

});










// Add fields for preferences, stats, and avatar (required for new user APIs)
UserSchema.add({
  avatar: { type: String }, // URL or path to uploaded avatar
  preferences: { type: Map, of: String }, // e.g., { theme: 'dark', language: 'en' }
  stats: { type: Map, of: Number } // e.g., { testsTaken: 5, averageScore: 80 }
});





// ==================== Pending Verification Schema (for OTPs) SCHEMA ====================
const PendingVerificationSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 } // Auto-delete after 10 minutes
});

const User = mongoose.model('User', UserSchema);
const QuestionSet = mongoose.model('QuestionSet', QuestionSetSchema);
const Test = mongoose.model('Test', TestSchema);
const UserTestRecord = mongoose.model('UserTestRecord', UserTestRecordSchema);
const Subscription = mongoose.model('Subscription', SubscriptionSchema);
const SubPlan = mongoose.model('SubPlan', SubPlanSchema);
const PendingVerification = mongoose.model('PendingVerification', PendingVerificationSchema);
const StaticTest = mongoose.model('StaticTest', StaticTestSchema);
const DynamicTest = mongoose.model('DynamicTest', DynamicTestSchema);
const Question = mongoose.model('Question', QuestionSchema);

export {
  User,
  QuestionSet,
  Test,
  UserTestRecord,
  Subscription,
  SubPlan,
  PendingVerification,
  StaticTest,
  DynamicTest,
  Question
};