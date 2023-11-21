import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Gender } from 'src/modules/admin/player/utils/type';
import {
  ClothesSize,
  StandardColor,
} from 'src/modules/admin/tournament/utils/type';

export class ClothesService {
  @ApiProperty({ required: true, type: 'enum', enum: StandardColor })
  @IsEnum(StandardColor)
  @IsNotEmpty()
  color: StandardColor;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  quantity: number;

  @ApiProperty({ required: true, type: 'enum', enum: ClothesSize })
  @IsEnum(ClothesSize)
  @IsNotEmpty()
  size: ClothesSize;
}

export class QuantityService {
  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  quantity: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  price: number;
}

export class PlayerSKill {
  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  play_exp: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  years: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  throwing: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  catching: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  cutting: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  defense: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  fitness: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  captain: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  team?: string;
}

export class PlayerService {
  @ApiProperty({ required: true })
  @IsBoolean()
  lunch: boolean;

  @ApiProperty({ required: false })
  is_vegan?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  allergies?: string;

  @ApiProperty({ required: true })
  @IsBoolean()
  bus: boolean;

  @ApiProperty({ required: true, isArray: true, type: () => [ClothesService] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClothesService)
  jerseys: ClothesService[];

  @ApiProperty({ required: true, isArray: true, type: ClothesService })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClothesService)
  shorts: ClothesService[];

  @ApiProperty({ required: true })
  @IsNumber()
  disc: number;
}

export class CreatePlayerDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  nickname: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  yob: string;

  @ApiProperty({ required: true, enum: Gender, type: 'enum' })
  @IsString()
  @IsOptional()
  gender: Gender;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ required: true })
  @IsBoolean()
  @IsNotEmpty()
  is_student: boolean;

  @ApiProperty({ required: true })
  @ValidateNested()
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => PlayerSKill)
  skills: PlayerSKill;

  @ApiProperty({ required: true })
  @ValidateNested()
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => PlayerService)
  services: PlayerService;
}
