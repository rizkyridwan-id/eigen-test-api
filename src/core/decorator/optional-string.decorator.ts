import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { TStringInput } from './type/string-input.type';
import { ApiProperty } from '@nestjs/swagger';

export function IsOptionalString(options: TStringInput = {}) {
  const { uppercase = false } = options;
  const decorators = [
    IsString(),
    IsOptional(),
    ApiProperty({ required: false }),
  ];

  if (uppercase)
    decorators.push(
      Transform(({ value }) =>
        typeof value === 'string' ? String(value).toUpperCase() : value,
      ),
    );

  return applyDecorators(...decorators);
}
