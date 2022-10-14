"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = exports.users = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../entity/user"));
function generateToken(user) {
    return jsonwebtoken_1.default.sign({
        email: user.email,
        role: user.role,
    }, 'my_secret_key', { expiresIn: '3h' });
}
function login(_, input) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = input;
        const userDB = yield user_1.default.findOne({ email, password });
        if (!userDB)
            throw 'Invalid User';
        const token = generateToken(userDB);
        console.log(`Generated token ${token}`);
        return {
            token,
        };
    });
}
exports.login = login;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function users(_) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield user_1.default.find();
    });
}
exports.users = users;
function user(_, input) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`USER ID : ${input.userId}`);
        const userDB = yield user_1.default.findById(input.userId);
        console.log(`userDB: ${JSON.stringify(userDB)}`);
        if (!userDB)
            return null;
        return {
            id: input.userId,
            email: userDB === null || userDB === void 0 ? void 0 : userDB.email,
            role: userDB === null || userDB === void 0 ? void 0 : userDB.role,
            createdAt: userDB === null || userDB === void 0 ? void 0 : userDB.createdAt,
            createdBy: userDB === null || userDB === void 0 ? void 0 : userDB.createdBy,
            updatedAt: userDB === null || userDB === void 0 ? void 0 : userDB.updatedAt,
            updatedBy: userDB === null || userDB === void 0 ? void 0 : userDB.updatedBy,
        };
    });
}
exports.user = user;
