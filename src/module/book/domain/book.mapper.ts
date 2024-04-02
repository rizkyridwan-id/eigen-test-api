import { DbMapper, MongoEntityProps } from 'src/core/base/domain/db-mapper';
import { BookEntity } from './book.entity';
import { BookMongoEntity } from '../repository/book.mongo-entity';

export class BookMapper extends DbMapper<BookEntity, BookMongoEntity> {
  protected toMongoProps(
    entity: BookEntity,
  ): MongoEntityProps<BookMongoEntity> {
    const entityProps = entity.getPropsCopy();

    const mongoProps: MongoEntityProps<BookMongoEntity> = {
      ...entityProps,
      // add domain field here
    };
    return mongoProps;
  }
}
