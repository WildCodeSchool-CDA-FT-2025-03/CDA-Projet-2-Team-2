import express from 'express';
import { sendAppointementConfirmation } from '../utils/mails/send.mail';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, doctor, date, hour } = req.body;
  try {
    await sendAppointementConfirmation(email, doctor, date, hour);
    res.status(200).json({ message: 'Confirmation envoyée avec succès.' });
  } catch (error) {
    console.error('Erreur lors de l’envoi du mail :', error);
    res.status(500).json({ error: 'Erreur lors de l’envoi de la confirmation.' });
  }
});

export default router;
