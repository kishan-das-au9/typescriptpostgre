import express from 'express';

const router = express.Router();

// Add all protected routes
router.use('/', require('../routes/categories'));
router.use('/', require('../routes/section'));
router.use('/', require('../routes/author'));
router.use('/', require('../routes/publisher'));

export = router;
