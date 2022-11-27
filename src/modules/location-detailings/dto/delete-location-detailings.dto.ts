import { PickType } from '@nestjs/swagger';

import { DetailingDto } from './create-location-detailings.dto';

export class DeleteLocationDetailingsDto extends PickType(DetailingDto, [
  'type',
]) {}
