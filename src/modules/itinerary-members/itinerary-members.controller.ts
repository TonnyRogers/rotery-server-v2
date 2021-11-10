import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ParamId, RequestUser } from 'utils/types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AcceptMemberDto } from './dto/accept-member.dto';
import { CreateMemberDto } from './dto/create-member.dto';
import { ItineraryMembersService } from './itinerary-members.service';

@UseGuards(JwtAuthGuard)
@Controller('itineraries')
export class ItineraryMembersController {
  constructor(
    @Inject(ItineraryMembersService)
    private itinerarymembersService: ItineraryMembersService,
  ) {}

  @Post('/:id/join')
  async joinInItinerary(
    @Param() params: ParamId,
    @Req() request: RequestUser,
    @Body() createMemberDto: CreateMemberDto,
  ) {
    return this.itinerarymembersService.create(
      request.user.userId,
      params.id,
      createMemberDto,
    );
  }

  @Get('/member')
  async getMemberItineraries(@Req() request: RequestUser) {
    return this.itinerarymembersService.itineraries(request.user.userId);
  }

  @Post('/:id/approve')
  async acceptMember(
    @Param() params: ParamId,
    @Req() request: RequestUser,
    @Body() acceptMemberDto: AcceptMemberDto,
  ) {
    return this.itinerarymembersService.acceptMember(
      request.user.userId,
      params.id,
      acceptMemberDto,
    );
  }

  @Post('/:id/remove')
  async rejectMember(
    @Param() params: ParamId,
    @Req() request: RequestUser,
    @Body() acceptMemberDto: AcceptMemberDto,
  ) {
    return this.itinerarymembersService.refuseMember(
      request.user.userId,
      params.id,
      acceptMemberDto,
    );
  }

  @Post('/:id/promote')
  async promoteMember(
    @Param() params: ParamId,
    @Req() request: RequestUser,
    @Body() acceptMemberDto: AcceptMemberDto,
  ) {
    return this.itinerarymembersService.promoteMember(
      request.user.userId,
      params.id,
      acceptMemberDto,
    );
  }

  @Post('/:id/demote')
  async demoteMember(
    @Param() params: ParamId,
    @Req() request: RequestUser,
    @Body() acceptMemberDto: AcceptMemberDto,
  ) {
    return this.itinerarymembersService.demoteMember(
      request.user.userId,
      params.id,
      acceptMemberDto,
    );
  }

  @Post('/:id/leave')
  async leaveItinerary(@Param() params: ParamId, @Req() request: RequestUser) {
    return this.itinerarymembersService.leave(request.user.userId, params.id);
  }
}
