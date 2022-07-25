import { PickType } from '@nestjs/swagger';

import { CreateLocationDetailingsDto } from './create-location-detailings.dto';

export class DeleteLocationDetailingsDto extends PickType(
  CreateLocationDetailingsDto,
  ['type'],
) {}
