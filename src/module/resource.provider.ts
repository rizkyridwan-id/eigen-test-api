import { BookModule } from './book/book.module';
import { MemberModule } from './member/member.module';

export const resourceProviders = [BookModule, MemberModule];
