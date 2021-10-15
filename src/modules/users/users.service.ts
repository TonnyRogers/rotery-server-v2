import { HttpException, Inject, Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../../entities/user.entity';
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
      throw new HttpException("Can't use this e-mail.", 403);
    }
  }

  private async validateUsername(createUserDto: CreateUserDto) {
    const foundedUser = await this.usersRepository.findOne({
      username: createUserDto.username,
    });

    if (foundedUser) {
      throw new HttpException('This username is already in use.', 403);
    }
  }

  async findAll() {
    try {
      return await this.usersRepository.findAll();
    } catch (error) {
      throw new HttpException('Users not found.', 404);
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
      return await this.usersRepository.findOneOrFail(findOptions);
    } catch (error) {
      throw error;
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      await this.validateEmail(createUserDto);
      await this.validateUsername(createUserDto);

      createUserDto.password = await hashPassword(createUserDto.password);
      const newUser = new User(createUserDto);
      newUser.activationCode = String(
        Date.now() + Math.floor(100000 + Math.random() * 900000),
      );
      await this.usersRepository.persistAndFlush(newUser);
      await this.profileService.create(newUser);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...sanizedUser } = newUser;

      return sanizedUser;
    } catch (error) {
      throw new HttpException("Can't create user.", 404);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      return await this.usersRepository.nativeUpdate({ id }, updateUserDto);
    } catch (error) {
      throw new HttpException("Can't update user.", 404);
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
      throw new HttpException('User not found.', 404);
    }
  }

  async setNewPassword(id: number, password: string) {
    try {
      const user = await this.usersRepository.findOne({ id });
      user.password = await hashPassword(password);
      this.usersRepository.flush();

      return true;
    } catch (error) {
      throw error;
    }
  }

  async activate(code: string) {
    try {
      const user = await this.usersRepository.findOne({ activationCode: code });

      if (!user) {
        throw new HttpException('Invalid Activation Code', 404);
      }

      user.activationCode = null;
      user.isActive = true;
      this.usersRepository.flush();

      return { message: 'User activated.', statusCode: 200 };
    } catch (error) {
      throw error;
    }
  }
}
