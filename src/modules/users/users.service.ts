import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';

import { User } from '../../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from '@/utils/password';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProfileService } from '../profiles/profile.service';

interface FindAllAttrs {
  id?: number;
  email?: string;
}

interface findOnePopulateOptions {
  populateEmail?: boolean;
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
      throw new HttpException(
        "Can't use this e-mail.",
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private async validateUsername(createUserDto: CreateUserDto) {
    const foundedUser = await this.usersRepository.findOne({
      username: createUserDto.username,
    });

    if (foundedUser) {
      throw new HttpException(
        'This username is already in use.',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async findAll(username: string) {
    try {
      return await this.usersRepository.find(
        {
          username: { $like: '%' + username + '%' },
        },
        { populate: ['profile.file'] },
      );
    } catch (error) {
      throw new HttpException('Users not found.', HttpStatus.NOT_FOUND);
    }
  }

  async findOne(options: FindAllAttrs): Promise<User> {
    try {
      const findOptions = {};

      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined || value !== null) {
          findOptions[key] = value;
        }
      });

      return await this.usersRepository.findOne(findOptions);
    } catch (error) {
      throw error;
    }
  }

  async findOneWithEmail(options: FindAllAttrs): Promise<User> {
    try {
      const findOptions = {};

      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined || value !== null) {
          findOptions[key] = value;
        }
      });

      return await this.usersRepository
        .findOne(findOptions,{ populate: ['email'] });
    } catch (error) {
      throw error;
    }
  }

  async findWithDeviceToken(id: number): Promise<User> {
    try {
      return await this.usersRepository
      .findOne(
        { id, isActive: true }, 
        { populate: ['deviceToken'] 
      });
    } catch (error) {
      throw error;
    }
  }

  async findAndValidate(options: FindAllAttrs): Promise<User> {
    try {
      const findOptions = {};

      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined || value !== null) {
          findOptions[key] = value;
        }
      });
      return await this.usersRepository.findOne(findOptions);
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
      const { password, activationCode, ...sanizedUser } = newUser;

      return sanizedUser;
    } catch (error) {
      throw error;
    }
  }

  async update(authUserId: number, updateUserDto: UpdateUserDto) {
    try {
      return await this.usersRepository.nativeUpdate(
        { id: authUserId },
        updateUserDto,
      );
    } catch (error) {
      throw new HttpException("Can't update user.", HttpStatus.NOT_FOUND);
    }
  }

  async delete(authUserId: number) {
    try {
      await this.usersRepository.nativeDelete({ id: authUserId });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAndPopulate(id: number, populate: any[]) {
    try {
      return await this.usersRepository.findOneOrFail({ id }, { populate });
    } catch (error) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }
  }

  async setNewPassword(id: number, password: string) {
    try {
      const user = await this.usersRepository.findOneOrFail({ id });
      user.password = await hashPassword(password);
      this.usersRepository.flush();

      return true;
    } catch (error) {
      throw error;
    }
  }

  async activate(code: string) {
    try {
      const user = await this.usersRepository.findOne({
        activationCode: code,
      });

      if (!user) {
        throw new HttpException(
          'Invalid Activation Code',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.usersRepository
        .nativeUpdate(
          { id: user.id },
          { 
            activationCode: null,
            isActive: true 
          });

      return { message: 'User activated.', statusCode: HttpStatus.OK };
    } catch (error) {
      throw error;
    }
  }

  async setDeviceToken(authUserId: number, token: string) {
    try {
      const user = await this.findOne({ id: authUserId });

      if ('id' in user) {
        user.deviceToken = token;

        await this.usersRepository.flush();
      }

      return { message: 'Success', status: HttpStatus.OK };
    } catch (error) {
      throw new HttpException(
        'Error on set device token.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
