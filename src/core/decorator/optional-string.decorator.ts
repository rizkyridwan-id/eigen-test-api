import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { TStringInput } from './type/string-input.type';

export function IsOptionalString(options: TStringInput = {}) {
  const { uppercase = false } = options;
  const decorators = [IsString(), IsOptional()];

  if (uppercase)
    decorators.push(
      Transform(({ value }) =>
        typeof value === 'string' ? String(value).toUpperCase() : value,
      ),
    );

  return applyDecorators(...decorators);
}
