import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api'); //Set all route start with /api
    app.useGlobalPipes(new I18nValidationPipe({ whitelist: true }));
    app.useGlobalFilters(new I18nValidationExceptionFilter({ detailedErrors: false }));
    await app.listen(process.env.PORT || 3000);
}

void bootstrap();
