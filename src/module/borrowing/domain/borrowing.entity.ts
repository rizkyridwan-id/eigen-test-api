import { Entity } from 'src/core/base/domain/entity';
import { ObjectIdVO } from 'src/core/value-object/object-id.value-object';

export interface BorrowingProps {
  // put field interface here
  trx_id: string;
  member_id: ObjectIdVO;
  book_id: ObjectIdVO;
  borrowed_date: Date;
  due_date: Date;
}

export class BorrowingEntity extends Entity<BorrowingProps> {
  constructor(props: BorrowingProps) {
    super(props);
  }
}
