import { DbMapper, MongoEntityProps } from 'src/core/base/domain/db-mapper';
import { BorrowingEntity } from './borrowing.entity';
import { BorrowingMongoEntity } from '../repository/borrowing.mongo-entity';

export class BorrowingMapper extends DbMapper<
  BorrowingEntity,
  BorrowingMongoEntity
> {
  protected toMongoProps(
    entity: BorrowingEntity,
  ): MongoEntityProps<BorrowingMongoEntity> {
    const entityProps = entity.getPropsCopy();

    const mongoProps: MongoEntityProps<BorrowingMongoEntity> = {
      ...entityProps,
      member_id: entityProps.member_id.valueConverted,
      book_id: entityProps.book_id.valueConverted,
      // add domain field here
    };
    return mongoProps;
  }
}
