const express = require('express');
const router = express.Router();
const { protect, authorize, requireVerifiedRecruiter } = require('../middleware/authMiddleware');
const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');
const CommunityPost = require('../models/CommunityPost');

// ══════════════════════════════════════════════════════════════════
// PUBLIC ROUTES
// ══════════════════════════════════════════════════════════════════

/**
 * GET /api/jobs/public
 * Public job listings — visible to everyone for SEO
 */
router.get('/public', async (req, res) => {
    try {
        const { domain, type, level, page = 1, limit = 20 } = req.query;
        const query = { status: 'Active', visibility: 'Public', applicationDeadline: { $gte: new Date() } };

        if (domain) query.requiredDomains = { $in: [domain] };
        if (type) query.jobType = type;
        if (level) query.experienceLevel = level;

        const jobs = await Job.find(query)
            .select('-applicantCount')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .lean();

        const total = await Job.countDocuments(query);

        res.json({
            success: true,
            jobs,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/**
 * GET /api/jobs/:id
 * Single job detail — public
 */
router.get('/detail/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('postedBy', 'name recruiterProfile.companyName recruiterProfile.companyLogo')
            .lean();

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        res.json({ success: true, job });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ══════════════════════════════════════════════════════════════════
// PROTECTED ROUTES (Authentication required)
// ══════════════════════════════════════════════════════════════════
router.use(protect);

// ── STUDENT ROUTES ──────────────────────────────────────────────

/**
 * GET /api/jobs/browse
 * Browse all active jobs (authenticated students see all including StudentsOnly)
 */
router.get('/browse', async (req, res) => {
    try {
        const { domain, type, level, search, page = 1, limit = 20 } = req.query;
        const query = { status: 'Active', applicationDeadline: { $gte: new Date() } };

        if (domain) query.requiredDomains = { $in: [domain] };
        if (type) query.jobType = type;
        if (level) query.experienceLevel = level;
        if (search) query.title = { $regex: search, $options: 'i' };

        const jobs = await Job.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .lean();

        // Attach whether current user has applied
        const userApps = await Application.find({
            studentId: req.user.id,
            jobId: { $in: jobs.map(j => j._id) }
        }).select('jobId status');

        const appMap = {};
        userApps.forEach(a => { appMap[a.jobId.toString()] = a.status; });

        const enriched = jobs.map(j => ({
            ...j,
            hasApplied: !!appMap[j._id.toString()],
            applicationStatus: appMap[j._id.toString()] || null
        }));

        const total = await Job.countDocuments(query);

        res.json({ success: true, jobs: enriched, total, page: Number(page), totalPages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/**
 * POST /api/jobs/apply/:id
 * Student applies to a job
 */
router.post('/apply/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        if (job.status !== 'Active') return res.status(400).json({ success: false, message: 'This job is no longer active' });
        if (new Date() > job.applicationDeadline) return res.status(400).json({ success: false, message: 'Application deadline has passed' });

        // Check duplicate
        const existing = await Application.findOne({ jobId: req.params.id, studentId: req.user.id });
        if (existing) return res.status(400).json({ success: false, message: 'You have already applied to this job' });

        const { resumeLink, portfolioLink, githubLink, coverLetter } = req.body;

        // Build performance snapshot
        const user = await User.findById(req.user.id);
        const performanceSnapshot = {
            communityScore: user.gamification?.communityScore || 0,
            collaborationScore: user.gamification?.collaborationScore || 0,
            completedCourses: user.enrolledCourses?.filter(c => c.progress >= 100).length || 0,
            projectsCompleted: user.gamification?.projectsCompleted || 0,
            githubCommits: user.gamification?.totalCommits || 0,
            xp: user.gamification?.xp || 0
        };

        const application = await Application.create({
            jobId: req.params.id,
            studentId: req.user.id,
            resumeLink,
            portfolioLink,
            githubLink,
            coverLetter,
            performanceSnapshot
        });

        // Increment applicant count
        await Job.findByIdAndUpdate(req.params.id, { $inc: { applicantCount: 1 } });

        res.status(201).json({ success: true, application });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: 'You have already applied to this job' });
        }
        res.status(500).json({ success: false, message: err.message });
    }
});

/**
 * GET /api/jobs/my-applications
 * Student's applications with status
 */
router.get('/my-applications', async (req, res) => {
    try {
        const apps = await Application.find({ studentId: req.user.id })
            .populate('jobId', 'title companyName companyLogo jobType location stipendOrSalary applicationDeadline status')
            .sort({ createdAt: -1 })
            .lean();

        res.json({ success: true, applications: apps });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── RECRUITER ROUTES ─────────────────────────────────────────────

/**
 * POST /api/jobs/create
 * Recruiter creates a job posting
 */
router.post('/create', requireVerifiedRecruiter, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const {
            title, jobType, requiredDomains, requiredSkills, experienceLevel,
            stipendOrSalary, location, description, responsibilities,
            applicationDeadline, visibility
        } = req.body;

        const job = await Job.create({
            title,
            companyName: user.recruiterProfile?.companyName || user.name,
            companyLogo: user.recruiterProfile?.companyLogo || '',
            postedBy: req.user.id,
            jobType,
            requiredDomains: requiredDomains || [],
            requiredSkills: requiredSkills || [],
            experienceLevel: experienceLevel || 'Any',
            stipendOrSalary,
            location,
            description,
            responsibilities,
            applicationDeadline: new Date(applicationDeadline),
            visibility: visibility || 'Public',
            collegeId: user.collegeId
        });

        // ── Auto-post to Community ──
        if (job.visibility === 'Public') {
            await CommunityPost.create({
                author: req.user.id,
                content: `🚀 **New Opportunity:** ${title} at **${job.companyName}**! \n\n📍 ${location} | 💼 ${jobType}\n\nApply now in the Opportunities portal!`,
                domain: requiredDomains?.[0] || 'General',
                tags: ['Opportunity', 'Hiring'],
                mediaUrls: [],
                visibility: 'public',
                likes: [],
                comments: []
            });
        }

        res.status(201).json({ success: true, job });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/**
 * GET /api/jobs/recruiter
 * Recruiter's posted jobs
 */
router.get('/recruiter', authorize('recruiter', 'admin', 'super_admin'), async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user.id })
            .sort({ createdAt: -1 })
            .lean();

        // Attach applicant counts
        for (let job of jobs) {
            job.applicants = await Application.countDocuments({ jobId: job._id });
        }

        res.json({ success: true, jobs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/**
 * GET /api/jobs/applicants/:jobId
 * View applicants for a specific job with Match Score
 */
router.get('/applicants/:jobId', authorize('recruiter', 'admin', 'super_admin'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

        // Only the poster or admin can view applicants
        if (job.postedBy.toString() !== req.user.id && !['admin', 'super_admin'].includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const applicantsRaw = await Application.find({ jobId: req.params.jobId })
            .populate('studentId', 'name email avatar year branch gamification skills enrolledCourses careerInterest')
            .lean();

        // Calculate Match Score
        const applicants = applicantsRaw.map(app => {
            const sn = app.performanceSnapshot || {};
            // Basic matching logic based on domains and skills
            let domainMatch = 0;
            if (job.requiredDomains && job.requiredDomains.length > 0 && app.studentId?.careerInterest) {
                if (job.requiredDomains.includes(app.studentId.careerInterest)) domainMatch = 1;
            }

            // Normalization for score
            const score = Math.min(100, Math.round(
                (domainMatch * 40) +
                (Math.min((sn.communityScore || 0) / 100, 1) * 30) +
                (Math.min((sn.collaborationScore || 0) / 100, 1) * 30)
            ));

            return {
                ...app,
                matchScore: score
            };
        });

        // Sorting
        const { sort = 'newest' } = req.query;
        if (sort === 'score') applicants.sort((a, b) => b.matchScore - a.matchScore);
        else if (sort === 'xp') applicants.sort((a, b) => (b.performanceSnapshot?.xp || 0) - (a.performanceSnapshot?.xp || 0));
        else if (sort === 'community') applicants.sort((a, b) => (b.performanceSnapshot?.communityScore || 0) - (a.performanceSnapshot?.communityScore || 0));
        else if (sort === 'collaboration') applicants.sort((a, b) => (b.performanceSnapshot?.collaborationScore || 0) - (a.performanceSnapshot?.collaborationScore || 0));
        else applicants.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // newest

        res.json({ success: true, applicants });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/**
 * PATCH /api/jobs/application-status/:applicationId
 * Recruiter updates an application status
 */
router.patch('/application-status/:applicationId', authorize('recruiter', 'admin', 'super_admin'), async (req, res) => {
    try {
        const { status, feedback } = req.body;
        if (!['Applied', 'Shortlisted', 'Rejected', 'Hired'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const application = await Application.findById(req.params.applicationId).populate('jobId');
        if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

        // Verify ownership
        if (application.jobId.postedBy.toString() !== req.user.id && !['admin', 'super_admin'].includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        application.status = status;
        if (feedback) application.recruiterFeedback = feedback;
        await application.save();

        res.json({ success: true, application });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/**
 * PATCH /api/jobs/status/:id
 * Recruiter updates job status (Close/Reopen)
 */
router.patch('/status/:id', authorize('recruiter', 'admin', 'super_admin'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

        if (job.postedBy.toString() !== req.user.id && !['admin', 'super_admin'].includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        job.status = req.body.status || 'Closed';
        await job.save();

        res.json({ success: true, job });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── ADMIN ROUTES ─────────────────────────────────────────────────

/**
 * PATCH /api/jobs/verify-recruiter/:userId
 * Admin verifies a recruiter
 */
router.patch('/verify-recruiter/:userId', authorize('admin', 'super_admin'), async (req, res) => {
    try {
        const { action } = req.body; // 'approve' or 'reject'
        const user = await User.findById(req.params.userId);
        if (!user || user.role !== 'recruiter') {
            return res.status(404).json({ success: false, message: 'Recruiter not found' });
        }

        user.recruiterProfile.isVerified = action === 'approve';
        user.recruiterProfile.verificationStatus = action === 'approve' ? 'Approved' : 'Rejected';
        user.recruiterProfile.verifiedBy = req.user.id;
        await user.save();

        res.json({ success: true, message: `Recruiter ${action === 'approve' ? 'approved' : 'rejected'}` });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/**
 * GET /api/jobs/admin/recruiters
 * Admin fetches all recruiters
 */
router.get('/admin/recruiters', authorize('admin', 'super_admin'), async (req, res) => {
    try {
        const recruiters = await User.find({ role: 'recruiter' })
            .select('-password')
            .sort({ createdAt: -1 })
            .lean();
        
        res.json({ success: true, recruiters });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
