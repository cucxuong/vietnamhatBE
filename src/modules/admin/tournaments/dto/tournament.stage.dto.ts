import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TournamentStageType } from '../utils/enum';

export class CreateTournamentStageDto {
  @ApiProperty({ required: true })
  @IsEnum(TournamentStageType)
  @IsNotEmpty()
  type: TournamentStageType;
}
