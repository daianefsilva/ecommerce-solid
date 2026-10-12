export interface MailMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface IMailProvider {
  sendMail(message: MailMessage): Promise<string | null>;
}