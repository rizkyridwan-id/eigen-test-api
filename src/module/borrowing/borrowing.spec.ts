import { Test } from '@nestjs/testing';
import { BookRepository } from '../book/repository/book.repository.service';
import { MemberRepository } from '../member/repository/member.repository.service';
import { BorrowingRepository } from './repository/borrowing.repository.service';
import { BorrowBook } from './use-case/borrow-book.use-case';
import { MemberMock } from 'src/mock/member.mock';
import { BookMock } from 'src/mock/book.mock';
import { BorrowBookRequestDto } from './controller/dto/borrow-book.request.dto';
import { bookRepositoryProvider } from '../book/repository/book.repository.provider';
import { memberRepositoryProvider } from '../member/repository/member.repository.provider';
import { borrowingRepositoryProvider } from './repository/borrowing.repository.provider';
import { TransactionService } from 'src/core/helper/module/transaction/transaction.service';
import { getModelToken } from '@nestjs/mongoose';
import { BookMongoEntity } from '../book/repository/book.mongo-entity';
import { MemberMongoEntity } from '../member/repository/member.mongo-entity';
import { BorrowingMongoEntity } from './repository/borrowing.mongo-entity';
import { Types } from 'mongoose';
import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { genIdMock } from 'src/mock/gen-id.mock';
import { ReturnBookRequestDto } from './controller/dto/return-book.request.dto';
import { ReturnBook } from './use-case/return-book.use-case';
import { IReturnBookResponse } from 'src/port/dto/borrowing.reponse-dto.port';
import { ResponseDto } from 'src/core/base/http/response.dto.base';

describe('Borrowing', () => {
  let borrowBook: BorrowBook;
  let returnBook: ReturnBook;
  let bookRepository: BookRepository;
  let memberRepository: MemberRepository;
  let borrowingRepository: BorrowingRepository;
  let transactionService: TransactionService;
  let memberMock: MemberMongoEntity[];
  let bookMock: BookMongoEntity[];

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        BorrowBook,
        ReturnBook,
        {
          provide: getModelToken(BookMongoEntity.name),
          useValue: null,
        },
        bookRepositoryProvider,
        {
          provide: getModelToken(MemberMongoEntity.name),
          useValue: null,
        },
        memberRepositoryProvider,
        {
          provide: getModelToken(BorrowingMongoEntity.name),
          useValue: null,
        },
        borrowingRepositoryProvider,
        {
          provide: 'DatabaseConnection',
          useValue: null,
        },
        TransactionService,
      ],
    }).compile();

    borrowBook = moduleRef.get<BorrowBook>(BorrowBook);
    returnBook = moduleRef.get<ReturnBook>(ReturnBook);
    bookRepository = moduleRef.get<BookRepository>(BookRepository.name);
    memberRepository = moduleRef.get<MemberRepository>(MemberRepository.name);
    borrowingRepository = moduleRef.get<BorrowingRepository>(
      BorrowingRepository.name,
    );
    transactionService = moduleRef.get<TransactionService>(TransactionService);
    memberMock = MemberMock;
    bookMock = BookMock;

    jest.spyOn(transactionService, 'startTransaction').mockImplementation(
      () =>
        new Promise((resolve) =>
          resolve({
            endSession: () => null,
            withTransaction: (cb: () => Promise<any>) => cb(),
          } as any),
        ),
    );
  });

  describe('Borrow Book', () => {
    it('Should return member error, because of borrow more than 2 books', async () => {
      const borrowBookPayload: BorrowBookRequestDto = {
        member_id: memberMock[0]._id.toString(),
        books: new Array(3).fill('').map(() => genIdMock().toString()),
      };

      jest
        .spyOn(memberRepository, 'findOneOrThrow')
        .mockImplementation(async () => memberMock[0]);

      jest
        .spyOn(borrowingRepository, 'findBy')
        .mockImplementation(() => [] as any);

      const expectedErrorMessage =
        'Member currently borrow book, each member is limited to borrow 2 active books.';
      await expect(
        borrowBook.execute({ data: borrowBookPayload }),
      ).rejects.toEqual(new BadRequestException(expectedErrorMessage));
    });

    it('Should return error, book is already borrowed', async () => {
      const genId = () => Types.ObjectId.createFromTime(Date.now()).toString();
      const borrowBookPayload: BorrowBookRequestDto = {
        member_id: memberMock[0]._id.toString(),
        books: new Array(1).fill('').map(() => genId()),
      };

      jest
        .spyOn(memberRepository, 'findOneOrThrow')
        .mockImplementation(async () => memberMock[0]);

      jest
        .spyOn(borrowingRepository, 'findBy')
        .mockImplementation(() => [] as any);

      jest
        .spyOn(bookRepository, 'findOne')
        .mockImplementation(async () => ({ ...bookMock[0], stock: 0 }));

      const expectedErrorMessage = 'Book is being borrowed.';
      await expect(
        borrowBook.execute({ data: borrowBookPayload }),
      ).rejects.toEqual(new UnprocessableEntityException(expectedErrorMessage));
    });

    it('Should return error, member is penalized', async () => {
      const genId = () => Types.ObjectId.createFromTime(Date.now()).toString();
      const borrowBookPayload: BorrowBookRequestDto = {
        member_id: genId(),
        books: new Array(1).fill('').map(() => genId()),
      };

      const penalizedDate = new Date();
      penalizedDate.setDate(penalizedDate.getDate() + 3);

      jest
        .spyOn(memberRepository, 'findOneOrThrow')
        .mockImplementation(async () => ({
          ...memberMock[0],
          penalized_date: penalizedDate,
        }));

      await expect(
        borrowBook.execute({ data: borrowBookPayload }),
      ).rejects.toEqual(
        new UnprocessableEntityException(
          'Member is currently being penalized, and cannot borrow until ' +
            penalizedDate.toLocaleDateString('id-id'),
        ),
      );
    });

    it('Should return success with receipt', async () => {
      const borrowBookPayload: BorrowBookRequestDto = {
        member_id: memberMock[0]._id.toString(),
        books: [bookMock[0]._id.toString()],
      };

      jest
        .spyOn(memberRepository, 'findOneOrThrow')
        .mockImplementation(async () => ({
          ...memberMock[0],
        }));

      jest
        .spyOn(borrowingRepository, 'findBy')
        .mockImplementation(async () => []);

      jest
        .spyOn(bookRepository, 'findOne')
        .mockImplementation(async () => bookMock[0]);

      jest.spyOn(bookRepository, 'update').mockImplementation(async () => null);
      jest
        .spyOn(borrowingRepository, 'saveMany')
        .mockImplementation(async () => null);

      const borrowedDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);

      const expectedResponse = {
        name: memberMock[0].name,
        book_names: [bookMock[0].title],
        borrowed_date: borrowedDate.toLocaleDateString('id-id'),
        due_date: dueDate.toLocaleDateString('id-ID'),
      };
      const expectedResponseDto = new ResponseDto({
        status: HttpStatus.CREATED,
        data: { receipt: expectedResponse },
      });
      expect(await borrowBook.execute({ data: borrowBookPayload })).toEqual(
        expectedResponseDto,
      );
    });
  });

  describe('Return Book', () => {
    it('Should be error because return the wrong', async () => {
      const returnBookPayload: ReturnBookRequestDto = {
        member_id: memberMock[0]._id.toString(),
        books: [bookMock[0]._id.toString()],
      };

      jest
        .spyOn(memberRepository, 'findOne')
        .mockImplementation(async () => memberMock[0]);

      const borrowingMock: BorrowingMongoEntity = {
        _id: genIdMock(),
        book_id: bookMock[1]._id,
        borrowed_date: new Date(),
        due_date: new Date(),
        member_id: memberMock[0]._id,
        trx_id: '1',
        is_returned: false,
      };
      jest
        .spyOn(borrowingRepository, 'findBy')
        .mockImplementation(async () => [borrowingMock]);

      const expectedErrorMessage =
        'No book matches in the member borrowing list.';
      await expect(
        returnBook.execute({ data: returnBookPayload }),
      ).rejects.toEqual(new NotFoundException(expectedErrorMessage));
    });
    it('Should return success with penalized status.', async () => {
      const returnBookPayload: ReturnBookRequestDto = {
        member_id: memberMock[0]._id.toString(),
        books: [bookMock[0]._id.toString()],
      };

      jest
        .spyOn(memberRepository, 'findOne')
        .mockImplementation(async () => memberMock[0]);

      const borrowedDate = new Date();
      borrowedDate.setDate(borrowedDate.getDate() - 8);
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() - 1);

      const borrowingMock: BorrowingMongoEntity = {
        _id: genIdMock(),
        book_id: bookMock[0]._id,
        borrowed_date: borrowedDate,
        due_date: dueDate,
        member_id: memberMock[0]._id,
        trx_id: '1',
        is_returned: false,
      };
      jest
        .spyOn(borrowingRepository, 'findBy')
        .mockImplementation(async () => [borrowingMock]);

      jest.spyOn(bookRepository, 'update').mockImplementation(() => null);
      jest.spyOn(borrowingRepository, 'update').mockImplementation(() => null);
      jest.spyOn(memberRepository, 'update').mockImplementation(() => null);

      const expectedResponse: IReturnBookResponse = {
        book_ids: [bookMock[0]._id],
        is_penalized: true,
      };
      const expectedResponseDto = new ResponseDto({
        status: HttpStatus.OK,
        data: expectedResponse,
        message: 'Book returned.',
      });

      expect(await returnBook.execute({ data: returnBookPayload })).toEqual(
        expectedResponseDto,
      );
    });
  });
});
