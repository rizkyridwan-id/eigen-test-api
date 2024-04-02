import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';

import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { CreateBookRequestDto } from '../controller/dto/create-book.request.dto';
import { InjectBookRepository } from '../repository/book.repository.provider';
import { BookRepositoryPort } from 'src/port/repository/book.repository.port';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { IdResponseDTO } from 'src/core/base/http/id-response.dto';
import { BookEntity } from '../domain/book.entity';
import { StockVO } from '../domain/value-object/stock.value-object';

type TCreateBookPayload = PickUseCasePayload<CreateBookRequestDto, 'data'>;

type TCreateBookResponse = ResponseDto<IdResponseDTO>;

@Injectable()
export class CreateBook
  extends BaseUseCase
  implements IUseCase<CreateBookRequestDto>
{
  constructor(
    @InjectBookRepository private bookRepository: BookRepositoryPort,
  ) {
    super();
  }

  public async execute({
    data,
  }: TCreateBookPayload): Promise<TCreateBookResponse> {
    try {
      const bookDuplicated = await this.bookRepository.findOne({
        code: data.code,
      });
      if (bookDuplicated)
        throw new ConflictException('Code is already registered.');

      const bookEntity = new BookEntity({
        author: data.author,
        code: data.code,
        input_date: new Date(),
        stock: new StockVO(data.stock),
        stock_borrowed: 0,
        title: data.title,
      });

      const bookCreated = await this.bookRepository.save(bookEntity);

      return new ResponseDto({
        status: HttpStatus.CREATED,
        data: new IdResponseDTO(bookCreated._id),
      });
    } catch (e) {
      this.logger.error(e.message);
      if (e instanceof HttpException) throw e;
      throw new InternalServerErrorException('Internal server error.');
    }
  }
}
