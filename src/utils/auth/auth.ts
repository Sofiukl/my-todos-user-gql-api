import jwt from 'jsonwebtoken';
import { MyTodosServerContext } from '../../type/common';

export function getCurrentUser(
  context: MyTodosServerContext,
): string | jwt.JwtPayload | null {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      console.log("Authentication token must be 'Bearer [token]");
      return null;
    }
    try {
      const user = jwt.verify(token, 'my_secret_key');
      return user;
    } catch (err) {
      console.log('Invalid/Expired token');
    }
  }
  console.log('Authorization header is not provided!');
  return null;
}
