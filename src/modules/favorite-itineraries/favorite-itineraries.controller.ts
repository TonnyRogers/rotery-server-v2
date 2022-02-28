import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ParamId, RequestUser } from '@/utils//types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FavoriteItinerariesService } from './favorite-itineraries.service';

@UseGuards(JwtAuthGuard)
@Controller('itineraries')
export class FavoriteItinerariesController {
  constructor(
    @Inject(FavoriteItinerariesService)
    private favoriteItinerariesService: FavoriteItinerariesService,
  ) {}

  @Get('/favorites')
  async listFavorites(@Req() request: RequestUser) {
    return this.favoriteItinerariesService.list(request.user.userId);
  }

  @Post('/:id/favorite')
  async addToFavorite(@Req() request: RequestUser, @Param() params: ParamId) {
    return this.favoriteItinerariesService.add(request.user.userId, params.id);
  }

  @Delete('/:id/unfavorite')
  async removeToFavorite(
    @Req() request: RequestUser,
    @Param() params: ParamId,
  ) {
    return this.favoriteItinerariesService.remove(
      request.user.userId,
      params.id,
    );
  }
}
