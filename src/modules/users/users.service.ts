import { HttpException, Inject, Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from '../../../utils/password';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProfileService } from '../profiles/profile.service';

interface FindAllAttrs {
  id?: number;
  email?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: EntityRepository<User>,
    @Inject(ProfileService)
    private profileService: ProfileService,
  ) {}

  private async validateEmail(createUserDto: CreateUserDto) {
    const foundedUser = await this.usersRepository.findOne({
      email: createUserDto.email,
    });

    if (foundedUser) {
      throw new HttpException('this email is already in use', 403);
    }
  }

  private async validateUsername(createUserDto: CreateUserDto) {
    const foundedUser = await this.usersRepository.findOne({
      username: createUserDto.username,
    });

    if (foundedUser) {
      throw new HttpException('this username is already in use', 403);
    }
  }

  async findAll() {
    try {
      return await this.usersRepository.findAll();
    } catch (error) {
      throw new HttpException('users not found', 404);
    }
  }

  async findOne(
    options: FindAllAttrs,
    passPwd = false,
  ): Promise<User | HttpException> {
    try {
      const findOptions = {};

      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined || value !== null) {
          findOptions[key] = value;
        }
      });
      return await this.usersRepository.findOneOrFail(
        findOptions,
        passPwd ? ['password'] : undefined,
      );
    } catch (error) {
      throw new HttpException('user not found', 404);
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      await this.validateEmail(createUserDto);
      await this.validateUsername(createUserDto);

      createUserDto.password = await hashPassword(createUserDto.password);
      const newUser = new User(createUserDto);
      await this.usersRepository.persistAndFlush(newUser);
      await this.profileService.create(newUser);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...sanizedUser } = newUser;

      return sanizedUser;
    } catch (error) {
      throw new HttpException("can't create user", 404);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      return await this.usersRepository.nativeUpdate({ id }, updateUserDto);
    } catch (error) {
      throw new HttpException("can't update user", 404);
    }
  }

  async delete(id: number) {
    try {
      await this.usersRepository.nativeDelete({ id });
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findAndPopulate(id: number, populate: string[]) {
    try {
      return await this.usersRepository.findOneOrFail({ id }, populate);
    } catch (error) {
      throw new HttpException('user not found', 404);
    }
  }
}
