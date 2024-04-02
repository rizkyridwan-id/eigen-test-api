import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberModel } from './member.mongo-entity';
import { memberRepositoryProvider } from './member.repository.provider';

@Module({
  imports: [MongooseModule.forFeature(MemberModel)],
  providers: [memberRepositoryProvider],
  exports: [memberRepositoryProvider],
})
export class MemberRepositoryModule {}
