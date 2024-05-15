import { Controller, Get } from '@nestjs/common';
import { DataFetchingService } from './data-fetching.service';

@Controller()
export class AppController {
  constructor(private readonly dataFetchingService: DataFetchingService) {}

  @Get()
  fetchAllData(): Promise<string> {
    return this.dataFetchingService.fetchAllData();
  }

  @Get('batch')
  fetchBatchOrderData(): Promise<string> {
    return this.dataFetchingService.fetchBatchOrderData();
  }

  @Get('join')
  fetchOrderDataAndIngredients(): Promise<string> {
    return this.dataFetchingService.fetchOrderDataAndIngredients();
  }

  @Get('filter')
  fetchFilteredData(): Promise<string> {
    return this.dataFetchingService.fetchOrderDataAndIngredientsForQSROrder();
  }
}
