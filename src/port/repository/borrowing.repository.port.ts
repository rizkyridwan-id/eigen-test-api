import { BaseRepositoryPort } from './repository.base.port';
import { BorrowingEntity } from '../../module/borrowing/domain/borrowing.entity';
import { BorrowingMongoEntity } from '../../module/borrowing/repository/borrowing.mongo-entity';

export interface BorrowingRepositoryPort
  extends BaseRepositoryPort<BorrowingEntity, BorrowingMongoEntity> {
	__init__(): void //this just a boilerplate, you can delete it.
}
