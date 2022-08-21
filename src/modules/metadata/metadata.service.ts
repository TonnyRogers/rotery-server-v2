import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';

import { UserRatingsRepositoryInterface } from '../user-ratings/interfaces/user-ratings-service.interface';
import {
  FirstStepResponseData,
  MetadataServiceInterface,
} from './interfaces/metadata-service.interface';

import { AppRoutes, WelcomeStepListType } from '@/utils/enums';
import { WelcomeStepItem } from '@/utils/types';

import { ChatProvider } from '../chat/enums/chat-provider.enum';
import { ChatRepositoryInterface } from '../chat/interface/chat-repository.interface';
import { LocationRatingsProvider } from '../location-ratings/enums/location-ratings-provider.enum';
import { LocationRatingsRepositoryInterface } from '../location-ratings/interfaces/location-ratings-repository.interface';
import { UserRatingsProvider } from '../user-ratings/enums/user-ratings-providers.enum';
import { UsersProvider } from '../users/enums/users-provider.enum';
import { UsersRepositoryInterface } from '../users/interfaces/users-repository.interface';

@Injectable()
export class MetadataService implements MetadataServiceInterface {
  constructor(
    @Inject(LocationRatingsProvider.LOCATION_RATINGS_REPOSITORY)
    private readonly locationRatingsRepository: LocationRatingsRepositoryInterface,
    @Inject(UserRatingsProvider.USER_RATINGS_REPOSITORY)
    private readonly userRatingsRepository: UserRatingsRepositoryInterface,
    @Inject(UsersProvider.USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryInterface,
    @Inject(ChatProvider.CHAT_REPOSITORY)
    private readonly chatRepository: ChatRepositoryInterface,
  ) {}

  async backpackerWelcome(
    authUserId: number,
  ): Promise<{ ratedLocations: number; ratedGuides: number }> {
    const locationRatings = await this.locationRatingsRepository.findAll({
      owner: authUserId,
    });

    const guidesRatings = await this.userRatingsRepository.findAll({
      owner: authUserId,
    });

    return {
      ratedLocations: locationRatings.length,
      ratedGuides: guidesRatings.length,
    };
  }

  async guideWelcome(
    authUserId: number,
  ): Promise<{ helpedBackpackers: number }> {
    const usersRatings = await this.userRatingsRepository.findAll({
      user: authUserId,
    });

    return {
      helpedBackpackers: usersRatings.length,
    };
  }

  async firstSteps(authUserId: number): Promise<FirstStepResponseData> {
    const user = await this.usersRepository.findOne({ id: authUserId }, [
      'profile.file',
      'profile.document',
    ]);
    if (!user) {
      throw new UnprocessableEntityException("Can't find user");
    }

    const stepList: WelcomeStepItem[] = [];
    const chatCount = await this.chatRepository.findOne({ senderId: user.id });

    const hasPhoto = !!user.profile.file;
    const hasBasicData =
      !!user.profile.name && !!user.profile.birth && !!user.profile.document;

    stepList.push({
      title: 'Foto do perfil 📸',
      text: 'saber com quem estamos interagindo tras muito mais segurança que tal mostrar seu rostinho ?',
      type: WelcomeStepListType.PROFILE_PHOTO,
      done: hasPhoto,
      appNavigationTarget: AppRoutes.PROFILE,
    });

    stepList.push({
      title: 'Um pouco mais sobre você 🙈',
      text: 'preencha seus dados (nome,documento e nascimento) do perfil e assim todos vão saber mais sobre quem você é.',
      type: WelcomeStepListType.PROFILE_BASIC_INFO,
      done: hasBasicData,
      appNavigationTarget: AppRoutes.PROFILE,
    });

    if (user.isHost) {
      stepList.push({
        title: 'Primeiro contato 🤝',
        text: 'entre num chat com um mochileiro.',
        type: WelcomeStepListType.GUIDE_FIRST_CHAT,
        done: !!chatCount,
        appNavigationTarget: AppRoutes.EXPLORE_LOCATIONS,
      });
    } else {
      stepList.push({
        title: 'Primeiro contato 🤝',
        text: 'entre num chat com um guia, vai que o primeiro é de graça.',
        type: WelcomeStepListType.BACKPACKER_FIRST_CHAT,
        done: !!chatCount,
        appNavigationTarget: AppRoutes.EXPLORE_LOCATIONS,
      });
    }

    return {
      stepList: stepList,
      allDone: hasPhoto && hasBasicData && !!chatCount,
    };
  }
}
