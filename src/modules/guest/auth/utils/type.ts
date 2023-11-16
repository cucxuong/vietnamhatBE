import { TokenType } from './const';

export interface TokenPayload {
  id: string;
  email: string;
  type: TokenType;
}
