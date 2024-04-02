import { IsOptionalString } from 'src/core/decorator/optional-string.decorator';

export class GetBookRequestDto {
  @IsOptionalString()
  code?: string;

  @IsOptionalString()
  title?: string;

  @IsOptionalString()
  author?: string;
}
