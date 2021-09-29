import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { Profile } from '../profiles/entities/profile.entity';
import { ProfileModule } from '../profiles/profile.module';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const userPayload = {
    username: 'Bea Marques',
    email: 'beaklch@outlook.com',
    password: '112233',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
      imports: [
        UsersModule,
        MikroOrmModule.forFeature([User, Profile]),
        ProfileModule,
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it.only('should be defined', async () => {
    expect(usersController).toBeDefined();
  });

  it('should create a user', () => {
    const result = {
      createdAt: new Date(),
      updatedAt: new Date(),
      username: userPayload.username,
      email: userPayload.email,
      id: 23,
      role: 'user',
      isActive: false,
    };
    jest.spyOn(usersService, 'create').mockImplementation(async () => result);

    expect(usersController.create(userPayload)).toBe(result);
  });
});
