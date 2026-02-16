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
    enum: ['video', 'reading', 'quiz', 'coding', 'project', 'visualizer', 'playground'],
    default: 'video'
  },

  // Content Fields
  videoUrl: String, // For 'video'
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
    testCases: [testCaseSchema]
  },
  projectConfig: {
    repoRequirements: [String],
    minCommits: Number
  },

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
  promoVideo: String,

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

  features: [String], // "Certificate", "Native Teacher"

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware to create slug from title
courseSchema.pre('save', function (next) {
  if (this.title) {
    this.slug = this.title.toLowerCase().split(' ').join('-');
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema);
