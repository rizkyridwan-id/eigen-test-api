import { Provider } from '@nestjs/common';
import { BorrowBook } from './borrow-book.use-case';

export const borrowingUseCaseProvider: Provider[] = [BorrowBook];
