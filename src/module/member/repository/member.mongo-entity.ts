import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseMongoEntity } from 'src/core/base/domain/mongo-entity';

@Schema({ collection: 'member' })
export class MemberMongoEntity extends BaseMongoEntity<
  typeof MemberMongoEntity
> {
  // Put your schema here
}

export const MemberSchema = SchemaFactory.createForClass(MemberMongoEntity);
export const MemberModel = [
  { name: MemberMongoEntity.name, schema: MemberSchema },
];

export type MemberDocument = MemberMongoEntity & Document;
