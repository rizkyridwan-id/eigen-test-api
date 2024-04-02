import { IsRequiredNumber } from 'src/core/decorator/required-number.decorator';
import { IsRequiredString } from 'src/core/decorator/required-string.decorator';

export class UpdateBookRequestDto {
  @IsRequiredString()
  title: string;

  @IsRequiredString()
  author: string;

  @IsRequiredNumber()
  stock: number;
}
