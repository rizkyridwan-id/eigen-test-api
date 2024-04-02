import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BorrowingRepositoryPort } from 'src/port/repository/borrowing.repository.port';
import { BorrowingMongoEntity, BorrowingDocument } from './borrowing.mongo-entity';

import { BorrowingEntity } from '../domain/borrowing.entity';
import { BorrowingMapper } from '../domain/borrowing.mapper';

import { BaseRepository } from 'src/core/base/module/repository.base';

@Injectable()
export class BorrowingRepository
  extends BaseRepository<BorrowingEntity, BorrowingMongoEntity>
  implements BorrowingRepositoryPort {
  constructor(
    @InjectModel(BorrowingMongoEntity.name) private BorrowingModel: Model<BorrowingDocument>
  ) {
    super(BorrowingModel, new BorrowingMapper(BorrowingMongoEntity))
  }

  __init__(): void {
    //this just a boilerplate, you can delete it
  }
}
