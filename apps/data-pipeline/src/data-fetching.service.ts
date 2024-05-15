import {
  AthenaClient,
  GetQueryExecutionCommandInput,
  StartQueryExecutionCommand,
  StartQueryExecutionInput,
  GetQueryResultsCommand,
  GetQueryExecutionInput,
  GetQueryExecutionCommand,
} from '@aws-sdk/client-athena';
import { Injectable } from '@nestjs/common';

const ATHENA_CLIENT = new AthenaClient({ region: 'us-east-1' });

@Injectable()
export class DataFetchingService {
  constructor() {}

  wait = async function (ms = 10000): Promise<void> {
    console.log('WAITING 10 SECONDS BEFORE CHECKING QUERY STATUS AGAIN...');
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  checkQueryStatus = async function (
    queryExecutionId: string,
  ): Promise<boolean> {
    console.log('CHECKING QUERY STATUS...');
    const executionInput: GetQueryExecutionInput = {
      QueryExecutionId: queryExecutionId,
    };

    let execuetionCommand = new GetQueryExecutionCommand(executionInput);
    let executionRes = await ATHENA_CLIENT.send(execuetionCommand);
    console.log('EXECUTION STATUS: ', executionRes.QueryExecution.Status.State);

    // 3. Wait for query to complete
    while (
      executionRes.QueryExecution.Status.State === 'RUNNING' ||
      executionRes.QueryExecution.Status.State === 'QUEUED'
    ) {
      await this.wait(10000);
      execuetionCommand = new GetQueryExecutionCommand(executionInput);
      executionRes = await ATHENA_CLIENT.send(execuetionCommand);
      console.log(
        'EXECUTION STATUS:',
        executionRes.QueryExecution.Status.State,
      );
      if (executionRes.QueryExecution.Status.State === 'SUCCEEDED') {
        return true;
      }
    }
  };

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
    try {
      const response = await ATHENA_CLIENT.send(command);
      console.log('QUERY EXECUTION RESPONSE: ', response);

      // 2. Check Query Execution Status
      const isSuccessful = await this.checkQueryStatus(
        response.QueryExecutionId,
      );

      // 4. Get Query Results When Query Execution is Succeeded
      if (isSuccessful === true) {
        console.log('QUERY EXECUTION SUCCEEDED!');

        const getQueryResultCommand: GetQueryExecutionCommandInput = {
          QueryExecutionId: response.QueryExecutionId,
        };
        const queryResultCommand = new GetQueryResultsCommand(
          getQueryResultCommand,
        );
        const queryCommandRes = await ATHENA_CLIENT.send(queryResultCommand);
        console.log('RESULTS: ', queryCommandRes.ResultSet.Rows[0]);
      }

      return JSON.stringify(response);
    } catch (error) {
      console.log('ERROR: ', error);
    }
  }

  async fetchBatchOrderData(): Promise<string> {
    console.log('Fetching batch order data');

    //1. Start Query Execution
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
    try {
      const response = await ATHENA_CLIENT.send(command);
      console.log('QUERY EXECUTION RESPONSE: ', response);

      /// 2. Check Query Execution Status
      const isSuccessful = await this.checkQueryStatus(
        response.QueryExecutionId,
      );

      // 4. Get Query Results When Query Execution is Succeeded
      if (isSuccessful) {
        console.log('QUERY EXECUTION SUCCEEDED!');

        const getQueryResultCommand: GetQueryExecutionCommandInput = {
          QueryExecutionId: response.QueryExecutionId,
        };
        const queryResultCommand = new GetQueryResultsCommand(
          getQueryResultCommand,
        );
        const queryCommandRes = await ATHENA_CLIENT.send(queryResultCommand);
        console.log('RESULTS: ', queryCommandRes.ResultSet.Rows);
      }

      return JSON.stringify(response);
    } catch (error) {
      console.log('ERROR: ', error);
    }
  }

  async fetchOrderDataAndIngredients(): Promise<string> {
    console.log('Fetching ingredients join statement');

    const input: StartQueryExecutionInput = {
      QueryString:
        'SELECT o.orderid, o.id, o.recipeid, i.ingredients as ingredients FROM orders as o RIGHT JOIN ingredients as i ON o.orderid = i.orderid',
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
    try {
      const response = await ATHENA_CLIENT.send(command);
      console.log('QUERY EXECUTION RESPONSE: ', response);

      /// 2. Check Query Execution Status
      const isSuccessful = await this.checkQueryStatus(
        response.QueryExecutionId,
      );

      // 4. Get Query Results When Query Execution is Succeeded
      if (isSuccessful) {
        console.log('QUERY EXECUTION SUCCEEDED!');

        const getQueryResultCommand: GetQueryExecutionCommandInput = {
          QueryExecutionId: response.QueryExecutionId,
        };
        const queryResultCommand = new GetQueryResultsCommand(
          getQueryResultCommand,
        );
        const queryCommandRes = await ATHENA_CLIENT.send(queryResultCommand);
        console.log('RESULTS: ', queryCommandRes.ResultSet.Rows);
      }

      return JSON.stringify(response);
    } catch (error) {
      console.log('ERROR: ', error);
    }
  }

  async fetchOrderDataAndIngredientsForQSROrder(): Promise<string> {
    console.log('Fetching ingredients for qsr order join');

    const input: StartQueryExecutionInput = {
      QueryString:
        'SELECT o.orderid, o.id, o.recipeid, o.ordertype, i.ingredients as ingredients FROM orders as o RIGHT JOIN ingredients as i ON o.orderid = i.orderid WHERE o.ordertype = ?',
      ExecutionParameters: ['DIRECT_INTEGRATION_QSR'],
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
    try {
      const response = await ATHENA_CLIENT.send(command);
      console.log('QUERY EXECUTION RESPONSE: ', response);

      /// 2. Check Query Execution Status
      const isSuccessful = await this.checkQueryStatus(
        response.QueryExecutionId,
      );

      // 4. Get Query Results When Query Execution is Succeeded
      if (isSuccessful) {
        console.log('QUERY EXECUTION SUCCEEDED!');

        const getQueryResultCommand: GetQueryExecutionCommandInput = {
          QueryExecutionId: response.QueryExecutionId,
        };
        const queryResultCommand = new GetQueryResultsCommand(
          getQueryResultCommand,
        );
        const queryCommandRes = await ATHENA_CLIENT.send(queryResultCommand);
        console.log('RESULTS: ', queryCommandRes.ResultSet.Rows);
      }

      return JSON.stringify(response);
    } catch (error) {
      console.log('ERROR: ', error);
    }

    return '';
  }
}
