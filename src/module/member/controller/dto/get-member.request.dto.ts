import { IsOptionalString } from 'src/core/decorator/optional-string.decorator';

export class GetMemberRequestDto {
  @IsOptionalString()
  name?: string;

  @IsOptionalString()
  code?: string;
}
