import { Provider } from '@nestjs/common';

import { ContentService } from '../content.service';
import { FilesService } from '@/modules/files/files.service';

import { FilesProvider } from '@/modules/files/enums/files-provider.enums';

import { ContentRepository } from '../content.repository';
import { ContentProvider } from '../enums/content-provider.enum';

export const contentProvider: Provider[] = [
  {
    provide: ContentProvider.CONTENT_SERVICE,
    useClass: ContentService,
  },
  {
    provide: ContentProvider.CONTENT_REPOSITORY,
    useClass: ContentRepository,
  },
  {
    provide: FilesProvider.FILES_SERVICE,
    useClass: FilesService,
  },
];
