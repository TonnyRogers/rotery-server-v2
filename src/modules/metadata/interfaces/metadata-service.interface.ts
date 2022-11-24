import { WelcomeStepItem } from '@/utils/types';

export type FirstStepResponseData = {
  stepList: WelcomeStepItem[];
  allDone: boolean;
};

export interface MetadataServiceInterface {
  backpackerWelcome(
    authUserId: number,
  ): Promise<{ ratedLocations: number; ratedGuides: number }>;
  guideWelcome(authUserId: number): Promise<{ helpedBackpackers: number }>;
  firstSteps(authUserId: number): Promise<FirstStepResponseData>;
}
