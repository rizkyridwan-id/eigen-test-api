import { Entity } from 'src/core/base/domain/entity';
import { StockVO } from './value-object/stock.value-object';

export interface BookProps {
  // put field interface here
  code: string;
  title: string;
  author: string;
  stock: StockVO;
  stock_borrowed: number;
  input_date: Date;
}

export class BookEntity extends Entity<BookProps> {
  constructor(props: BookProps) {
    super(props);
  }
}
