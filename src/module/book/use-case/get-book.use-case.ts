import { HttpStatus, Injectable } from '@nestjs/common';
import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';

import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { GetBookRequestDto } from '../controller/dto/get-book.request.dto';
import { InjectBookRepository } from '../repository/book.repository.provider';
import { BookRepositoryPort } from 'src/port/repository/book.repository.port';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { BookMongoEntity } from '../repository/book.mongo-entity';
import { FilterQuery } from 'mongoose';

type TGetBookPayload = PickUseCasePayload<GetBookRequestDto, 'data'>;
type TGetBookResponse = ResponseDto<BookMongoEntity[]>;

@Injectable()
export class GetBook
  extends BaseUseCase
  implements IUseCase<GetBookRequestDto>
{
  constructor(
    @InjectBookRepository private bookRepository: BookRepositoryPort,
  ) {
    super();
  }

  public async execute({ data }: TGetBookPayload): Promise<TGetBookResponse> {
    const wherePayload = this._buildWherePayload(data);

    const books = await this.bookRepository.findBy(wherePayload);

    return new ResponseDto({ status: HttpStatus.OK, data: books });
  }

  private _buildWherePayload(data: GetBookRequestDto) {
    const wherePayload: FilterQuery<BookMongoEntity> = { stock: { $gt: 0 } };
    if (data.title) wherePayload.title = { $regex: data.title, $options: 'i' };
    if (data.author)
      wherePayload.author = { $regex: data.author, $options: 'i' };
    if (data.code) wherePayload.code = data.code;

    return wherePayload;
  }
}
