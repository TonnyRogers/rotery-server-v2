import { Inject, Injectable } from '@nestjs/common';

import { TipsServiceInterface } from './interface/tips-service.interface';

import { Tip } from '@/entities/tip.entity';

import { UsersProvider } from '../users/enums/users-provider.enum';
import { UsersRepositoryInterface } from '../users/interfaces/users-repository.interface';
import { CreateTipDto } from './dto/create-tip.dto';
import { TipsProvider } from './enums/tips-providers.enum';
import { TipsRepositoryInterface } from './interface/tips-repository.interface';

@Injectable()
export class TipsService implements TipsServiceInterface {
  constructor(
    @Inject(TipsProvider.TIPS_REPOSITORY)
    private readonly tipsRepository: TipsRepositoryInterface,
    @Inject(UsersProvider.USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryInterface,
  ) {}

  async add(authUserId: number, dto: CreateTipDto): Promise<Tip> {
    const payer = await this.usersRepository.findOne({ id: authUserId });
    const user = await this.usersRepository.findOne({ id: dto.user.id });

    const newTip = new Tip({
      ...dto,
      payer,
      user,
    });

    return this.tipsRepository.create(newTip);
  }

  async getByPayer(authUserId: number): Promise<Tip[]> {
    return this.tipsRepository.findAll({ payer: authUserId });
  }

  async getByCollector(authUserId: number): Promise<Tip[]> {
    return this.tipsRepository.findAll({ user: authUserId });
  }
}
