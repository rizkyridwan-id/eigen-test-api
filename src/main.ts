import { Logger, NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { resolve } from 'path';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import helmet from 'helmet';
import * as ip from 'ip';
import { CustomLogger } from './infra/logger/logger';
import { AllExceptionFilter } from './core/base/http/base-http-exception.filter';
import { DebugLoggerInterceptor } from './core/interceptor/debug-logger.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const httpsMode = !!Number(process.env.HTTPS_MODE);
  const secureOptions: NestApplicationOptions =
    generateHttpsModeOption(httpsMode);

  const app = await NestFactory.create(AppModule, {
    ...secureOptions,
    logger: new CustomLogger(),
    cors: true, // change this to Client IP when Production
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalInterceptors(new DebugLoggerInterceptor());
  app.useGlobalFilters(new AllExceptionFilter());

  app.use(helmet());

  const options = new DocumentBuilder()
    .setTitle('Eigen 3 API Test')
    .setDescription('Eigen 3 Api Test. Book & Member Features.')
    .setVersion('1.5')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT;
  const host = '0.0.0.0';
  const logger = new Logger('NestBoilerplate');

  await app.listen(port, host, () => {
    logger.log(`Application Started at port: ${port}`);
    if (process.env.MODE == 'DEVELOPMENT')
      logger.log(`Current IP: ${ip.address()}`);
  });
}

function generateHttpsModeOption(httpsMode: boolean): NestApplicationOptions {
  if (httpsMode) {
    /**
     * Enter Your Https Certificate using below code
     *
     * @hint make sure you set 'HTTPS_MODE' field in env file to 1
     * @tips recommended for using absolute root path (/)
     * @optional __dirname + path/to/file
     */

    const privateKey = fs.readFileSync(
      resolve('/home/cert/private.key'),
      'utf-8',
    );
    const certificate = fs.readFileSync(
      resolve('/home/cert/certificate.crt'),
      'utf-8',
    );

    const credentials: HttpsOptions = {
      key: privateKey,
      cert: certificate,
      passphrase: '??',
    };
    return { httpsOptions: credentials };
  }
  return {};
}
bootstrap();
