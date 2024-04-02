import { Entity } from 'src/core/base/domain/entity';

export interface BookProps {
  // put field interface here
  name: string;
}

export class BookEntity extends Entity<BookProps> {
  constructor(props: BookProps) {
    super(props);
  }
}
