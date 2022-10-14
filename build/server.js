"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const fs_1 = __importDefault(require("fs"));
const resolvers_1 = __importDefault(require("./resolvers"));
const auth_1 = require("./utils/auth/auth");
const auth_directive_1 = require("./directives/auth.directive");
const schema_1 = require("@graphql-tools/schema");
const mongoose_1 = __importDefault(require("mongoose"));
const apollo_server_1 = require("apollo-server");
const apollo_server_core_1 = require("apollo-server-core");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const normalizePort = (val) => {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
const port = normalizePort(process.env.PORT || '4000');
const createHandler = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let dbUrl = 'mongodb://localhost:27017/my-todos';
        const isProduction = process.env.NODE_ENV === 'production';
        if (isProduction)
            dbUrl = process.env.DATABASE_URL || '';
        yield mongoose_1.default.connect(dbUrl);
        const { authDirectiveTransformer } = (0, auth_directive_1.authDirective)('auth');
        const schema = authDirectiveTransformer((0, schema_1.makeExecutableSchema)({
            typeDefs: [fs_1.default.readFileSync('./src/schema.graphql', 'utf8')],
            resolvers: resolvers_1.default,
        }));
        const server = new apollo_server_1.ApolloServer({
            schema,
            csrfPrevention: true,
            cache: 'bounded',
            context: ({ req }) => __awaiter(void 0, void 0, void 0, function* () {
                console.log(`typeof express.req ::: ${typeof req}`);
                const user = (0, auth_1.getCurrentUser)({ req });
                console.log(`Who : ${JSON.stringify(user)}`);
                return {
                    req,
                    currentUser: user,
                };
            }),
            plugins: [(0, apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground)()],
        });
        const { url } = yield server.listen(port);
        console.log(`🚀  Server ready at ${url}`);
    }
    catch (err) {
        console.log(err);
        return null;
    }
});
createHandler();
