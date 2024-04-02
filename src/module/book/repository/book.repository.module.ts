import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookModel } from './book.mongo-entity';
import { bookRepositoryProvider } from './book.repository.provider';

@Module({
  imports: [MongooseModule.forFeature(BookModel)],
  providers: [bookRepositoryProvider],
  exports: [bookRepositoryProvider],
})
export class BookRepositoryModule {}
