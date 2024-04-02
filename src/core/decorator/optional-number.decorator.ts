import { applyDecorators } from '@nestjs/common';
import { IsNumber, IsOptional } from 'class-validator';

export function IsOptionalNumber() {
  const decorators = [IsNumber(), IsOptional()];

  return applyDecorators(...decorators);
}
