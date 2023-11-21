import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthorizeCountryDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  code: string;
}
