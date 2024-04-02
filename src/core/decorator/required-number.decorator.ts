import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export function IsRequiredNumber(example?: number) {
  const decorators = [
    IsNumber(),
    IsNotEmpty(),
    ApiProperty({ example: example || 0 }),
  ];

  return applyDecorators(...decorators);
}
