import { Module } from '@nestjs/common';
import { BorrowingRepositoryModule } from '../repository/borrowing.repository.module';
import { borrowingUseCaseProvider } from './borrowing.use-case.provider';
import { BookRepositoryModule } from 'src/module/book/repository/book.repository.module';
import { MemberRepositoryModule } from 'src/module/member/repository/member.repository.module';

@Module({
  imports: [
    BorrowingRepositoryModule,
    BookRepositoryModule,
    MemberRepositoryModule,
  ],
  exports: borrowingUseCaseProvider,
  providers: borrowingUseCaseProvider,
})
export class BorrowingUseCaseModule {}
