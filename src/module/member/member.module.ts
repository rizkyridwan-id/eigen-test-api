import { Module } from '@nestjs/common';
import { MemberRepositoryModule } from './repository/member.repository.module';
import { MemberUseCaseModule } from './use-case/member.use-case.module';
import { MemberController } from './controller/member.controller';

@Module({
  imports: [MemberUseCaseModule, MemberRepositoryModule],
  controllers: [MemberController],
})
export class MemberModule {}
