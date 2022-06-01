import { Injectable, Logger } from '@nestjs/common';
import Decimal from 'decimal.js';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor() {
    this.logger.debug('hello');
    const a = new Decimal(123);
    this.logger.debug(a);
    setTimeout(() => {
      this.logger.debug('hello2');
      this.logger.debug(a);
    }, 2000);
  }
  getHello(): string {
    return 'Hello World!';
  }
}
