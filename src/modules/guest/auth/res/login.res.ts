export class LoginData {
  id: string;
  name: string;
  email: string;
  access_token: string;
  refresh_token: string;

  constructor(partial: Partial<LoginData>) {
    Object.assign(this, partial);
  }
}
