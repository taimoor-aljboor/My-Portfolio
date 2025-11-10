import nodemailer from 'nodemailer';

export type ContactEmailPayload = {
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  locale: string;
  recipients: string[];
  settingsSmtp?: Record<string, unknown> | null;
};

type SmtpConfig = {
  host: string;
  port: number;
  secure?: boolean;
  user: string;
  pass: string;
};

function resolveSmtpConfig(settingsSmtp?: Record<string, unknown> | null): SmtpConfig | null {
  const envConfig = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : undefined,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  } satisfies Partial<SmtpConfig>;

  if (envConfig.host && envConfig.port && envConfig.user && envConfig.pass) {
    return {
      host: envConfig.host,
      port: envConfig.port,
      secure: envConfig.secure ?? envConfig.port === 465,
      user: envConfig.user,
      pass: envConfig.pass,
    };
  }

  if (!settingsSmtp) return null;

  const host = settingsSmtp['host'];
  const portValue = settingsSmtp['port'];
  const secure = settingsSmtp['secure'];
  const user = settingsSmtp['user'] ?? settingsSmtp['username'] ?? settingsSmtp['authUser'];
  const pass = settingsSmtp['pass'] ?? settingsSmtp['password'] ?? settingsSmtp['authPass'];

  const port =
    typeof portValue === 'number'
      ? portValue
      : typeof portValue === 'string'
        ? Number(portValue)
        : undefined;

  if (
    typeof host === 'string' &&
    typeof port === 'number' && Number.isFinite(port) &&
    typeof user === 'string' &&
    typeof pass === 'string'
  ) {
    return {
      host,
      port,
      secure: typeof secure === 'boolean' ? secure : port === 465,
      user,
      pass,
    };
  }

  return null;
}

export async function sendContactEmail(payload: ContactEmailPayload) {
  if (!payload.recipients || payload.recipients.length === 0) return;

  const smtpConfig = resolveSmtpConfig(payload.settingsSmtp ?? null);
  if (!smtpConfig) {
    console.warn('SMTP configuration missing, skipping email notification');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure ?? smtpConfig.port === 465,
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.pass,
    },
  });

  const subject = `New contact message from ${payload.name}`;
  const text = `Name: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone ?? 'N/A'}\nLocale: ${payload.locale}\n\n${payload.message}`;

  await transporter.sendMail({
    from: payload.email,
    to: payload.recipients.join(','),
    subject,
    text,
  });
}
