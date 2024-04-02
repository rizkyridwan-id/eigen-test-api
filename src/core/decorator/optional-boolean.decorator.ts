import { applyDecorators } from '@nestjs/common';
import { IsBoolean, IsOptional } from 'class-validator';

export function IsOptionalBoolean() {
  const decorators = [IsBoolean(), IsOptional()];

  return applyDecorators(...decorators);
}
