import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookRepositoryPort } from 'src/port/repository/book.repository.port';
import { BookMongoEntity, BookDocument } from './book.mongo-entity';

import { BookEntity } from '../domain/book.entity';
import { BookMapper } from '../domain/book.mapper';

import { BaseRepository } from 'src/core/base/module/repository.base';

@Injectable()
export class BookRepository
  extends BaseRepository<BookEntity, BookMongoEntity>
  implements BookRepositoryPort
{
  constructor(
    @InjectModel(BookMongoEntity.name) private BookModel: Model<BookDocument>,
  ) {
    super(BookModel, new BookMapper(BookMongoEntity));
  }

  __init__(): void {
    //this just a boilerplate, you can delete it
  }
}
