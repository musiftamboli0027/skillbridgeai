const asyncHandler = require('../utils/asyncHandler');
const CollabProject = require('../models/CollabProject');
const Team = require('../models/Team');
const Sprint = require('../models/Sprint');
const Contribution = require('../models/Contribution');
const User = require('../models/User');

// ═══════════════════════════════════════════════════════════════════════
//  PROJECT ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════

// POST /api/collaboration/projects — Create proposal
exports.createProject = asyncHandler(async (req, res) => {
  const { title, description, problemStatement, requiredDomains, projectType, techStack, tags } = req.body;

  if (!title || !description || !problemStatement || !requiredDomains || requiredDomains.length < 3) {
    return res.status(400).json({ success: false, message: 'Title, description, problem statement, and at least 3 required domains are required.' });
  }

  const project = await CollabProject.create({
    title,
    description,
    problemStatement,
    requiredDomains,
    projectType: projectType || 'Startup',
    techStack: techStack || [],
    tags: tags || [],
    createdBy: req.user.id,
    collegeId: req.user.collegeId,
    status: 'Proposal'
  });

  res.status(201).json({ success: true, project });
});

// GET /api/collaboration/projects — List visible projects
exports.getProjects = asyncHandler(async (req, res) => {
  const { status, type } = req.query;
  const filter = {};

  if (req.user.collegeId) filter.collegeId = req.user.collegeId;
  if (status) filter.status = status;
  if (type) filter.projectType = type;

  const projects = await CollabProject.find(filter)
    .populate('createdBy', 'name avatar primaryDomain')
    .populate('mentorAssigned', 'name avatar')
    .sort({ createdAt: -1 })
    .lean();

  res.json({ success: true, projects });
});

// GET /api/collaboration/projects/:id — Single project
exports.getProject = asyncHandler(async (req, res) => {
  const project = await CollabProject.findById(req.params.id)
    .populate('createdBy', 'name avatar primaryDomain email')
    .populate('mentorAssigned', 'name avatar');

  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

  // Also get the team
  const team = await Team.findOne({ projectId: project._id })
    .populate('members.userId', 'name avatar primaryDomain')
    .populate('teamLead', 'name avatar');

  // Get sprints
  const sprints = await Sprint.find({ projectId: project._id })
    .populate('tasks.assignedTo', 'name avatar')
    .sort({ sprintNumber: 1 });

  // Get contributions
  const contributions = await Contribution.find({ projectId: project._id })
    .populate('userId', 'name avatar primaryDomain');

  res.json({ success: true, project, team, sprints, contributions });
});

// PATCH /api/collaboration/projects/:id/status — Update status (mentor/admin)
exports.updateProjectStatus = asyncHandler(async (req, res) => {
  const { status, rejectionReason } = req.body;

  const project = await CollabProject.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

  // Allow admin/instructor, or the creator to update certain statuses
  const isOwner = project.createdBy.toString() === req.user.id;
  const isAdminOrMentor = ['admin', 'instructor', 'super_admin'].includes(req.user.role);

  if (!isOwner && !isAdminOrMentor) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  // Only mentors/admin can approve
  if (['Approved', 'Rejected'].includes(status) && !isAdminOrMentor) {
    return res.status(403).json({ success: false, message: 'Only mentors can approve/reject' });
  }

  project.status = status;
  if (status === 'Rejected') project.rejectionReason = rejectionReason || '';
  if (status === 'Completed') project.completedAt = new Date();
  await project.save();

  res.json({ success: true, project });
});

// POST /api/collaboration/projects/:id/feedback — Add mentor feedback
exports.addMentorFeedback = asyncHandler(async (req, res) => {
  const { comment, score } = req.body;
  const project = await CollabProject.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

  project.mentorFeedback.push({ comment, score });
  await project.save();

  res.json({ success: true, project });
});

// ═══════════════════════════════════════════════════════════════════════
//  TEAM ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════

// POST /api/collaboration/teams — Create team
exports.createTeam = asyncHandler(async (req, res) => {
  const { name, projectId } = req.body;

  // Verify project is approved
  const project = await CollabProject.findById(projectId);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  if (project.status !== 'Approved') {
    return res.status(400).json({ success: false, message: 'Project must be approved before team creation' });
  }

  // Check if team already exists for this project
  const existingTeam = await Team.findOne({ projectId });
  if (existingTeam) {
    return res.status(400).json({ success: false, message: 'A team already exists for this project' });
  }

  // Check if user is already in an active team
  const activeTeam = await Team.findOne({
    'members.userId': req.user.id,
    status: { $in: ['Forming', 'Active'] }
  });

  if (activeTeam) {
    return res.status(400).json({ success: false, message: 'You are already in an active team. Complete or leave your current team first.' });
  }

  const team = await Team.create({
    name,
    projectId,
    teamLead: req.user.id,
    members: [{
      userId: req.user.id,
      role: 'Lead',
      domain: req.user.primaryDomain || 'Software Development'
    }],
    collegeId: req.user.collegeId,
    status: 'Forming'
  });

  // Create contribution record for lead
  await Contribution.create({
    teamId: team._id,
    projectId,
    userId: req.user.id
  });

  res.status(201).json({ success: true, team });
});

// POST /api/collaboration/teams/:id/join — Request to join
exports.requestJoinTeam = asyncHandler(async (req, res) => {
  const { domain, role, message } = req.body;
  const team = await Team.findById(req.params.id);

  if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
  if (team.status !== 'Forming') {
    return res.status(400).json({ success: false, message: 'Team is no longer accepting members' });
  }
  if (team.members.length >= team.maxMembers) {
    return res.status(400).json({ success: false, message: 'Team is full' });
  }

  // Check if already a member
  if (team.members.some(m => m.userId.toString() === req.user.id)) {
    return res.status(400).json({ success: false, message: 'You are already a team member' });
  }

  // Check if already requested
  if (team.joinRequests.some(r => r.userId.toString() === req.user.id && r.status === 'Pending')) {
    return res.status(400).json({ success: false, message: 'You already have a pending request' });
  }

  // Check if user is in another active team
  const activeTeam = await Team.findOne({
    'members.userId': req.user.id,
    status: { $in: ['Forming', 'Active'] }
  });
  if (activeTeam) {
    return res.status(400).json({ success: false, message: 'You are already in another active team' });
  }

  team.joinRequests.push({
    userId: req.user.id,
    domain: domain || req.user.primaryDomain || 'Software Development',
    role: role || 'Developer',
    message: message || ''
  });

  await team.save();
  res.json({ success: true, message: 'Join request submitted' });
});

// PATCH /api/collaboration/teams/:id/approve-member — Approve join request (team lead only)
exports.approveMember = asyncHandler(async (req, res) => {
  const { requestId, approved } = req.body;
  const team = await Team.findById(req.params.id);

  if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
  if (team.teamLead.toString() !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Only team lead can approve members' });
  }

  const request = team.joinRequests.id(requestId);
  if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

  if (approved) {
    if (team.members.length >= team.maxMembers) {
      return res.status(400).json({ success: false, message: 'Team is full' });
    }

    request.status = 'Approved';
    team.members.push({
      userId: request.userId,
      role: request.role || 'Developer',
      domain: request.domain
    });

    // Create contribution record
    await Contribution.create({
      teamId: team._id,
      projectId: team.projectId,
      userId: request.userId
    });
  } else {
    request.status = 'Rejected';
  }

  await team.save();
  
  const populatedTeam = await Team.findById(team._id)
    .populate('members.userId', 'name avatar primaryDomain')
    .populate('teamLead', 'name avatar')
    .populate('joinRequests.userId', 'name avatar primaryDomain');

  res.json({ success: true, team: populatedTeam });
});

// GET /api/collaboration/teams/my — Get my team
exports.getMyTeam = asyncHandler(async (req, res) => {
  const team = await Team.findOne({
    'members.userId': req.user.id,
    status: { $in: ['Forming', 'Active'] }
  })
    .populate('members.userId', 'name avatar primaryDomain domainLevel')
    .populate('teamLead', 'name avatar')
    .populate('projectId')
    .populate('joinRequests.userId', 'name avatar primaryDomain');

  if (!team) {
    return res.json({ success: true, team: null });
  }

  res.json({ success: true, team });
});

// GET /api/collaboration/teams/:id — Get team details
exports.getTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id)
    .populate('members.userId', 'name avatar primaryDomain domainLevel')
    .populate('teamLead', 'name avatar')
    .populate('projectId')
    .populate('joinRequests.userId', 'name avatar primaryDomain');

  if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

  res.json({ success: true, team });
});

// PATCH /api/collaboration/teams/:id/activate — Activate team (min 3 members, 3 domains)
exports.activateTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
  if (team.teamLead.toString() !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Only team lead can activate' });
  }

  if (team.members.length < 3) {
    return res.status(400).json({ success: false, message: 'Minimum 3 members required' });
  }

  const uniqueDomains = new Set(team.members.map(m => m.domain));
  if (uniqueDomains.size < 3) {
    return res.status(400).json({ success: false, message: 'Team needs at least 3 distinct domains' });
  }

  team.status = 'Active';
  await team.save();

  // Update project status to Development
  await CollabProject.findByIdAndUpdate(team.projectId, { status: 'Development' });

  res.json({ success: true, team });
});

// ═══════════════════════════════════════════════════════════════════════
//  SPRINT ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════

// POST /api/collaboration/sprints — Create sprint (team lead)
exports.createSprint = asyncHandler(async (req, res) => {
  const { teamId, title, goal, startDate, endDate } = req.body;

  const team = await Team.findById(teamId);
  if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
  if (team.teamLead.toString() !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Only team lead can create sprints' });
  }

  // Check for active sprint
  const activeSprint = await Sprint.findOne({ teamId, status: 'Active' });
  if (activeSprint) {
    return res.status(400).json({ success: false, message: 'Complete the current sprint before creating a new one' });
  }

  const lastSprint = await Sprint.findOne({ teamId }).sort({ sprintNumber: -1 });
  const sprintNumber = lastSprint ? lastSprint.sprintNumber + 1 : 1;

  const sprint = await Sprint.create({
    teamId,
    projectId: team.projectId,
    sprintNumber,
    title: title || `Sprint ${sprintNumber}`,
    goal: goal || '',
    startDate: startDate || new Date(),
    endDate: endDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks default
    status: 'Active'
  });

  // Update project sprint number
  await CollabProject.findByIdAndUpdate(team.projectId, { currentSprintNumber: sprintNumber });

  res.status(201).json({ success: true, sprint });
});

// GET /api/collaboration/sprints/:teamId — Get all sprints for a team
exports.getSprints = asyncHandler(async (req, res) => {
  const sprints = await Sprint.find({ teamId: req.params.teamId })
    .populate('tasks.assignedTo', 'name avatar primaryDomain')
    .sort({ sprintNumber: -1 });

  res.json({ success: true, sprints });
});

// POST /api/collaboration/sprints/:id/tasks — Add task (team lead)
exports.addTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, domainTag, priority, dueDate } = req.body;

  const sprint = await Sprint.findById(req.params.id);
  if (!sprint) return res.status(404).json({ success: false, message: 'Sprint not found' });

  const team = await Team.findById(sprint.teamId);
  if (team.teamLead.toString() !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Only team lead can add tasks' });
  }

  sprint.tasks.push({
    title,
    description: description || '',
    assignedTo: assignedTo || null,
    domainTag: domainTag || 'General',
    priority: priority || 'Medium',
    dueDate: dueDate || null,
    status: 'Todo'
  });

  await sprint.save();

  const populated = await Sprint.findById(sprint._id)
    .populate('tasks.assignedTo', 'name avatar primaryDomain');

  res.json({ success: true, sprint: populated });
});

// PATCH /api/collaboration/sprints/:sprintId/tasks/:taskId — Update task status
exports.updateTask = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const sprint = await Sprint.findById(req.params.sprintId);
  if (!sprint) return res.status(404).json({ success: false, message: 'Sprint not found' });

  const task = sprint.tasks.id(req.params.taskId);
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

  // Allow assignee or team lead to update
  const team = await Team.findById(sprint.teamId);
  const isAssignee = task.assignedTo && task.assignedTo.toString() === req.user.id;
  const isLead = team.teamLead.toString() === req.user.id;
  const isMember = team.members.some(m => m.userId.toString() === req.user.id);

  if (!isAssignee && !isLead && !isMember) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const prevStatus = task.status;
  task.status = status;
  if (status === 'Done' && prevStatus !== 'Done') {
    task.completedAt = new Date();
    // Update contribution
    if (task.assignedTo) {
      await Contribution.findOneAndUpdate(
        { teamId: sprint.teamId, userId: task.assignedTo },
        { $inc: { tasksCompleted: 1 }, $set: { lastActive: new Date() } }
      );
    }
  }

  await sprint.save();

  const populated = await Sprint.findById(sprint._id)
    .populate('tasks.assignedTo', 'name avatar primaryDomain');

  res.json({ success: true, sprint: populated });
});

// PATCH /api/collaboration/sprints/:id/complete — Complete sprint
exports.completeSprint = asyncHandler(async (req, res) => {
  const sprint = await Sprint.findById(req.params.id);
  if (!sprint) return res.status(404).json({ success: false, message: 'Sprint not found' });

  const team = await Team.findById(sprint.teamId);
  if (team.teamLead.toString() !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Only team lead can complete sprints' });
  }

  sprint.status = 'Completed';
  await sprint.save();

  res.json({ success: true, sprint });
});

// ═══════════════════════════════════════════════════════════════════════
//  CONTRIBUTION & ANALYTICS ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════

// GET /api/collaboration/contributions/:teamId — Team contributions
exports.getContributions = asyncHandler(async (req, res) => {
  const contributions = await Contribution.find({ teamId: req.params.teamId })
    .populate('userId', 'name avatar primaryDomain')
    .sort({ score: -1 });

  res.json({ success: true, contributions });
});

// GET /api/collaboration/analytics/my — My overall collaboration stats
exports.getMyAnalytics = asyncHandler(async (req, res) => {
  const teams = await Team.find({
    'members.userId': req.user.id
  }).populate('projectId', 'title status finalScore');

  const contributions = await Contribution.find({ userId: req.user.id });

  const totalCommits = contributions.reduce((sum, c) => sum + c.commits, 0);
  const totalTasks = contributions.reduce((sum, c) => sum + c.tasksCompleted, 0);
  const totalPRs = contributions.reduce((sum, c) => sum + c.pullRequests, 0);
  const avgScore = contributions.length > 0
    ? Math.round(contributions.reduce((sum, c) => sum + c.score, 0) / contributions.length)
    : 0;

  const user = await User.findById(req.user.id).select('collaborationScore leadershipScore technicalScore secondYearPerformance');

  res.json({
    success: true,
    analytics: {
      totalProjects: teams.length,
      activeProjects: teams.filter(t => t.status === 'Active').length,
      completedProjects: teams.filter(t => t.status === 'Completed').length,
      totalCommits,
      totalTasks,
      totalPRs,
      avgScore,
      collaborationScore: user.collaborationScore,
      leadershipScore: user.leadershipScore,
      technicalScore: user.technicalScore,
      performance: user.secondYearPerformance,
      projects: teams.map(t => ({
        id: t.projectId?._id,
        title: t.projectId?.title,
        status: t.projectId?.status,
        score: t.projectId?.finalScore
      }))
    }
  });
});

// GET /api/collaboration/leaderboard — College leaderboard
exports.getLeaderboard = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.collegeId) filter.collegeId = req.user.collegeId;
  filter.year = '2nd Year';

  const students = await User.find(filter)
    .select('name avatar primaryDomain collaborationScore technicalScore leadershipScore secondYearPerformance')
    .sort({ collaborationScore: -1 })
    .limit(50)
    .lean();

  res.json({ success: true, leaderboard: students });
});

// POST /api/collaboration/projects/:id/score — Calculate final score  
exports.calculateScore = asyncHandler(async (req, res) => {
  const project = await CollabProject.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

  const team = await Team.findOne({ projectId: project._id });
  if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

  // Get latest sprint completion data
  const sprints = await Sprint.find({ projectId: project._id });
  const totalTasks = sprints.reduce((sum, s) => sum + s.tasks.length, 0);
  const completedTasks = sprints.reduce((sum, s) => sum + s.tasks.filter(t => t.status === 'Done').length, 0);
  const taskCompletionRate = totalTasks > 0 ? completedTasks / totalTasks : 0;

  // Get contributions
  const contributions = await Contribution.find({ projectId: project._id });

  // Mentor feedback average
  const mentorAvg = project.mentorFeedback.length > 0
    ? project.mentorFeedback.reduce((sum, f) => sum + (f.score || 0), 0) / project.mentorFeedback.length
    : 5;

  // Calculate per-member scores
  for (const member of team.members) {
    const contrib = contributions.find(c => c.userId.toString() === member.userId.toString());
    if (!contrib) continue;

    const techScore = Math.min(10, (contrib.commits * 0.5) + (contrib.pullRequests * 2));
    const taskScore = (contrib.tasksCompleted / Math.max(1, totalTasks / team.members.length)) * 10;
    const collabScore = Math.min(10, (contrib.codeReviews * 2) + (contrib.issuesClosed * 1.5));

    // FinalScore = (Technical × 40%) + (Task × 20%) + (Collaboration × 20%) + (Mentor × 20%)
    const finalMemberScore = Math.round(
      (techScore * 0.4 + taskScore * 0.2 + collabScore * 0.2 + mentorAvg * 0.2) * 10
    );

    contrib.score = finalMemberScore;
    await contrib.save();

    // Update user scores
    await User.findByIdAndUpdate(member.userId, {
      $inc: {
        technicalScore: Math.round(techScore),
        collaborationScore: Math.round(collabScore),
        leadershipScore: member.role === 'Lead' ? 5 : 0,
        'secondYearPerformance.totalContributions': contrib.tasksCompleted
      }
    });
  }

  // Project final score = average of member scores
  const avgProjectScore = contributions.length > 0
    ? Math.round(contributions.reduce((sum, c) => sum + c.score, 0) / contributions.length)
    : 0;

  project.finalScore = avgProjectScore;
  project.status = 'Completed';
  project.completedAt = new Date();
  await project.save();

  // Update team status
  team.status = 'Completed';
  await team.save();

  // Add to collaboration history for all members
  for (const member of team.members) {
    await User.findByIdAndUpdate(member.userId, {
      $addToSet: { collaborationHistory: project._id },
      $inc: { 'secondYearPerformance.projectsCompleted': 1 }
    });
  }

  res.json({ success: true, project, finalScore: avgProjectScore });
});

// GET /api/collaboration/dashboard — Full dashboard data
exports.getDashboard = asyncHandler(async (req, res) => {
  // My team
  const myTeam = await Team.findOne({
    'members.userId': req.user.id,
    status: { $in: ['Forming', 'Active'] }
  })
    .populate('members.userId', 'name avatar primaryDomain')
    .populate('teamLead', 'name avatar')
    .populate('projectId', 'title status currentSprintNumber githubRepoUrl');

  // Available projects (approved but no team yet or forming)
  const availableProjects = await CollabProject.find({
    status: 'Approved',
    ...(req.user.collegeId ? { collegeId: req.user.collegeId } : {})
  })
    .populate('createdBy', 'name avatar')
    .limit(10)
    .sort({ createdAt: -1 });

  // My proposals
  const myProposals = await CollabProject.find({ createdBy: req.user.id })
    .sort({ createdAt: -1 });

  // Active sprint
  let activeSprint = null;
  if (myTeam) {
    activeSprint = await Sprint.findOne({ teamId: myTeam._id, status: 'Active' })
      .populate('tasks.assignedTo', 'name avatar primaryDomain');
  }

  // My contributions
  const myContributions = await Contribution.find({ userId: req.user.id });
  const totalCommits = myContributions.reduce((sum, c) => sum + c.commits, 0);
  const totalTasks = myContributions.reduce((sum, c) => sum + c.tasksCompleted, 0);

  // My analytics summary
  const user = await User.findById(req.user.id)
    .select('collaborationScore leadershipScore technicalScore secondYearPerformance primaryDomain');

  // Forming teams looking for members
  const formingTeams = await Team.find({
    status: 'Forming',
    ...(req.user.collegeId ? { collegeId: req.user.collegeId } : {})
  })
    .populate('members.userId', 'name avatar primaryDomain')
    .populate('teamLead', 'name avatar')
    .populate('projectId', 'title requiredDomains')
    .limit(10);

  res.json({
    success: true,
    dashboard: {
      myTeam,
      activeSprint,
      myProposals,
      availableProjects,
      formingTeams,
      stats: {
        totalCommits,
        totalTasks,
        collaborationScore: user.collaborationScore,
        leadershipScore: user.leadershipScore,
        technicalScore: user.technicalScore,
        performance: user.secondYearPerformance,
        primaryDomain: user.primaryDomain
      }
    }
  });
});
