import nodemailer from 'nodemailer';
import { logWithSeparator } from '../utils/log';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, // use 465 for SSL
  secure: true,
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    let info = await transporter.sendMail({
      from: 'Site tracker',
      to,
      subject,
      text,
    });

    !!info.accepted.length &&
      logWithSeparator(`Email to address ${to} was sent.`);
  } catch (err: any) {
    console.warn('Error sending email', err);
  }
};

export default sendEmail;
