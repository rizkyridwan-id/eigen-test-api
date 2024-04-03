import { IsOptionalString } from 'src/core/decorator/optional-string.decorator';

export class GetBorrowingRequestDto {
  @IsOptionalString()
  member_id: string;

  @IsOptionalString()
  book_id: string;
}
