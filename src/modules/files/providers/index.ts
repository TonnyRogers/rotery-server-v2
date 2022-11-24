import { Provider } from '@nestjs/common';

import { FilesService } from '../files.service';

import { FilesProvider } from '../enums/files-provider.enums';
import { FilesRepository } from '../files.repository';

export const filesProvider: Provider[] = [
  {
    provide: FilesProvider.FILES_SERVICE,
    useClass: FilesService,
  },
  {
    provide: FilesProvider.FILES_REPOSITORY,
    useClass: FilesRepository,
  },
];
