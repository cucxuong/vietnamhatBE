import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UniqueEmail } from '../validation-rules/unique-email.rule';

export class CreatePlayerDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsOptional()
  nick_name: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @UniqueEmail({ message: 'Email was exists' })
  email: string;

  @IsString()
  @IsNotEmpty()
  year_of_birth: string;
}
