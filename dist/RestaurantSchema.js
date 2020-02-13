"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var mongoose_paginate_1 = __importDefault(require("mongoose-paginate"));
var restaurantSchema = new mongoose_1.default.Schema({
    address: { building: String, coord: [Number, Number], street: String, zipcode: String },
    borough: String,
    cuisine: String,
    grades: [{ date: String, grade: String, score: Number }],
    name: String,
    restaurant_id: String
});
restaurantSchema.plugin(mongoose_paginate_1.default);
var Restaurants = mongoose_1.default.model("restaurant", restaurantSchema);
exports.default = Restaurants;
//# sourceMappingURL=RestaurantSchema.js.map