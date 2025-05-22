import express from 'express';
import sendMailResetPassword from './routes/sendMailResetPassword.route';

const router = express.Router();

// 🧭 routing
router.use('/', sendMailResetPassword);

export default router;
