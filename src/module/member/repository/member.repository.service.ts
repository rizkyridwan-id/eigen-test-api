import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  IFindMemberWithBookBorrowed,
  MemberRepositoryPort,
} from 'src/port/repository/member.repository.port';
import { MemberMongoEntity, MemberDocument } from './member.mongo-entity';

import { MemberEntity } from '../domain/member.entity';
import { MemberMapper } from '../domain/member.mapper';

import { BaseRepository } from 'src/core/base/module/repository.base';

@Injectable()
export class MemberRepository
  extends BaseRepository<MemberEntity, MemberMongoEntity>
  implements MemberRepositoryPort
{
  constructor(
    @InjectModel(MemberMongoEntity.name)
    private MemberModel: Model<MemberDocument>,
  ) {
    super(MemberModel, new MemberMapper(MemberMongoEntity));
  }

  __init__(): void {
    //this just a boilerplate, you can delete it
  }

  async findMemberWithBookBorrowed(
    identifier: FilterQuery<MemberMongoEntity>,
  ): Promise<IFindMemberWithBookBorrowed[]> {
    const aggregateResult = await this.MemberModel.aggregate([
      {
        $match: identifier,
      },
      {
        $lookup: {
          from: 'borrowings',
          let: { memberId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$$memberId', '$member_id'],
                },
                is_returned: false,
              },
            },
          ],
          as: 'borrowings',
        },
      },
      {
        $project: {
          name: '$name',
          code: '$code',
          input_date: '$input_date',
          penalized_date: '$penalized_date',
          book_borrowed: { $size: '$borrowings' },
        },
      },
    ]);

    return aggregateResult as IFindMemberWithBookBorrowed[];
  }
}
