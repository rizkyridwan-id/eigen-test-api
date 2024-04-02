import { BaseRepositoryPort } from './repository.base.port';
import { BookEntity } from '../../module/book/domain/book.entity';
import { BookMongoEntity } from '../../module/book/repository/book.mongo-entity';

export interface BookRepositoryPort
  extends BaseRepositoryPort<BookEntity, BookMongoEntity> {
  __init__(): void; //this just a boilerplate, you can delete it.
}
