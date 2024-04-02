import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { TMixedInput } from './type/mixed-input.type';

export function IsRequiredMixed<T>(options: TMixedInput<T>) {
  const decorators = [
    IsNotEmpty(),
    Type(() => options.type),
    ValidateNested({ each: true }),
  ];

  if (options.isArray) {
    decorators.unshift(IsArray(), ArrayMinSize(1));
  }
  return applyDecorators(...decorators);
}
