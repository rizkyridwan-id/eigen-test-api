import { BadRequestException } from '@nestjs/common';
import { ValueObject } from 'src/core/base/domain/value-object';
import { DomainPrimitive } from 'src/core/base/types/domain-primitive.type';

export class StockVO extends ValueObject<number> {
  constructor(value: number) {
    super({ value });
  }

  protected validate({ value }: DomainPrimitive<number>) {
    if (value < 1) throw new BadRequestException('Stock must be more then 0');
  }
}
