import { IsRequiredString } from 'src/core/decorator/required-string.decorator';

export class BorrowBookRequestDto {
  @IsRequiredString()
  member_id: string;

  @IsRequiredString({ isArray: true, example: [] })
  books: string[];
}
