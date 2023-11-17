import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsDateString,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateTournamentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: true })
  description: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  start_date: Date;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  end_date: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  location: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  status: string;

  @IsOptional()
  @ApiProperty({ required: false })
  options: string;
}

export class UpdateTournamentDto extends PartialType(CreateTournamentDto) {}
