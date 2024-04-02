import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseMongoEntity } from 'src/core/base/domain/mongo-entity';

@Schema({ collection: 'book' })
export class BookMongoEntity extends BaseMongoEntity<typeof BookMongoEntity> {
  // Put your schema here
}

export const BookSchema = SchemaFactory.createForClass(BookMongoEntity);
export const BookModel = [{ name: BookMongoEntity.name, schema: BookSchema }];

export type BookDocument = BookMongoEntity & Document;
