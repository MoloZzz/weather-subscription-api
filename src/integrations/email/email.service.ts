import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { WeatherResponseDto } from 'src/common/dtos';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;
    private readonly logger = new Logger(EmailService.name);

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('SMTP_HOST'),
            port: this.configService.get<number>('SMTP_PORT'),
            secure: this.configService.get<number>('SMTP_SECURE'),
            auth: {
                user: this.configService.get<string>('SMTP_USER'),
                pass: this.configService.get<string>('SMTP_PASS'),
            },
        });
    }

    async sendConfirmationEmail(to: string, token: string): Promise<void> {
        const subject = 'Confirm your email';
        const html = `
      <h1>Email Confirmation</h1>
      <p>Your token printed below,use it to confirm your email:</p>
      <h4>Your token ${token}</h4>`;
        try {
            await this.transporter.sendMail({ from: 'Weather notificator', to, subject, html });

            this.logger.log(`Confirmation email sent to ${to}`);
        } catch (error) {
            this.logger.error(`Failed to send email to ${to}`, error.stack);
            throw new InternalServerErrorException('Failed to send confirmation email');
        }
    }

    async sendWeatherData(email: string, weather: WeatherResponseDto, cityName: string): Promise<void> {
        const subject = `Your Weather for ${cityName}`;
        const html = `
      <h1>Weather Forecast</h1>
      <p><strong>Description:</strong> ${weather.description}</p>
      <p><strong>Temperature:</strong> ${weather.temperature}°C</p>
      <p><strong>Humidity:</strong> ${weather.humidity}%</p>
    `;

        try {
            await this.transporter.sendMail({
                from: 'Weather notificator <no-reply@yourdomain.com>',
                to: email,
                subject,
                html,
            });

            this.logger.log(`Weather data email sent to ${email}`);
        } catch (error) {
            this.logger.error(`Failed to send weather data email to ${email}`, error.stack);
            throw new InternalServerErrorException('Failed to send weather data email');
        }
    }
}
