import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';

import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { CreateMemberRequestDto } from '../controller/dto/create-member.request.dto';
import { InjectMemberRepository } from '../repository/member.repository.provider';
import { MemberRepositoryPort } from 'src/port/repository/member.repository.port';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { IdResponseDTO } from 'src/core/base/http/id-response.dto';
import { ObjectIdVO } from 'src/core/value-object/object-id.value-object';

type TUpdateMemberPayload = PickUseCasePayload<
  CreateMemberRequestDto,
  'data' | '_id'
>;

type TUpdateMemberResponse = ResponseDto<IdResponseDTO>;

@Injectable()
export class UpdateMember
  extends BaseUseCase
  implements IUseCase<CreateMemberRequestDto>
{
  constructor(
    @InjectMemberRepository private memberRepository: MemberRepositoryPort,
  ) {
    super();
  }

  public async execute({
    _id,
    data,
  }: TUpdateMemberPayload): Promise<TUpdateMemberResponse> {
    const _idValue = new ObjectIdVO(_id).valueConverted;
    const member = await this.memberRepository.findOne({
      _id: _idValue,
    });

    if (!member) throw new NotFoundException('Member not found.');

    await this.memberRepository.update({ _id: _idValue }, { name: data.name });
    return new ResponseDto({
      status: HttpStatus.OK,
      data: new IdResponseDTO(_idValue),
    });
  }
}
