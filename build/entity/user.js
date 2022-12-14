"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    createdAt: {
        type: String,
        required: true,
    },
    createdBy: {
        type: String,
        required: true,
    },
    updatedAt: {
        type: String,
        required: true,
    },
    updatedBy: {
        type: String,
        required: true,
    },
});
const Users = mongoose_1.default.model('users', userSchema);
exports.default = Users;
