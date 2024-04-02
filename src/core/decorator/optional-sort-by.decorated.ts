import { applyDecorators, BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export function IsOptionalSortBy() {
  const decorators = [IsOptional()];
  decorators.push(
    Transform(({ value }) => {
      if (typeof value == 'object') {
        const isValid = Object.keys(value)
          .map((key) => value[key])
          .every((val) => val === 'asc' || val === 'desc');
        if (!isValid) throw new BadRequestException('Sort By is not valid.');
        return value;
      }
    }),
  );
  return applyDecorators(...decorators);
}
