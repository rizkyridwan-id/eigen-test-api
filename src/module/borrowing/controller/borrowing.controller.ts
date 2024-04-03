import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BorrowBook } from '../use-case/borrow-book.use-case';
import { BorrowBookRequestDto } from './dto/borrow-book.request.dto';
import { ApiTags } from '@nestjs/swagger';
import { ReturnBookRequestDto } from './dto/return-book.request.dto';
import { ReturnBook } from '../use-case/return-book.use-case';
import { GetBorrowingRequestDto } from './dto/get-borrowing.request.dto';
import { GetBorrowing } from '../use-case/get-borrowing.use-case';

@Controller('v1/borrowing')
@ApiTags('Borrowing')
export class BorrowingController {
  constructor(
    private borrowBook: BorrowBook,
    private returnBook: ReturnBook,
    private getBorrowing: GetBorrowing,
  ) {
    // fill above parentheses with use case / repository dependencies
  }

  @Get()
  getBorrowingHandler(@Query() query: GetBorrowingRequestDto) {
    return this.getBorrowing.execute({ data: query });
  }

  @Post()
  borrowBookHandler(@Body() body: BorrowBookRequestDto) {
    return this.borrowBook.execute({ data: body });
  }

  @Post('return')
  returnBookHandler(@Body() body: ReturnBookRequestDto) {
    return this.returnBook.execute({ data: body });
  }
}
