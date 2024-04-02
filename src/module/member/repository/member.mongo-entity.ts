import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseMongoEntity } from 'src/core/base/domain/mongo-entity';

@Schema({ collection: 'member' })
export class MemberMongoEntity extends BaseMongoEntity<
  typeof MemberMongoEntity
> {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  code: string;

  @Prop()
  input_date?: Date;
}

export const MemberSchema = SchemaFactory.createForClass(MemberMongoEntity);
export const MemberModel = [
  { name: MemberMongoEntity.name, schema: MemberSchema },
];

export type MemberDocument = MemberMongoEntity & Document;
