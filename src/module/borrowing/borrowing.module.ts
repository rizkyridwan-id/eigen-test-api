import { Module } from '@nestjs/common';
import { BorrowingRepositoryModule } from './repository/borrowing.repository.module';
import { BorrowingUseCaseModule } from './use-case/borrowing.use-case.module';
import { BorrowingController } from './controller/borrowing.controller';

@Module({
  imports: [BorrowingUseCaseModule, BorrowingRepositoryModule],
  controllers: [BorrowingController],
})
export class BorrowingModule {}
