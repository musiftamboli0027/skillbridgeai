const mongoose = require('mongoose');

// --- Component Schemas ---

const testCaseSchema = new mongoose.Schema({
  input: String,
  output: String,
  isHidden: { type: Boolean, default: false }
});

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  duration: String, // e.g., "10:05"
  type: {
    type: String,
    enum: ['reading', 'quiz', 'coding', 'project', 'visualizer', 'playground'],
    default: 'reading'
  },

  // Content Fields
  content: String, // For 'reading'

  // Assignment Config (for quiz/coding/project types)
  quizQuestions: [{
    question: String,
    options: [String],
    correctAnswer: Number,
    explanation: String
  }],
  codingChallenge: {
    problemStatement: String,
    starterCode: String,
    language: { type: String, default: 'javascript' },
    solution: String,
    functionName: String,  // e.g. "add", "greet" — which function to call in test harness
    testCases: [testCaseSchema]
  },

  projectConfig: {
    repoRequirements: [String],
    minCommits: Number
  },

  // Advanced EdTech Fields
  threeJsBlock: {
    conceptName: String,
    visualDescription: String,
    pythonConcept: String,
    interactionType: String,
    uiIntegrationHint: String
  },
  debuggingBlock: {
    wrongCode: String,
    correctedCode: String,
    explanation: String
  },
  expectedSkills: [String],
  miniChallenge: String,

  isPreview: { type: Boolean, default: false },
  order: { type: Number, required: true }
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  objectives: [String],
  order: { type: Number, required: true },
  lessons: [lessonSchema],

  // Unlock criteria (optional override)
  unlockRequirements: {
    minQuizScore: { type: Number, default: 80 },
    requireCodingPass: { type: Boolean, default: true }
  }
});

const weekSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "Week 1: Foundations"
  description: String,
  order: { type: Number, required: true },
  modules: [moduleSchema]
});

// --- Main Course Schema ---

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  subtitle: String,
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  fullDescription: String,

  // Taxonomy
  category: {
    type: String,
    required: true,
    enum: ['Web Development', 'Mobile Development', 'Data Science', 'UI/UX', 'DevOps', 'Cybersecurity', 'Programming', 'Cloud & DevOps', 'Design']
  },
  level: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  tags: [String],

  // Media
  image: {
    type: String,
    default: 'no-photo.jpg'
  },

  // Pricing
  price: { type: Number, required: true },
  originalPrice: Number,
  currency: { type: String, default: 'INR' },
  isPaid: { type: Boolean, default: true },

  // Structure
  weeks: [weekSchema], // Hierarchical: Course -> Week -> Module -> Lesson

  // Meta
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must can not be more than 5']
  },
  enrolledStudents: { type: Number, default: 0 },

  slug: String,
  isPublished: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  approvalStatus: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected'],
    default: 'draft'
  },
  rejectionReason: String,

  features: [String], // "Certificate", "Native Teacher"

  assessmentModel: {
    codingWeightage: { type: String, default: "60%" },
    mcqWeightage: { type: String, default: "40%" }
  },

  aiTutorSystem: {
    logicMirroringExamples: [String],
    indentationAlertBehavior: String,
    syntaxHintRules: [String]
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Indices for performance
courseSchema.index({ category: 1, isPublished: 1 });
courseSchema.index({ level: 1, isPublished: 1 });
courseSchema.index({ instructor: 1 });
courseSchema.index({ isPublished: 1, isFeatured: 1 });
courseSchema.index({ slug: 1 }, { unique: true });
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Middleware to create slug from title
courseSchema.pre('save', function (next) {
  if (this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .split(/\s+/)
      .join('-');
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema);
