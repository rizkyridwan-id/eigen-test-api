import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';

import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { CreateMemberRequestDto } from '../controller/dto/create-member.request.dto';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { IdResponseDTO } from 'src/core/base/http/id-response.dto';
import { InjectMemberRepository } from '../repository/member.repository.provider';
import { MemberRepositoryPort } from 'src/port/repository/member.repository.port';
import { MemberEntity } from '../domain/member.entity';
import { MemberCode } from '../domain/value-object/member-code.value-object';

type TCreateMemberPayload = PickUseCasePayload<CreateMemberRequestDto, 'data'>;

type TCreateMemberResponse = ResponseDto<IdResponseDTO>;

@Injectable()
export class CreateMember
  extends BaseUseCase
  implements IUseCase<CreateMemberRequestDto>
{
  constructor(
    @InjectMemberRepository private memberRepository: MemberRepositoryPort,
  ) {
    super();
  }

  public async execute({
    data,
  }: TCreateMemberPayload): Promise<TCreateMemberResponse> {
    try {
      const memberCode = await this._generateMemberCode();
      const memberEntity = new MemberEntity({
        name: data.name,
        code: new MemberCode(memberCode),
        input_date: new Date(),
      });

      const memberCreated = await this.memberRepository.save(memberEntity);

      return new ResponseDto({
        status: HttpStatus.CREATED,
        data: new IdResponseDTO(memberCreated._id),
      });
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new InternalServerErrorException('Internal Server Error.');
    }
  }

  private async _generateMemberCode() {
    try {
      const latestMember = await this.memberRepository.findOneLatest({});
      if (latestMember)
        return 'M' + String(+latestMember.code.slice(-3) + 1).padStart(3, '0');
      return 'M001';
    } catch (e) {
      this.logger.error(e.message, '_generateMemberCode');
      throw e;
    }
  }
}
