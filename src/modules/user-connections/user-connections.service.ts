import { EntityRepository } from '@mikro-orm/knex';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserConnection } from './entities/user-connection.entity';

@Injectable()
export class UserConnectionService {
  constructor(
    @InjectRepository(UserConnection)
    private userConnectionRepository: EntityRepository<UserConnection>,
    @Inject(UsersService)
    private userService: UsersService,
  ) {}

  async connect(authUserId: number, targetId: number) {
    try {
      if (authUserId === targetId) {
        throw new HttpException("You can't make connection with yourself", 400);
      }

      const authUser = await this.userService.findOne({ id: authUserId });
      const targetUser = await this.userService.findOne({ id: targetId });
      const connectionExists = this.userConnectionRepository.findOne({
        target: targetId,
        owner: authUserId,
      });

      if (connectionExists) {
        throw new HttpException(
          'You already have an connection with this user',
          400,
        );
      }
      const newConnection = new UserConnection({
        owner: 'id' in authUser && authUser,
        target: 'id' in targetUser && targetUser,
      });

      await this.userConnectionRepository.persistAndFlush(newConnection);

      return newConnection;
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  // async findAll() {}
  // async update() {}
  // async delete() {}
}
