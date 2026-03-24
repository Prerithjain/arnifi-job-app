    const router = require('express').Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const { getAllJobs, createJob, updateJob, deleteJob } = require('../controllers/jobsController');

router.get('/', authenticate, getAllJobs);
router.post('/', authenticate, requireAdmin, createJob);
router.put('/:id', authenticate, requireAdmin, updateJob);
router.delete('/:id', authenticate, requireAdmin, deleteJob);

module.exports = router;