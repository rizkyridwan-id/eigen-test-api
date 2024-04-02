import { Module } from '@nestjs/common';
import { resourceProviders } from './resource.provider';

@Module({
  imports: resourceProviders,
  exports: resourceProviders,
})
export class ResourceModule {}
