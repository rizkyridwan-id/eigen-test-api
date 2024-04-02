import { Module } from '@nestjs/common';
import { MemberRepositoryModule } from '../repository/member.repository.module';
import { memberUseCaseProvider } from './member.use-case.provider';

@Module({
  imports: [MemberRepositoryModule],
  exports: memberUseCaseProvider,
  providers: memberUseCaseProvider,
})
export class MemberUseCaseModule {}
