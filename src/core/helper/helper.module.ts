import { Global, Module } from '@nestjs/common';
import { EnvModule } from 'src/infra/config/env.module';
import { HashService } from './module/hash.service';
import { transactionProvider } from './module/transaction/transaction.provider';

@Global()
@Module({
  imports: [EnvModule],
  providers: [HashService, ...transactionProvider],
  exports: [HashService, ...transactionProvider],
})
export class HelperModule {}
