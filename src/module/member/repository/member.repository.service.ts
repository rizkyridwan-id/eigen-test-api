import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MemberRepositoryPort } from 'src/port/repository/member.repository.port';
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
}
