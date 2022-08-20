export interface MetadataServiceInterface {
  backpackerWelcome(
    authUserId: number,
  ): Promise<{ ratedLocations: number; ratedGuides: number }>;
  guideWelcome(authUserId: number): Promise<{ helpedBackpackers: number }>;
}
