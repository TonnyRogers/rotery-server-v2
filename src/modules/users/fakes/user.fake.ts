import { Profile } from '@/entities/profile.entity';
import { User, UserRole } from '@/entities/user.entity';

export const fakeUsers: User[] = [
  {
    activationCode: null,
    bankAccount: null,
    connections: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    customerId: null,
    directs: null,
    email: 'fake@fake.com',
    favoriteItineraries: undefined,
    id: 1,
    isActive: true,
    isGuide: false,
    itineraries: undefined,
    nextItineraries: undefined,
    notifications: undefined,
    password: 'dk023q924j24',
    profile: {} as Profile,
    ratingAvg: 0,
    ratings: undefined,
    role: UserRole.USER,
    subscription: undefined,
    username: 'fake username',
    deviceToken: undefined,
    afterCreate: () => Promise.resolve(),
    canRelateLocation: false,
  },
];
