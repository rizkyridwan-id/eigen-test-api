import { HttpStatus, Injectable } from '@nestjs/common';
import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';

import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { GetMemberRequestDto } from '../controller/dto/get-member.request.dto';
import { InjectMemberRepository } from '../repository/member.repository.provider';
import { MemberRepositoryPort } from 'src/port/repository/member.repository.port';
import { MemberMongoEntity } from '../repository/member.mongo-entity';
import { FilterQuery } from 'mongoose';
import { ResponseDto } from 'src/core/base/http/response.dto.base';

type TGetMemberPayload = PickUseCasePayload<GetMemberRequestDto, 'data'>;
type TGetMemberResponse = ResponseDto<MemberMongoEntity[]>;

@Injectable()
export class GetMember
  extends BaseUseCase
  implements IUseCase<GetMemberRequestDto>
{
  constructor(
    @InjectMemberRepository private memberRepository: MemberRepositoryPort,
  ) {
    super();
  }

  public async execute({
    data,
  }: TGetMemberPayload): Promise<TGetMemberResponse> {
    const wherePayload = this._buildWherePayload(data);

    const members = await this.memberRepository.findBy(wherePayload);
    return new ResponseDto({ status: HttpStatus.OK, data: members });
  }

  private _buildWherePayload(data: GetMemberRequestDto) {
    const wherePayload: FilterQuery<MemberMongoEntity> = {};

    if (data.name) wherePayload.name = data.name;
    if (data.code) wherePayload.code = data.code;

    return wherePayload;
  }
}
