const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { yearAccess } = require('../middleware/yearMiddleware');
const ctrl = require('../controllers/collaborationController');

// All routes require auth + 2nd year access
router.use(protect);
router.use(yearAccess(['2nd Year', '3rd Year', '4th Year']));

// ── Dashboard ──
router.get('/dashboard', ctrl.getDashboard);

// ── Projects ──
router.post('/projects', ctrl.createProject);
router.get('/projects', ctrl.getProjects);
router.get('/projects/:id', ctrl.getProject);
router.patch('/projects/:id/status', ctrl.updateProjectStatus);
router.post('/projects/:id/feedback', ctrl.addMentorFeedback);
router.post('/projects/:id/score', ctrl.calculateScore);

// ── Teams ──
router.post('/teams', ctrl.createTeam);
router.get('/teams/my', ctrl.getMyTeam);
router.get('/teams/:id', ctrl.getTeam);
router.post('/teams/:id/join', ctrl.requestJoinTeam);
router.patch('/teams/:id/approve-member', ctrl.approveMember);
router.patch('/teams/:id/activate', ctrl.activateTeam);

// ── Sprints ──
router.post('/sprints', ctrl.createSprint);
router.get('/sprints/:teamId', ctrl.getSprints);
router.post('/sprints/:id/tasks', ctrl.addTask);
router.patch('/sprints/:sprintId/tasks/:taskId', ctrl.updateTask);
router.patch('/sprints/:id/complete', ctrl.completeSprint);

// ── Analytics ──
router.get('/contributions/:teamId', ctrl.getContributions);
router.get('/analytics/my', ctrl.getMyAnalytics);
router.get('/leaderboard', ctrl.getLeaderboard);

module.exports = router;
