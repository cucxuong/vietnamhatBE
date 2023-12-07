import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('[Admin] Match')
@ApiBearerAuth()
@Controller('matches')
export class MatchController {}
