import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { BaseUseCase, IUseCase } from 'src/core/base/module/use-case.base';

import { PickUseCasePayload } from 'src/core/base/types/pick-use-case-payload.type';
import { BorrowBookRequestDto } from '../controller/dto/borrow-book.request.dto';
import { InjectBorrowingRepository } from '../repository/borrowing.repository.provider';
import { BorrowingRepositoryPort } from 'src/port/repository/borrowing.repository.port';
import { InjectBookRepository } from 'src/module/book/repository/book.repository.provider';
import { BookRepositoryPort } from 'src/port/repository/book.repository.port';
import { InjectMemberRepository } from 'src/module/member/repository/member.repository.provider';
import { MemberRepositoryPort } from 'src/port/repository/member.repository.port';
import { TransactionService } from 'src/core/helper/module/transaction/transaction.service';
import { ClientSession } from 'mongoose';
import { ResponseDto } from 'src/core/base/http/response.dto.base';
import {
  IBorrowBookResponse,
  IDetailReceiptBorrowBook,
} from 'src/port/dto/borrowing.reponse-dto.port';
import { ObjectIdVO } from 'src/core/value-object/object-id.value-object';
import { MemberMongoEntity } from 'src/module/member/repository/member.mongo-entity';
import { BorrowingEntity } from '../domain/borrowing.entity';
import { v4 as uuidv4 } from 'uuid';

type TBorrowBookPayload = PickUseCasePayload<BorrowBookRequestDto, 'data'>;
type TBorrowBookResponse = ResponseDto<IBorrowBookResponse>;
@Injectable()
export class BorrowBook
  extends BaseUseCase
  implements IUseCase<BorrowBookRequestDto>
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

  public async execute({
    data,
  }: TBorrowBookPayload): Promise<TBorrowBookResponse> {
    const session = await this.transactionService.startTransaction();

    return await this._doTransaction(data, session);
  }

  private async _doTransaction(
    data: BorrowBookRequestDto,
    session: ClientSession,
  ): Promise<TBorrowBookResponse> {
    try {
      const memberIdVO = new ObjectIdVO(data.member_id);
      const memberData = await this.memberRepository.findOneOrThrow(
        {
          _id: memberIdVO.valueConverted,
        },
        'Member not found.',
      );

      this._validatePenalizedMember(memberData);
      await this._validateBorrowedBook(memberIdVO, data.books);
      const borrowingCommited = await this._insertBorrowing(data, session);

      return new ResponseDto({
        status: HttpStatus.CREATED,
        data: {
          receipt: {
            name: memberData.name,
            ...borrowingCommited,
          },
        },
      });
    } catch (e) {
      if (e instanceof HttpException) throw e;
      this.logger.error(e);
      throw new InternalServerErrorException('Internal server error.');
    } finally {
      await session.endSession();
    }
  }

  private _validatePenalizedMember(memberData: MemberMongoEntity) {
    const isMemberPenalized =
      memberData.penalized_date && new Date() < memberData.penalized_date;
    if (isMemberPenalized) {
      const penalizeDateFormatted =
        memberData.penalized_date.toLocaleDateString('id-ID');
      throw new UnprocessableEntityException(
        'Member is currently being penalized, and cannot borrow until ' +
          penalizeDateFormatted,
      );
    }
  }

  private async _validateBorrowedBook(memberIdVO: ObjectIdVO, books: string[]) {
    const lastBorrowing = await this.borrowingRepository.findBy({
      member_id: memberIdVO.valueConverted,
      is_returned: false,
    });

    if (lastBorrowing.length + books.length > 2)
      throw new BadRequestException(
        'Member currently borrow book, each member is limited to borrow 2 active books.',
      );

    if (books.length > 2)
      throw new BadRequestException(
        'Member can only borrow less than or equal 2 books',
      );
  }

  private async _insertBorrowing(
    data: BorrowBookRequestDto,
    session: ClientSession,
  ): Promise<Omit<IDetailReceiptBorrowBook, 'name'>> {
    try {
      const trxId = uuidv4();
      const currentDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);

      const bookNames: string[] = [];
      await session.withTransaction(async () => {
        const borrowingEntities: BorrowingEntity[] = [];
        for (const book of data.books) {
          const bookIdVO = new ObjectIdVO(book);
          const bookData = await this.bookRepository.findOne({
            _id: bookIdVO.valueConverted,
          });
          if (!bookData)
            throw new UnprocessableEntityException('Book not found.');
          if (!bookData.stock)
            throw new UnprocessableEntityException('Book is being borrowed.');

          await this.bookRepository.update(
            { _id: bookIdVO.valueConverted },
            { $inc: { stock: -1, stock_borrowed: 1 } },
            session,
          );

          bookNames.push(bookData.title);
          borrowingEntities.push(
            new BorrowingEntity({
              book_id: bookIdVO,
              member_id: new ObjectIdVO(data.member_id),
              due_date: dueDate,
              borrowed_date: currentDate,
              trx_id: trxId,
            }),
          );
        }

        await this.borrowingRepository.saveMany(borrowingEntities);
      });

      return {
        book_names: bookNames,
        borrowed_date: currentDate.toLocaleDateString('id-ID'),
        due_date: dueDate.toLocaleDateString('id-ID'),
      };
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }
}
