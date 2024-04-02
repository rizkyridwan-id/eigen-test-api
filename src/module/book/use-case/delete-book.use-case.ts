import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';

import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { InjectBookRepository } from '../repository/book.repository.provider';
import { BookRepositoryPort } from 'src/port/repository/book.repository.port';
import { ObjectIdVO } from 'src/core/value-object/object-id.value-object';
import { ResponseDto } from 'src/core/base/http/response.dto.base';

type TDeleteBookPayload = PickUseCasePayload<null, '_id'>;

@Injectable()
export class DeleteBook extends BaseUseCase implements IUseCase<null> {
  constructor(
    @InjectBookRepository private bookRepository: BookRepositoryPort,
  ) {
    super();
  }

  public async execute({ _id }: TDeleteBookPayload): Promise<ResponseDto> {
    try {
      const _idValue = new ObjectIdVO(_id).valueConverted;
      const book = await this.bookRepository.findOne({ _id: _idValue });
      if (!book) throw new NotFoundException('Book not found.');

      if (book.stock_borrowed)
        throw new UnprocessableEntityException('Book is being borrowed.');

      await this.bookRepository.delete({ _id: _idValue });
      return new ResponseDto({
        status: HttpStatus.OK,
        data: {},
        message: 'Book deleted.',
      });
    } catch (e) {
      this.logger.error(e.message);
      if (e instanceof HttpException) throw e;
      throw new InternalServerErrorException('Internal server error.');
    }
  }
}
