import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
import pino from 'pino';

const logger = pino({
  level: 'debug',
});

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: logger,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
