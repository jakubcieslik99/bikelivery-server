import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

const throttlerConfig = {
  ttl: 60,
  limit: 15,
};

const throttlerServiceConfig = {
  provide: APP_GUARD,
  useClass: ThrottlerGuard,
};

export { throttlerConfig, throttlerServiceConfig };
