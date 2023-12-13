import { ApiProperty } from '@nestjs/swagger';
import {
    IsMongoId,
    IsNotEmpty,
    IsOptional,
    IsString
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateGroupDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsMongoId()
  stage: mongoose.Schema.Types.ObjectId;

  @ApiProperty({
    required: false,
    isArray: true,
    type: [mongoose.Schema.Types.ObjectId],
  })
  @IsOptional()
  @IsMongoId({ each: true })
  teams: mongoose.Schema.Types.ObjectId[];
}
