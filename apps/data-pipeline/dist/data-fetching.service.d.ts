export declare class DataFetchingService {
    constructor();
    wait: (ms?: number) => Promise<void>;
    checkQueryStatus: (queryExecutionId: string) => Promise<boolean>;
    fetchAllData(): Promise<string>;
    fetchBatchOrderData(): Promise<string>;
    fetchOrderDataAndIngredients(): Promise<string>;
    fetchOrderDataAndIngredientsForQSROrder(): Promise<string>;
}
