"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("./users");
exports.default = {
    Query: {
        users: users_1.users,
        user: users_1.user,
    },
    Mutation: {
        login: users_1.login,
    },
};
