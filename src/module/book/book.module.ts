import { Module } from '@nestjs/common';
import { BookRepositoryModule } from './repository/book.repository.module';
import { BookUseCaseModule } from './use-case/book.use-case.module';
import { BookController } from './controller/book.controller';

@Module({
  imports: [BookUseCaseModule, BookRepositoryModule],
  controllers: [BookController],
})
export class BookModule {}
