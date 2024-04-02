import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';

import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { UpdateBookRequestDto } from '../controller/dto/update-book.request.dto';
import { InjectBookRepository } from '../repository/book.repository.provider';
import { BookRepositoryPort } from 'src/port/repository/book.repository.port';
import { ObjectIdVO } from 'src/core/value-object/object-id.value-object';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { IdResponseDTO } from 'src/core/base/http/id-response.dto';

type TUpdateBookPayload = PickUseCasePayload<
  UpdateBookRequestDto,
  'data' | '_id'
>;

type TUpdateBookResponse = ResponseDto<IdResponseDTO>;

@Injectable()
export class UpdateBook
  extends BaseUseCase
  implements IUseCase<UpdateBookRequestDto>
{
  constructor(
    @InjectBookRepository private bookRepository: BookRepositoryPort,
  ) {
    super();
  }

  public async execute({
    data,
    _id,
  }: TUpdateBookPayload): Promise<TUpdateBookResponse> {
    try {
      const _idValue = new ObjectIdVO(_id).valueConverted;

      const book = await this.bookRepository.findOne({ _id: _idValue });
      if (!book) throw new NotFoundException('Book not found.');

      await this.bookRepository.update(
        { _id: _idValue },
        {
          title: data.title,
          stock: data.stock,
          author: data.author,
        },
      );

      return new ResponseDto({
        status: HttpStatus.OK,
        data: new IdResponseDTO(_idValue),
      });
    } catch (e) {
      this.logger.error(e.message);
      if (e instanceof HttpException) throw e;
      throw new InternalServerErrorException('Internal server error.');
    }
  }
}
