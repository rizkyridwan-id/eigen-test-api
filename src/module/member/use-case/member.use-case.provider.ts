import { Provider } from '@nestjs/common';
import { CreateMember } from './create-member.use-case';
import { GetMember } from './get-member.use-case';
import { UpdateMember } from './update-member.use-case';
import { DeleteMember } from './delete-member.use-case';

export const memberUseCaseProvider: Provider[] = [
  CreateMember,
  GetMember,
  UpdateMember,
  DeleteMember,
];
