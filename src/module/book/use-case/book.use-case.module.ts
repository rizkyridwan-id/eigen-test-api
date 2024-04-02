import { Module } from '@nestjs/common';
import { BookRepositoryModule } from '../repository/book.repository.module';
import { bookUseCaseProvider } from './book.use-case.provider';

@Module({
  imports: [BookRepositoryModule],
  exports: bookUseCaseProvider,
  providers: bookUseCaseProvider,
})
export class BookUseCaseModule {}
