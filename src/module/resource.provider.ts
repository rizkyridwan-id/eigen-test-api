import { BookModule } from './book/book.module';
import { BorrowingModule } from './borrowing/borrowing.module';
import { MemberModule } from './member/member.module';

export const resourceProviders = [BookModule, MemberModule, BorrowingModule];
