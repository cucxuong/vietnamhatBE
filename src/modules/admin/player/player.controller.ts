import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('players')
@ApiTags('Admin Player')
export class PlayerController {}
