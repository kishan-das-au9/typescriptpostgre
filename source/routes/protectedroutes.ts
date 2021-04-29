import express from 'express';

const router = express.Router();

// Add all protected routes
router.use('/', require('../routes/categories'));

export = router;
