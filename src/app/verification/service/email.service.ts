import { Injectable, Logger } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;
  private readonly logger = new Logger(EmailService.name);
  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: configService.get<string>('MAIL_ID'),
        pass: configService.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  async sendMail(emailAddress: string, authCode: string, mailTitle: string) {
    // 메일 본문 구성 form 태그를 이용해 POST 요청 실시
    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: `${mailTitle} : 대학생 인증 메일`,
      html: `대학생 인증 번호는 "${authCode}" 입니다. </br> 인증번호를 제대로 입력해주세요`,
    };

    this.logger.log(`Send to - ${emailAddress}`);
    this.logger.log(`Send AuthCode - ${authCode}`);

    // transporter 객체를 이용해 메일 전송
    return this.transporter.sendMail(mailOptions);
  }
}
