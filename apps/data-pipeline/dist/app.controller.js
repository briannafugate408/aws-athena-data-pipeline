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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const data_fetching_service_1 = require("./data-fetching.service");
let AppController = class AppController {
    constructor(dataFetchingService) {
        this.dataFetchingService = dataFetchingService;
    }
    fetchAllData() {
        return this.dataFetchingService.fetchAllData();
    }
    fetchBatchOrderData() {
        return this.dataFetchingService.fetchBatchOrderData();
    }
    fetchOrderDataAndIngredients() {
        return this.dataFetchingService.fetchOrderDataAndIngredients();
    }
    fetchFilteredData() {
        return this.dataFetchingService.fetchOrderDataAndIngredientsForQSROrder();
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "fetchAllData", null);
__decorate([
    (0, common_1.Get)('batch'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "fetchBatchOrderData", null);
__decorate([
    (0, common_1.Get)('join'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "fetchOrderDataAndIngredients", null);
__decorate([
    (0, common_1.Get)('filter'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "fetchFilteredData", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [data_fetching_service_1.DataFetchingService])
], AppController);
//# sourceMappingURL=app.controller.js.map