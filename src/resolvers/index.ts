import { login, user, users } from "./users";

export default {
  Query: {
    users,
    user,
  },
  Mutation: {
    login,
  },
};
