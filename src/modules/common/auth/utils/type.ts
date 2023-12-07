import { UserRole } from 'src/modules/admin/users/utils/enum';

export interface LoggedUser {
  email: string;
  role: UserRole;
  id: string;
}

export enum TokenType {
  access = 'ACCESS_TOKEN',
  refresh = 'REFRESH_TOKEN',
}

export interface TokenPayload {
  id: string;
  email: string;
  role: UserRole;
  type: TokenType;
}
