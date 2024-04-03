import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  BorrowingRepositoryPort,
  IBorrowingPopulated,
} from 'src/port/repository/borrowing.repository.port';
import {
  BorrowingMongoEntity,
  BorrowingDocument,
} from './borrowing.mongo-entity';

import { BorrowingEntity } from '../domain/borrowing.entity';
import { BorrowingMapper } from '../domain/borrowing.mapper';

import { BaseRepository } from 'src/core/base/module/repository.base';

@Injectable()
export class BorrowingRepository
  extends BaseRepository<BorrowingEntity, BorrowingMongoEntity>
  implements BorrowingRepositoryPort
{
  constructor(
    @InjectModel(BorrowingMongoEntity.name)
    private BorrowingModel: Model<BorrowingDocument>,
  ) {
    super(BorrowingModel, new BorrowingMapper(BorrowingMongoEntity));
  }

  __init__(): void {
    //this just a boilerplate, you can delete it
  }

  findBorrowingPopulated(
    identifier: FilterQuery<BorrowingMongoEntity>,
  ): Promise<IBorrowingPopulated[]> {
    return this.BorrowingModel.aggregate([
      {
        $match: identifier,
      },
      {
        $lookup: {
          from: 'members',
          localField: 'member_id',
          foreignField: '_id',
          as: 'member',
        },
      },
      {
        $lookup: {
          from: 'books',
          localField: 'book_id',
          foreignField: '_id',
          as: 'book',
        },
      },
      {
        $unwind: '$member',
      },
      {
        $unwind: '$book',
      },
    ]);
  }
}
