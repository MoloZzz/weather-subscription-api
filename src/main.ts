import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExceptionsFilter } from './common/filters/exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new ExceptionsFilter());
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // then validator will strip validated object of any properties that do not have any decorators (ValidatorOptions)
            transform: true, // allow automatic transformation of incoming data (ValidationPipeOptions)
            transformOptions: {
                enableImplicitConversion: true, // enable transformation of data types (ClassTransformOptions)
            },
        }),
    );
    const configService = app.get(ConfigService);

    if (configService.get<string>('API_DOCS_ENABLED') === 'true') {
        const config = new DocumentBuilder()
            .setTitle('Weather Forecast API')
            .setDescription('Weather API application that allows users to subscribe to weather updates for their city.')
            .setVersion('1.0.0')
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api/api-docs', app, document);
    }
    await app.listen(configService.get<number>('PORT'));
}
bootstrap();
