import { DataFetchingService } from './data-fetching.service';
export declare class AppController {
    private readonly dataFetchingService;
    constructor(dataFetchingService: DataFetchingService);
    fetchAllData(): Promise<string>;
    fetchBatchOrderData(): Promise<string>;
}
