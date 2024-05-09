import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DataFetchingService } from './data-fetching.service';
import { DataFetchingModule } from './data-fetching.module';

@Module({
  imports: [DataFetchingModule],
  controllers: [AppController],
  providers: [DataFetchingService],
})
export class AppModule {}
