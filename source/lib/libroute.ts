import express from 'express';

const router = express.Router();

// access by all
router.use('/', require('../routes/book'));

// Add all protected routes
router.use('/', require('../routes/protectedroutes'));

export = router;
