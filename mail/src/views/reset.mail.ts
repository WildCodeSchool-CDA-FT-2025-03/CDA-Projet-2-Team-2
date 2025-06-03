import path from 'path';
import { sendEmail } from '../utils/transporter';
import ejs from 'ejs';

type EmailOptions = {
  email: string;
  subject: string;
  emailTemplate: string;
  dataTemplate: { url: string; email?: string }; // ajouter ici toutes les valeurs à incoporer dans le coprs du mail
};
export const sendEmailByTemplate = async ({
  email,
  subject,
  emailTemplate,
  dataTemplate,
}: EmailOptions): Promise<void> => {
  const emailHtml = await ejs.renderFile(__dirname + `/templates/${emailTemplate}`, {
    dataTemplate,
  });

  await sendEmail({
    to: email,
    subject: subject,
    html: emailHtml,
  });
};
