import { DataFetchingService } from './data-fetching.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [DataFetchingService],
  exports: [DataFetchingService],
})
export class DataFetchingModule {}
