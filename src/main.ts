// @dsp obj-82e23068
import 'dotenv/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';
import { AppModule } from './app.module';
import { GlobalConfig } from './lib/infra';

// @dsp func-17f0a748
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: (origin, cb) => cb(null, true),
    credentials: true,
  });

  const globalConfig = app.get(GlobalConfig);
  const logger = new Logger();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  if (globalConfig.isProd) {
    app.set('trust proxy', 1);
  }

  const globalPrefix = globalConfig.APP_PREFIX;
  app.setGlobalPrefix(globalPrefix);
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb' }));

  const config = new DocumentBuilder()
    .setTitle('API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`/${globalPrefix}/docs`, app, document);

  await app.listen(globalConfig.APP_PORT);
  logger.log(
    `Application is running on: http://localhost:${globalConfig.APP_PORT}/${globalPrefix}/docs`,
  );
}

void bootstrap();
