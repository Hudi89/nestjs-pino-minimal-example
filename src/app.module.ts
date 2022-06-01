import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
import pino from 'pino';
import Decimal from 'decimal.js';
import { Logger } from 'nestjs-pino';

const logger = pino({
  level: 'debug',
  hooks: {
    logMethod(args: any[], method: pino.LogFn, level: number): any {
      for (let i = 1; i < args.length; ++i) {
        if (args[i] instanceof Decimal) {
          args[i] = `${args[i]}`;
        }
      }

      return method.apply(this, args);
    },
  },
});

// Monkey patch the actual main function of the nest-pino, because they mess up the passed object to the logger
// @ts-ignore
Logger.prototype.call = function (
  level: pino.Level,
  message: any,
  ...optionalParams: any[]
) {
  const objArg: Record<string, any> = {};

  // optionalParams contains extra params passed to logger
  // context name is the last item
  let params: any[] = [];
  if (optionalParams.length !== 0) {
    objArg[this.contextName] = optionalParams[optionalParams.length - 1];
    params = optionalParams.slice(0, -1);
  }

  if (typeof message === 'object') {
    if (message instanceof Error) {
      objArg.err = message;
    }
    this.logger[level](objArg, message, ...params);
  } else if (this.isWrongExceptionsHandlerContract(level, message, params)) {
    objArg.err = new Error(message);
    objArg.err.stack = params[0];
    this.logger[level](objArg);
  } else {
    this.logger[level](objArg, message, ...params);
  }
};

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: { logger },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
