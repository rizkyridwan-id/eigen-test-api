import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { TStringInput } from './type/string-input.type';
import { ApiProperty } from '@nestjs/swagger';

export function IsRequiredString(options: TStringInput = {}) {
  const { uppercase = false } = options;
  const decorators = [
    IsString({ each: true }),
    IsNotEmpty(),
    ApiProperty({ example: options.example || '' }),
  ];

  if (uppercase)
    decorators.push(
      Transform(({ value }) =>
        typeof value === 'string' ? String(value).toUpperCase() : value,
      ),
    );

  if (options.isArray) {
    decorators.unshift(IsArray(), ArrayMinSize(1));
  }
  return applyDecorators(...decorators);
}
