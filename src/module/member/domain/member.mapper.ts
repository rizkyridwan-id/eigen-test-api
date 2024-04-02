import { DbMapper, MongoEntityProps } from 'src/core/base/domain/db-mapper';
import { MemberEntity } from './member.entity';
import { MemberMongoEntity } from '../repository/member.mongo-entity';

export class MemberMapper extends DbMapper<MemberEntity, MemberMongoEntity> {
  protected toMongoProps(
    entity: MemberEntity,
  ): MongoEntityProps<MemberMongoEntity> {
    const entityProps = entity.getPropsCopy();

    const mongoProps: MongoEntityProps<MemberMongoEntity> = {
      ...entityProps,
      code: entityProps.code.value,
      // add domain field here
    };
    return mongoProps;
  }
}
