import { sendEmail } from '../transporter';
import ejs from 'ejs';

type EmailOptions = {
  email: string;
  subject: string;
  emailTemplate: string; // 💡 represents file that represents the body of the email to be sent (.ejs file)
  dataTemplate: Record<string, string>; // 💡  // Allows for a flexible object with any string keys (like doctor, date, etc.) and string values. This ensures we can pass dynamic data into the EJS email template without TypeScript errors.
};
export const sendEmailByTemplate = async ({
  email,
  subject,
  emailTemplate,
  dataTemplate,
}: EmailOptions): Promise<void> => {
  const emailHtml = await ejs.renderFile(__dirname + `/../../views/templates/${emailTemplate}`, {
    dataTemplate,
  });

  await sendEmail({
    to: email,
    subject: subject,
    html: emailHtml,
  });
};

export const sendAppointementConfirmation = async (
  email: string,
  doctor: string,
  date: string,
  hour: string
): Promise<void> => {
  const subject = 'Confirmation de votre rendez-vous';
  const emailTemplate = 'appointmentConfirmation.ejs';

  const dataTemplate = {
    doctor,
    date,
    hour,
  };

  await sendEmailByTemplate({
    email,
    subject,
    emailTemplate,
    dataTemplate,
  });
};
