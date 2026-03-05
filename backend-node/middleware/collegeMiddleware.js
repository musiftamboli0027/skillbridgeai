const preserveCollegeIsolation = (req, res, next) => {
    // Ensure all queries going to DB are filtered by the user's collegeId implicitly,
    // if the user is a student. Admins might not need this restriction depending on their role.
    if (!req.user || !req.user.collegeId) {
        return res.status(403).json({ success: false, message: 'Institutional alignment verification failed. College ID missing.' });
    }

    // Attach college filter to the request for controllers to use easily
    req.collegeFilter = { collegeId: req.user.collegeId };
    
    // Some resources might be global (isGlobal: true)
    req.collegeOrGlobalFilter = { 
        $or: [
            { collegeId: req.user.collegeId },
            { isGlobal: true }
        ]
    };

    next();
};

module.exports = preserveCollegeIsolation;
