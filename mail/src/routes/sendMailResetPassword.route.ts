import express from 'express';
import { sendResetPassword } from '../modules/users/controller';
const router = express.Router();

// ⚙️ route to process email reset
router.post('/mail/login/init', sendResetPassword);

export default router;
