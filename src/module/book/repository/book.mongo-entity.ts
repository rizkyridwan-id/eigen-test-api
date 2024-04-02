import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseMongoEntity } from 'src/core/base/domain/mongo-entity';

@Schema({ collection: 'books' })
export class BookMongoEntity extends BaseMongoEntity<typeof BookMongoEntity> {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  stock: number;

  @Prop({ default: 0 })
  stock_borrowed?: number;

  @Prop({ required: true })
  input_date: Date;
}

export const BookSchema = SchemaFactory.createForClass(BookMongoEntity);
export const BookModel = [{ name: BookMongoEntity.name, schema: BookSchema }];

export type BookDocument = BookMongoEntity & Document;
