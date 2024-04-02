import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BorrowingModel } from './borrowing.mongo-entity';
import { borrowingRepositoryProvider } from './borrowing.repository.provider';

@Module({
  imports: [MongooseModule.forFeature(BorrowingModel)],
  providers: [borrowingRepositoryProvider],
  exports: [borrowingRepositoryProvider],
})
export class BorrowingRepositoryModule {}
