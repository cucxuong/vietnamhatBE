import { TokenType } from './const';

export interface AuthedUser {
  id: string;
  email: string;
  type: TokenType;
}

export interface TokenPayload {
  id: string;
  email: string;
  type: TokenType;
}
