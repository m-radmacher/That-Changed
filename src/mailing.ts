import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as core from '@actions/core';
import chalk from 'chalk';
import { getEnglishEmailSubject, getGermanEmailSubject } from './i18n';

export function createMailTransport(host: string, port: number, secure: boolean, user: string, password: string) {
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass: password,
    },
  });
  return transporter;
}

export async function verifyMailTransporter(transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>) {
  return transporter.verify((error) => {
    if (error) {
      console.log(chalk.bgRedBright('Could not establish connection to SMTP server.'));
      core.setFailed(error.message);
    }
  });
}

export async function sendChangelogMail(
  transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>,
  to: string[],
  from: string,
  language: string,
  head: string,
  base: string
) {
  for (const recipient of to) {
    await transporter.sendMail({
      from,
      cc: recipient,
      subject: language === 'de' ? getGermanEmailSubject(base, head) : getEnglishEmailSubject(base, head),
      attachments: [
        {
          path: 'D:/temp/changelog/output.pdf',
        },
      ],
    });
  }
}
