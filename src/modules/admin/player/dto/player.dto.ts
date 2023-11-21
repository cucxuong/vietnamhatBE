import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { PlayerStatus } from '../utils/type';

export class UpdateStatusDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ required: true, type: 'enum', enum: PlayerStatus })
  @IsString()
  @IsEnum(PlayerStatus)
  @IsNotEmpty()
  status: PlayerStatus;
}


export class UpdatePaymentDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsEnum(PlayerStatus)
  @IsNotEmpty()
  @IsIn([PlayerStatus.Halfpaid, PlayerStatus.Paid])
  status: PlayerStatus.Halfpaid | PlayerStatus.Paid;
}
