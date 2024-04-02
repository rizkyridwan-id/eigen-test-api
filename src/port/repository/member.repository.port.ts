import { BaseRepositoryPort } from './repository.base.port';
import { MemberEntity } from '../../module/member/domain/member.entity';
import { MemberMongoEntity } from '../../module/member/repository/member.mongo-entity';

export interface MemberRepositoryPort
  extends BaseRepositoryPort<MemberEntity, MemberMongoEntity> {
  __init__(): void; //this just a boilerplate, you can delete it.
}
