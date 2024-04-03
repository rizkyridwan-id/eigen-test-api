import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';

import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { ReturnBookRequestDto } from '../controller/dto/return-book.request.dto';
import { InjectBorrowingRepository } from '../repository/borrowing.repository.provider';
import { BorrowingRepositoryPort } from 'src/port/repository/borrowing.repository.port';
import { InjectBookRepository } from 'src/module/book/repository/book.repository.provider';
import { BookRepositoryPort } from 'src/port/repository/book.repository.port';
import { InjectMemberRepository } from 'src/module/member/repository/member.repository.provider';
import { MemberRepositoryPort } from 'src/port/repository/member.repository.port';
import { TransactionService } from 'src/core/helper/module/transaction/transaction.service';
import { ClientSession } from 'mongoose';
import { ObjectIdVO } from 'src/core/value-object/object-id.value-object';
import { MemberMongoEntity } from 'src/module/member/repository/member.mongo-entity';
import { BorrowingMongoEntity } from '../repository/borrowing.mongo-entity';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import { IReturnBookResponse } from 'src/port/dto/borrowing.reponse-dto.port';

type TReturnBookPayload = PickUseCasePayload<ReturnBookRequestDto, 'data'>;
type TReturnBookResponse = ResponseDto<IReturnBookResponse>;

@Injectable()
export class ReturnBook
  extends BaseUseCase
  implements IUseCase<ReturnBookRequestDto>
{
  constructor(
    @InjectBorrowingRepository
    private borrowingRepository: BorrowingRepositoryPort,
    @InjectBookRepository private bookRepository: BookRepositoryPort,
    @InjectMemberRepository private memberRepository: MemberRepositoryPort,
    private transactionService: TransactionService,
  ) {
    super();
  }

  public async execute(
    payload: TReturnBookPayload,
  ): Promise<TReturnBookResponse> {
    const session = await this.transactionService.startTransaction();

    return await this._doTransaction(payload.data, session);
  }

  private async _doTransaction(
    data: ReturnBookRequestDto,
    session: ClientSession,
  ): Promise<TReturnBookResponse> {
    try {
      const idMemberVO = new ObjectIdVO(data.member_id);
      const member = await this.memberRepository.findOne({
        _id: idMemberVO.valueConverted,
      });
      if (!member) throw new NotFoundException('Member not found.');

      const borrowings = await this.borrowingRepository.findBy({
        member_id: idMemberVO.valueConverted,
        is_returned: false,
      });
      if (!borrowings.length)
        throw new NotFoundException(
          'Member is currently not borrowing any book.',
        );

      const bookReturn = borrowings.filter((it) =>
        data.books.find((book) => it.book_id.toString() === book),
      );
      if (!bookReturn.length)
        throw new NotFoundException(
          'No book matches in the member borrowing list.',
        );

      const returnCommited = await this._returnBarang(
        member,
        bookReturn,
        session,
      );

      return new ResponseDto({
        status: HttpStatus.OK,
        data: returnCommited,
        message: 'Book returned.',
      });
    } catch (e) {
      if (e instanceof HttpException) throw e;
      this.logger.error(e.message);
      throw new InternalServerErrorException('Internal server error.');
    }
  }

  private async _returnBarang(
    member: MemberMongoEntity,
    returnedBooks: BorrowingMongoEntity[],
    session: ClientSession,
  ): Promise<IReturnBookResponse> {
    try {
      return await session.withTransaction(async () => {
        let isPenalized = false;
        for (const borrowing of returnedBooks) {
          if (borrowing.due_date < new Date() && !isPenalized) {
            isPenalized = true;
          }

          await this.bookRepository.update(
            { _id: borrowing.book_id },
            { $inc: { stock: 1, stock_borrowed: -1 } },
            session,
          );
        }

        const bookIds = returnedBooks.map((it) => it.book_id);
        await this.borrowingRepository.update(
          { member_id: member._id, book_id: { $in: bookIds } },
          { is_returned: true, return_date: new Date() },
          session,
        );

        if (isPenalized) {
          const penalizedDate = new Date();
          penalizedDate.setDate(penalizedDate.getDate() + 3);
          penalizedDate.setHours(0);
          penalizedDate.setMinutes(0);
          penalizedDate.setSeconds(0);

          await this.memberRepository.update(
            { _id: member._id },
            { penalized_date: penalizedDate },
            session,
          );
        }

        return {
          book_ids: bookIds,
          is_penalized: isPenalized,
        };
      });
    } catch (e) {
      this.logger.error(e.message, '_returnBarang');
      throw e;
    }
  }
}
