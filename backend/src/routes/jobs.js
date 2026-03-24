const router = require('express').Router();

const { authenticate, requireAdmin } = require('../middleware/auth');

const {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
  applyToJob,
  getMyApplications
} = require('../controllers/jobsController');

// 🔹 Special routes FIRST (before :id)
router.get('/applications', authenticate, getMyApplications);

// 🔹 Apply to job
router.post('/:id/apply', authenticate, applyToJob);

// 🔹 General routes
router.get('/', authenticate, getAllJobs);

// 🔹 Admin-only routes
router.post('/', authenticate, requireAdmin, createJob);
router.put('/:id', authenticate, requireAdmin, updateJob);
router.delete('/:id', authenticate, requireAdmin, deleteJob);

module.exports = router;