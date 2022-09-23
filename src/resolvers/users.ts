import { LogInResponse, User } from "../generated/schema";
import jwt from "jsonwebtoken";
import usersJson from "./users.json";
import { Users } from "aws-sdk/clients/budgets";

function generateToken(user: User) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    "my_secret_key",
    { expiresIn: "3h" }
  );
}

export function login(
  _: unknown,
  input: { email: String; password: String }
): LogInResponse {
  const { email, password } = input;
  const filteredUser = usersJson.filter(
    (u) => u.email === email && u.password === password
  );
  const user = filteredUser && filteredUser[0];
  const token = generateToken(user);
  console.log(`Generated token ${token}`);

  return {
    token,
  };
}

export function users(_: unknown): User[] {
  return usersJson;
}
