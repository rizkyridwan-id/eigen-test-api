import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseMongoEntity } from 'src/core/base/domain/mongo-entity';

@Schema({ collection: 'borrowings' })
export class BorrowingMongoEntity extends BaseMongoEntity<
  typeof BorrowingMongoEntity
> {
  // Put your schema here
  @Prop({ type: String, required: true })
  trx_id: string;

  @Prop({ type: Types.ObjectId, ref: 'members', required: true })
  member_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'books', required: true })
  book_id: Types.ObjectId;

  @Prop({ type: Date, required: true })
  borrowed_date: Date;

  @Prop({ type: Date, required: true })
  due_date: Date;

  @Prop({ type: Date })
  return_date?: Date;

  @Prop({ type: Boolean, default: false })
  is_returned?: boolean;
}

export const BorrowingSchema =
  SchemaFactory.createForClass(BorrowingMongoEntity);
export const BorrowingModel = [
  { name: BorrowingMongoEntity.name, schema: BorrowingSchema },
];

export type BorrowingDocument = BorrowingMongoEntity & Document;
