import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';

import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { InjectMemberRepository } from '../repository/member.repository.provider';
import { MemberRepositoryPort } from 'src/port/repository/member.repository.port';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { ObjectIdVO } from 'src/core/value-object/object-id.value-object';

type TDeleteMemberPayload = PickUseCasePayload<null, '_id'>;

@Injectable()
export class DeleteMember extends BaseUseCase implements IUseCase<null> {
  constructor(
    @InjectMemberRepository private memberRepository: MemberRepositoryPort,
  ) {
    super();
  }

  public async execute({ _id }: TDeleteMemberPayload): Promise<ResponseDto> {
    try {
      const _idValue = new ObjectIdVO(_id).valueConverted;
      const member = await this.memberRepository.findOne({
        _id: _idValue,
      });

      if (!member) throw new NotFoundException('Member not found.');

      // TODO check borrowed book here.

      await this.memberRepository.delete({ _id: _idValue });

      return new ResponseDto({
        status: HttpStatus.OK,
        data: {},
        message: 'Member deleted.',
      });
    } catch (e) {
      this.logger.error(e.message);
      if (e instanceof HttpException) throw e;
      throw new InternalServerErrorException('Internal server error.');
    }
  }
}
