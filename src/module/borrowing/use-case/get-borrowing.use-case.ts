import { HttpStatus, Injectable } from '@nestjs/common';
import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';

import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { GetBorrowingRequestDto } from '../controller/dto/get-borrowing.request.dto';
import {
  BorrowingRepositoryPort,
  IBorrowingPopulated,
} from 'src/port/repository/borrowing.repository.port';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { InjectBorrowingRepository } from '../repository/borrowing.repository.provider';
import { FilterQuery } from 'mongoose';
import { BorrowingMongoEntity } from '../repository/borrowing.mongo-entity';

type TGetBorrowingPayload = PickUseCasePayload<GetBorrowingRequestDto, 'data'>;
type TGetBorrowingResponse = ResponseDto<IBorrowingPopulated[]>;

@Injectable()
export class GetBorrowing
  extends BaseUseCase
  implements IUseCase<GetBorrowingRequestDto>
{
  constructor(
    @InjectBorrowingRepository
    private borrowingRepository: BorrowingRepositoryPort,
  ) {
    super();
  }

  public async execute({
    data,
  }: TGetBorrowingPayload): Promise<TGetBorrowingResponse> {
    const wherePayload = this._buildWherePayload(data);
    const borrowingPopulated =
      await this.borrowingRepository.findBorrowingPopulated(wherePayload);

    return new ResponseDto({ status: HttpStatus.OK, data: borrowingPopulated });
  }

  private _buildWherePayload(data: GetBorrowingRequestDto) {
    const wherePayload: FilterQuery<BorrowingMongoEntity> = {};

    if (data.book_id) wherePayload.book_id = data.book_id;
    if (data.member_id) wherePayload.member_id = data.member_id;
    return wherePayload;
  }
}
