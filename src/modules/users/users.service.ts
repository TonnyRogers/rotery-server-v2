import { HttpException, Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from 'utils/password';
import { UpdateUserDto } from './dto/update-user.dto';

interface FindAllAttrs {
  id?: number;
  email?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: EntityRepository<User>,
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
      return new HttpException('users not found', 404);
    }
  }

  async findOne(options: FindAllAttrs): Promise<User | HttpException> {
    try {
      const findOptions = {};

      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined || value !== null) {
          findOptions[key] = value;
        }
      });
      return await this.usersRepository.findOneOrFail(findOptions);
    } catch (error) {
      return new HttpException('user not found', 404);
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      await this.validateEmail(createUserDto);
      await this.validateUsername(createUserDto);

      createUserDto.password = await hashPassword(createUserDto.password);
      const newUser = new User(createUserDto);
      await this.usersRepository.persistAndFlush(newUser);

      return newUser;
    } catch (error) {
      return error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      return await this.usersRepository.findOneOrFail({ id }, updateUserDto);
    } catch (error) {
      return new HttpException("can't update user", 404);
    }
  }
}
