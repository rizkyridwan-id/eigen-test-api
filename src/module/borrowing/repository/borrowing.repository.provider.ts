import { Inject, Provider } from '@nestjs/common';
import { BorrowingRepository } from './borrowing.repository.service';

export const InjectBorrowingRepository = Inject(BorrowingRepository.name);

export const borrowingRepositoryProvider: Provider = {
  provide: BorrowingRepository.name,
  useClass: BorrowingRepository,
};
