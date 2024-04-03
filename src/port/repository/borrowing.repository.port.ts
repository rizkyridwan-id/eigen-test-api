import { BaseRepositoryPort } from './repository.base.port';
import { BorrowingEntity } from '../../module/borrowing/domain/borrowing.entity';
import { BorrowingMongoEntity } from '../../module/borrowing/repository/borrowing.mongo-entity';
import { MemberMongoEntity } from 'src/module/member/repository/member.mongo-entity';
import { BookMongoEntity } from 'src/module/book/repository/book.mongo-entity';
import { FilterQuery } from 'mongoose';

export interface IBorrowingPopulated extends BorrowingMongoEntity {
  member: MemberMongoEntity;
  book: BookMongoEntity;
}
export interface BorrowingRepositoryPort
  extends BaseRepositoryPort<BorrowingEntity, BorrowingMongoEntity> {
  __init__(): void; //this just a boilerplate, you can delete it.

  findBorrowingPopulated(
    identifier: FilterQuery<BorrowingMongoEntity>,
  ): Promise<IBorrowingPopulated[]>;
}
