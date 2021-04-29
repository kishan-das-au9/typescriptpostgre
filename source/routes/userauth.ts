import express from 'express';
import user from '../controllers/auth';

const router = express.Router();

router.post('/authcheck', user.authCheck);

export = router;
