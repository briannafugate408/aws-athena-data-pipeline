"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataFetchingService = void 0;
const client_athena_1 = require("@aws-sdk/client-athena");
const common_1 = require("@nestjs/common");
const ATHENA_CLIENT = new client_athena_1.AthenaClient({ region: 'us-east-1' });
let DataFetchingService = class DataFetchingService {
    constructor() {
        this.wait = async function (ms = 3000) {
            console.log('WAITING 10 SECONDS BEFORE CHECKING QUERY STATUS AGAIN...');
            return new Promise((resolve) => {
                setTimeout(resolve, ms);
            });
        };
        this.checkQueryStatus = async function (queryExecutionId) {
            console.log('CHECKING QUERY STATUS...');
            const executionInput = {
                QueryExecutionId: queryExecutionId,
            };
            let execuetionCommand = new client_athena_1.GetQueryExecutionCommand(executionInput);
            let executionRes = await ATHENA_CLIENT.send(execuetionCommand);
            console.log('EXECUTION STATUS: ', executionRes.QueryExecution.Status.State);
            while (executionRes.QueryExecution.Status.State === 'RUNNING' ||
                executionRes.QueryExecution.Status.State === 'QUEUED') {
                await this.wait(3000);
                execuetionCommand = new client_athena_1.GetQueryExecutionCommand(executionInput);
                executionRes = await ATHENA_CLIENT.send(execuetionCommand);
                console.log('EXECUTION STATUS:', executionRes.QueryExecution.Status.State);
                if (executionRes.QueryExecution.Status.State === 'SUCCEEDED') {
                    return true;
                }
            }
        };
    }
    async fetchAllData() {
        console.log('Fetching all order data');
        const input = {
            QueryString: 'SELECT * FROM orders',
            QueryExecutionContext: {
                Database: 'testing',
            },
            ResultConfiguration: {
                OutputLocation: 's3://brute-force-assets-bucket-assets-54387d2/Unsaved',
                EncryptionConfiguration: { EncryptionOption: 'SSE_S3' },
                ExpectedBucketOwner: '339712892782',
            },
            ResultReuseConfiguration: {
                ResultReuseByAgeConfiguration: {
                    Enabled: true,
                    MaxAgeInMinutes: 5,
                },
            },
        };
        const command = new client_athena_1.StartQueryExecutionCommand(input);
        try {
            const response = await ATHENA_CLIENT.send(command);
            console.log('QUERY EXECUTION RESPONSE: ', response);
            const isSuccessful = await this.checkQueryStatus(response.QueryExecutionId);
            if (isSuccessful === true) {
                console.log('QUERY EXECUTION SUCCEEDED!');
                const getQueryResultCommand = {
                    QueryExecutionId: response.QueryExecutionId,
                };
                const queryResultCommand = new client_athena_1.GetQueryResultsCommand(getQueryResultCommand);
                const queryCommandRes = await ATHENA_CLIENT.send(queryResultCommand);
                console.log('RESULTS: ', queryCommandRes.ResultSet.Rows[0]);
            }
            return JSON.stringify(response);
        }
        catch (error) {
            console.log('ERROR: ', error);
        }
    }
    async fetchBatchOrderData() {
        console.log('Fetching batch order data');
        const input = {
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
            ResultReuseConfiguration: {
                ResultReuseByAgeConfiguration: {
                    Enabled: true,
                    MaxAgeInMinutes: 5,
                },
            },
        };
        const command = new client_athena_1.StartQueryExecutionCommand(input);
        try {
            const response = await ATHENA_CLIENT.send(command);
            console.log('QUERY EXECUTION RESPONSE: ', response);
            const isSuccessful = await this.checkQueryStatus(response.QueryExecutionId);
            if (isSuccessful) {
                console.log('QUERY EXECUTION SUCCEEDED!');
                const getQueryResultCommand = {
                    QueryExecutionId: response.QueryExecutionId,
                };
                const queryResultCommand = new client_athena_1.GetQueryResultsCommand(getQueryResultCommand);
                const queryCommandRes = await ATHENA_CLIENT.send(queryResultCommand);
                console.log('RESULTS: ', queryCommandRes.ResultSet.Rows);
            }
            return JSON.stringify(response);
        }
        catch (error) {
            console.log('ERROR: ', error);
        }
    }
    async fetchOrderDataAndIngredients() {
        console.log('Fetching ingredients join statement');
        const input = {
            QueryString: 'SELECT o.orderid, o.id, o.recipeid, i.ingredients as ingredients FROM orders as o RIGHT JOIN ingredients as i ON o.orderid = i.orderid',
            QueryExecutionContext: {
                Database: 'testing',
            },
            ResultConfiguration: {
                OutputLocation: 's3://brute-force-assets-bucket-assets-54387d2/Unsaved',
                EncryptionConfiguration: { EncryptionOption: 'SSE_S3' },
                ExpectedBucketOwner: '339712892782',
            },
            ResultReuseConfiguration: {
                ResultReuseByAgeConfiguration: {
                    Enabled: true,
                    MaxAgeInMinutes: 5,
                },
            },
        };
        const command = new client_athena_1.StartQueryExecutionCommand(input);
        try {
            const response = await ATHENA_CLIENT.send(command);
            console.log('QUERY EXECUTION RESPONSE: ', response);
            const isSuccessful = await this.checkQueryStatus(response.QueryExecutionId);
            if (isSuccessful) {
                console.log('QUERY EXECUTION SUCCEEDED!');
                const getQueryResultCommand = {
                    QueryExecutionId: response.QueryExecutionId,
                };
                const queryResultCommand = new client_athena_1.GetQueryResultsCommand(getQueryResultCommand);
                const queryCommandRes = await ATHENA_CLIENT.send(queryResultCommand);
                console.log('RESULTS: ', queryCommandRes.ResultSet.Rows);
            }
            return JSON.stringify(response);
        }
        catch (error) {
            console.log('ERROR: ', error);
        }
    }
    async fetchOrderDataAndIngredientsForQSROrder() {
        console.log('Fetching ingredients for qsr order join');
        const input = {
            QueryString: 'SELECT o.orderid, o.id, o.recipeid, o.ordertype, i.ingredients as ingredients FROM orders as o RIGHT JOIN ingredients as i ON o.orderid = i.orderid WHERE o.ordertype = ?',
            ExecutionParameters: ['DIRECT_INTEGRATION_QSR'],
            QueryExecutionContext: {
                Database: 'testing',
            },
            ResultConfiguration: {
                OutputLocation: 's3://brute-force-assets-bucket-assets-54387d2/Unsaved',
                EncryptionConfiguration: { EncryptionOption: 'SSE_S3' },
                ExpectedBucketOwner: '339712892782',
            },
            ResultReuseConfiguration: {
                ResultReuseByAgeConfiguration: {
                    Enabled: true,
                    MaxAgeInMinutes: 5,
                },
            },
        };
        const command = new client_athena_1.StartQueryExecutionCommand(input);
        try {
            const response = await ATHENA_CLIENT.send(command);
            console.log('QUERY EXECUTION RESPONSE: ', response);
            const isSuccessful = await this.checkQueryStatus(response.QueryExecutionId);
            if (isSuccessful) {
                console.log('QUERY EXECUTION SUCCEEDED!');
                const getQueryResultCommand = {
                    QueryExecutionId: response.QueryExecutionId,
                };
                const queryResultCommand = new client_athena_1.GetQueryResultsCommand(getQueryResultCommand);
                const queryCommandRes = await ATHENA_CLIENT.send(queryResultCommand);
                console.log('RESULTS: ', queryCommandRes.ResultSet.Rows);
            }
            return JSON.stringify(response);
        }
        catch (error) {
            console.log('ERROR: ', error);
        }
        return '';
    }
};
exports.DataFetchingService = DataFetchingService;
exports.DataFetchingService = DataFetchingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DataFetchingService);
//# sourceMappingURL=data-fetching.service.js.map