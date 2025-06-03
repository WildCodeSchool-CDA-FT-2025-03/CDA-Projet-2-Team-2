import type { RequestHandler } from 'express';
import { sendEmailByTemplate } from '../../views/reset.mail';

const sendResetPassword: RequestHandler = async (req, res, next) => {
  const { email, url } = req.body;

  try {
    await sendEmailByTemplate({
      email,
      subject: '📧 Réinitialisation de mot de passe utilisateur - DoctoPlan',
      emailTemplate: 'resetMail.ejs',
      dataTemplate: { url },
    });
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

// exemple : activation du login

const activateLogin: RequestHandler = async (req, res, next) => {
  const { email, url } = req.body;

  try {
    await sendEmailByTemplate({
      email,
      subject: '📧 Activation du mot de passe - DoctoPlan',
      emailTemplate: 'activateLogin.ejs',
      dataTemplate: { url },
    });
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export { sendResetPassword, activateLogin };
