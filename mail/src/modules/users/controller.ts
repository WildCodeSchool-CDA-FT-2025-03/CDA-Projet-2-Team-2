import type { RequestHandler } from 'express';
import { sendEmailByTemplate } from '../../utils/mails/send.mail';

/**
 * expected values in sendEmailByTemplate()
 * email {string} - user's email
 * subject {string} - subject of the email
 * emailTemplate {string} - .ejs file name
 * dataTemplate {object} - object with values ​​to include in the .ejs file
 */

const sendResetPassword: RequestHandler = async (req, res) => {
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
    console.error("Erreur lors de l'envoi de l'email:", error);
    res.sendStatus(500);
  }
};

export { sendResetPassword };
