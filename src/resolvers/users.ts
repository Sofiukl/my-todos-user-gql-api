import { GetUserResponse, LogInResponse } from '../generated/schema';
import jwt from 'jsonwebtoken';
import Users, { UserEntity } from '../entity/user';

function generateToken(user: UserEntity) {
  return jwt.sign(
    {
      email: user.email,
      role: user.role,
    },
    'my_secret_key',
    { expiresIn: '3h' },
  );
}

export async function login(
  _: unknown,
  input: { email: string; password: string },
): Promise<LogInResponse> {
  const { email, password } = input;
  const userDB: UserEntity | null = await Users.findOne({ email, password });
  if (!userDB) throw 'Invalid User';
  const token = generateToken(userDB);
  console.log(`Generated token ${token}`);

  return {
    token,
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function users(_: unknown): Promise<GetUserResponse[]> {
  return await Users.find();
}

export async function user(
  _: unknown,
  input: { userId: string },
): Promise<GetUserResponse | null> {
  console.log(`USER ID : ${input.userId}`);
  const userDB: UserEntity | null = await Users.findById(input.userId);
  console.log(`userDB: ${JSON.stringify(userDB)}`);
  if (!userDB) return null;
  return {
    id: input.userId,
    email: userDB?.email,
    role: userDB?.role,
    createdAt: userDB?.createdAt,
    createdBy: userDB?.createdBy,
    updatedAt: userDB?.updatedAt,
    updatedBy: userDB?.updatedBy,
  };
}
