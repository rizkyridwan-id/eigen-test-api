import { Inject, Provider } from '@nestjs/common';
import { MemberRepository } from './member.repository.service';

export const InjectMemberRepository = Inject(MemberRepository.name);

export const memberRepositoryProvider: Provider = {
  provide: MemberRepository.name,
  useClass: MemberRepository,
};
