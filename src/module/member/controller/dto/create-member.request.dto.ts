import { IsRequiredString } from 'src/core/decorator/required-string.decorator';

export class CreateMemberRequestDto {
  @IsRequiredString({ example: 'John' })
  name: string;
}
