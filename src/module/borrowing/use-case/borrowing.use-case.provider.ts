import { Provider } from '@nestjs/common';
import { BorrowBook } from './borrow-book.use-case';
import { ReturnBook } from './return-book.use-case';
import { GetBorrowing } from './get-borrowing.use-case';

export const borrowingUseCaseProvider: Provider[] = [
  BorrowBook,
  ReturnBook,
  GetBorrowing,
];
