import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateMember } from '../use-case/create-member.use-case';
import { CreateMemberRequestDto } from './dto/create-member.request.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetMember } from '../use-case/get-member.use-case';
import { GetMemberRequestDto } from './dto/get-member.request.dto';
import { UpdateMember } from '../use-case/update-member.use-case';
import { DeleteMember } from '../use-case/delete-member.use-case';

@Controller('v1/member')
@ApiTags('Member')
export class MemberController {
  constructor(
    private createMember: CreateMember,
    private getMember: GetMember,
    private updateMember: UpdateMember,
    private deleteMember: DeleteMember,
  ) {
    // fill above parentheses with use case / repository dependencies
  }

  @Post('')
  createMemberHandler(@Body() body: CreateMemberRequestDto) {
    return this.createMember.execute({ data: body });
  }

  @Get()
  getMemberHandler(@Query() query: GetMemberRequestDto) {
    return this.getMember.execute({ data: query });
  }

  @Delete(':_id')
  deleteMemberHandler(@Param('_id') _id: string) {
    return this.deleteMember.execute({ _id });
  }

  @Put(':_id')
  updateMemberHandler(
    @Param('_id') _id: string,
    @Body() body: CreateMemberRequestDto,
  ) {
    return this.updateMember.execute({ _id, data: body });
  }
}
