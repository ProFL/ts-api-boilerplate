import * as nodemailer from 'nodemailer';
import * as url from 'url';
import Container from 'typedi';
import {Logger} from 'winston';
import getEnvSecret from '../helpers/get-env-secret.helper';
import {CONSTANT_KEYS} from '../helpers/enums/constants.enum';

export interface SMTPTransport {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export default async function mailConfig(): Promise<void> {
  const nodeEnv = await getEnvSecret('NODE_ENV');
  const logger: Logger = Container.get(CONSTANT_KEYS.LOGGER);

  let account: SMTPTransport;

  try {
    // smtp://user:pass@host:port/?secure=true
    const smtpUrl = url.parse(await getEnvSecret('SMTP_URL'));
    const [user, pass] = smtpUrl.auth.split(':');
    account = {
      host: smtpUrl.host,
      port: parseInt(smtpUrl.port, 10),
      secure: /secure=true/.test(smtpUrl.query),
      auth: {user, pass},
    };
  } catch (err) {
    if (nodeEnv !== 'production') {
      logger.info(
        `> SMTP settings not found, using ethereal.mail ${JSON.stringify(err)}`,
      );
    } else {
      logger.error(err);
      process.exit(1);
    }
  }

  if (!account) {
    const testAccount = await nodemailer.createTestAccount();

    account = {
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    };
  }

  const transporter = nodemailer.createTransport(account);

  Container.set(CONSTANT_KEYS.MAIL_TRANSPORTER, transporter);
}
