import { Body, Controller, Post } from '@nestjs/common';
import { BorrowBook } from '../use-case/borrow-book.use-case';
import { BorrowBookRequestDto } from './dto/borrow-book.request.dto';

@Controller('v1/borrowing')
export class BorrowingController {
  constructor(private borrowBook: BorrowBook) {
    // fill above parentheses with use case / repository dependencies
  }

  @Post()
  borrowBookHandler(@Body() body: BorrowBookRequestDto) {
    return this.borrowBook.execute({ data: body });
  }
}
