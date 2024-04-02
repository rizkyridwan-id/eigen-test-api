import { UnprocessableEntityException } from '@nestjs/common';
import { ValueObject } from 'src/core/base/domain/value-object';
import { DomainPrimitive } from 'src/core/base/types/domain-primitive.type';

export class MemberCode extends ValueObject<string> {
  constructor(value: string) {
    super({ value });
  }

  protected validate({ value }: DomainPrimitive<string>) {
    if (!value.startsWith('M') || value.length > 4)
      throw new UnprocessableEntityException(
        'Something went wrong in Member Code Generator.',
      );
  }
}
