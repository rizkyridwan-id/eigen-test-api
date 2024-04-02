import { Inject, Provider } from '@nestjs/common';
import { BookRepository } from './book.repository.service';

export const InjectBookRepository = Inject(BookRepository.name);

export const bookRepositoryProvider: Provider = {
  provide: BookRepository.name,
  useClass: BookRepository,
};
