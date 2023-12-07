import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/modules/common/auth/guard/jwt.guard';
import { CreateGroupDto } from './dto/group.dto';
import { GroupService } from './group.service';

@Controller('groups')
@ApiTags('[Admin] Groups')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  async index() {
    return this.groupService.getList();
  }

  @Post()
  async store(@Body() body: CreateGroupDto) {
    return await this.groupService.store(body);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: CreateGroupDto) {
    return await this.groupService.update(id, body);
  }

  @Get(':id')
  async show(@Param('id') id: string) {
    return await this.groupService.findById(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.groupService.delete(id);
  }
}
