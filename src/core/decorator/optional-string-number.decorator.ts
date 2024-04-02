import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export function IsStringNumber() {
  const decorators = [Type(() => Number), IsNumber(), IsOptional()];

  return applyDecorators(...decorators);
}
