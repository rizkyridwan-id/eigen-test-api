import { applyDecorators } from '@nestjs/common';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export function IsRequiredBoolean() {
  const decorators = [IsBoolean(), IsNotEmpty()];

  return applyDecorators(...decorators);
}
