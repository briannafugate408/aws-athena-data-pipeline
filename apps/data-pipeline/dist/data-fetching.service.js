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
    constructor() { }
    async fetchAllData() {
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
        };
        const command = new client_athena_1.StartQueryExecutionCommand(input);
        const response = await ATHENA_CLIENT.send(command);
        try {
            return JSON.stringify(response);
        }
        catch (error) {
            return JSON.stringify(response);
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
        };
        const command = new client_athena_1.StartQueryExecutionCommand(input);
        const response = await ATHENA_CLIENT.send(command);
        try {
            return JSON.stringify(response);
        }
        catch (error) {
            return JSON.stringify(response);
        }
    }
};
exports.DataFetchingService = DataFetchingService;
exports.DataFetchingService = DataFetchingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DataFetchingService);
//# sourceMappingURL=data-fetching.service.js.map