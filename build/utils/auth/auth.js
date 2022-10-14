"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function getCurrentUser(context) {
    const authHeader = context.req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split('Bearer ')[1];
        if (!token) {
            console.log("Authentication token must be 'Bearer [token]");
            return null;
        }
        try {
            const user = jsonwebtoken_1.default.verify(token, 'my_secret_key');
            return user;
        }
        catch (err) {
            console.log('Invalid/Expired token');
        }
    }
    console.log('Authorization header is not provided!');
    return null;
}
exports.getCurrentUser = getCurrentUser;
