"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
var typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'sofikul.mallick',
    password: 'sofikul.mallick',
    database: 'sofikul.mallick',
    synchronize: true,
    logging: true,
    entities: ['src/entity/*.js'],
    migrations: [],
    subscribers: [],
});
