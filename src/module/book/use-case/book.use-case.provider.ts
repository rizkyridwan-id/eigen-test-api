import { Provider } from '@nestjs/common';
import { CreateBook } from './create-book.use-case';
import { UpdateBook } from './update-book.use-case';
import { DeleteBook } from './delete-book.use-case';
import { GetBook } from './get-book.use-case';

export const bookUseCaseProvider: Provider[] = [
  CreateBook,
  UpdateBook,
  DeleteBook,
  GetBook,
];
