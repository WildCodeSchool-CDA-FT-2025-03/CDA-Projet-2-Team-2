import type { RequestHandler } from 'express';
import { resetPassword } from '../../utils/mails/reset.mail';

const sendResetPassword: RequestHandler = async (req, res, next) => {
  const { email, url } = req.body;
  try {
    await resetPassword(email, url);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export { sendResetPassword };
