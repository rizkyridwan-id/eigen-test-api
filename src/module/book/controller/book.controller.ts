import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateBook } from '../use-case/create-book.use-case';
import { UpdateBook } from '../use-case/update-book.use-case';
import { DeleteBook } from '../use-case/delete-book.use-case';
import { GetBook } from '../use-case/get-book.use-case';
import { CreateBookRequestDto } from './dto/create-book.request.dto';
import { GetBookRequestDto } from './dto/get-book.request.dto';
import { UpdateBookRequestDto } from './dto/update-book.request.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('v1/book')
@ApiTags('Book')
export class BookController {
  constructor(
    private createBook: CreateBook,
    private updateBook: UpdateBook,
    private deleteBook: DeleteBook,
    private getBook: GetBook,
  ) {
    // fill above parentheses with use case / repository dependencies
  }

  @Post()
  createBookHandler(@Body() body: CreateBookRequestDto) {
    return this.createBook.execute({ data: body });
  }

  @Get()
  getBookHandler(@Query() query: GetBookRequestDto) {
    return this.getBook.execute({ data: query });
  }

  @Put(':_id')
  updateBookHandler(
    @Param('_id') _id: string,
    @Body() body: UpdateBookRequestDto,
  ) {
    return this.updateBook.execute({ _id, data: body });
  }

  @Delete(':_id')
  deleteBookHandler(@Param('_id') _id: string) {
    return this.deleteBook.execute({ _id });
  }
}
