const pool = require('../config/db');

const getAllJobs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT j.*, u.name AS admin_name 
      FROM jobs j 
      JOIN users u ON j.admin_id = u.id 
      ORDER BY j.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createJob = async (req, res) => {
  const { company_name, position, type, location } = req.body;
  if (!company_name || !position || !type || !location)
    return res.status(400).json({ error: 'All fields required' });

  try {
    const result = await pool.query(
      'INSERT INTO jobs (company_name, position, type, location, admin_id) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [company_name, position, type, location, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateJob = async (req, res) => {
  const { id } = req.params;
  const { company_name, position, type, location } = req.body;

  try {
    const check = await pool.query('SELECT admin_id FROM jobs WHERE id=$1', [id]);
    if (!check.rows.length) return res.status(404).json({ error: 'Job not found' });
    if (check.rows[0].admin_id !== req.user.id)
      return res.status(403).json({ error: 'You can only edit your own jobs' });

    const result = await pool.query(
      'UPDATE jobs SET company_name=$1, position=$2, type=$3, location=$4 WHERE id=$5 RETURNING *',
      [company_name, position, type, location, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const deleteJob = async (req, res) => {
  const { id } = req.params;
  try {
    const check = await pool.query('SELECT admin_id FROM jobs WHERE id=$1', [id]);
    if (!check.rows.length) return res.status(404).json({ error: 'Job not found' });
    if (check.rows[0].admin_id !== req.user.id)
      return res.status(403).json({ error: 'You can only delete your own jobs' });

    await pool.query('DELETE FROM jobs WHERE id=$1', [id]);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const applyToJob = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await pool.query('SELECT id FROM jobs WHERE id=$1', [id]);
    if (!job.rows.length) return res.status(404).json({ error: 'Job not found' });

    await pool.query(
      'INSERT INTO applications (user_id, job_id) VALUES ($1,$2)',
      [req.user.id, id]
    );
    res.status(201).json({ message: 'Applied successfully' });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Already applied' });
    res.status(500).json({ error: err.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT j.*, a.applied_at 
      FROM applications a 
      JOIN jobs j ON a.job_id = j.id 
      WHERE a.user_id = $1 
      ORDER BY a.applied_at DESC
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllJobs, createJob, updateJob, deleteJob, applyToJob, getMyApplications };
