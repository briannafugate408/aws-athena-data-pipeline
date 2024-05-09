import {
  AthenaClient,
  StartQueryExecutionCommand,
  StartQueryExecutionInput,
} from '@aws-sdk/client-athena';
import { Injectable } from '@nestjs/common';

const ATHENA_CLIENT = new AthenaClient({ region: 'us-east-1' });

@Injectable()
export class DataFetchingService {
  constructor() {}

  async fetchAllData(): Promise<string> {
    console.log('Fetching all order data');
    const input: StartQueryExecutionInput = {
      QueryString: 'SELECT * FROM orders',
      QueryExecutionContext: {
        Database: 'testing',
      },
      ResultConfiguration: {
        OutputLocation: 's3://brute-force-assets-bucket-assets-54387d2/Unsaved',
        EncryptionConfiguration: { EncryptionOption: 'SSE_S3' },
        ExpectedBucketOwner: '339712892782',
      },
    };

    const command = new StartQueryExecutionCommand(input);
    const response = await ATHENA_CLIENT.send(command);

    try {
      return JSON.stringify(response);
    } catch (error) {
      return JSON.stringify(response);
    }
  }

  async fetchBatchOrderData(): Promise<string> {
    console.log('Fetching batch order data');
    const input: StartQueryExecutionInput = {
      QueryString: 'SELECT * FROM orders WHERE ordertype = ?',
      QueryExecutionContext: {
        Database: 'testing',
      },
      ExecutionParameters: ['BATCH'],
      ResultConfiguration: {
        OutputLocation: 's3://brute-force-assets-bucket-assets-54387d2/Unsaved',
        EncryptionConfiguration: { EncryptionOption: 'SSE_S3' },
        ExpectedBucketOwner: '339712892782',
      },
    };

    const command = new StartQueryExecutionCommand(input);
    const response = await ATHENA_CLIENT.send(command);

    try {
      return JSON.stringify(response);
    } catch (error) {
      return JSON.stringify(response);
    }
  }
}
