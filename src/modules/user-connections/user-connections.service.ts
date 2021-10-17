import { EntityRepository } from '@mikro-orm/knex';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, Inject, Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { UpdateConnectionDto } from './dto/update-connection.dto';
import { UserConnection } from '../../entities/user-connection.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationAlias } from '../../entities/notification.entity';
import { NotificationSubject } from 'utils/types';
import { NotificationsGateway } from '../notifications/notifications.gateway';

export interface ConnectionReponse {
  connections: UserConnection[];
  invites: UserConnection[];
}
@Injectable()
export class UserConnectionService {
  constructor(
    @InjectRepository(UserConnection)
    private userConnectionRepository: EntityRepository<UserConnection>,
    @Inject(UsersService)
    private userService: UsersService,
    @Inject(NotificationsService)
    private notificationsService: NotificationsService,
    @Inject(NotificationsGateway)
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async connect(authUserId: number, targetId: number) {
    try {
      if (Number(authUserId) === Number(targetId)) {
        throw new HttpException(
          "You can't make connection with yourself.",
          400,
        );
      }

      const authUser = await this.userService.findOne({ id: authUserId });
      const targetUser = await this.userService.findOne({ id: targetId });
      const connectionExists = await this.userConnectionRepository.findOne({
        target: targetId,
        owner: authUserId,
      });

      const inversedConnection = await this.userConnectionRepository.findOne({
        target: authUserId,
        owner: targetId,
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

      if (inversedConnection) {
        await this.notificationsService.create(inversedConnection.owner.id, {
          alias: NotificationAlias.NEW_CONNECTION_ACCEPTED,
          subject: NotificationSubject.newConnectionAccepted,
          content: `com ${newConnection.owner.username}`,
          jsonData: { ...newConnection },
        });
      } else {
        await this.notificationsService.create(newConnection.target.id, {
          alias: NotificationAlias.NEW_CONNECTION,
          subject: NotificationSubject.newConnection,
          content: `com ${newConnection.owner.username}`,
          jsonData: { ...newConnection },
        });
      }

      return newConnection;
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findAll(authUserId: number): Promise<ConnectionReponse> {
    try {
      const connections = await this.userConnectionRepository.find(
        {
          owner: authUserId,
        },
        ['target.profile.file'],
      );
      const invites = await this.userConnectionRepository.find(
        {
          target: authUserId,
        },
        ['owner.profile.file'],
      );

      return {
        connections,
        invites,
      };
    } catch (error) {
      throw new HttpException(error.message, error.code);
    }
  }

  async update(
    authUserId: number,
    connectionId: number,
    updateConnectionDto: UpdateConnectionDto,
  ) {
    try {
      const connection = await this.userConnectionRepository.findOne(
        {
          id: connectionId,
          owner: authUserId,
        },
        ['target.profile.file'],
      );

      connection.isBlocked = updateConnectionDto.isBlocked;

      this.userConnectionRepository.persist(connection);
      await this.userConnectionRepository.flush();

      if (updateConnectionDto.isBlocked) {
        await this.notificationsService.create(connection.target.id, {
          alias: NotificationAlias.CONNECTION_BLOCK,
          subject: NotificationSubject.connectionBlock,
          content: `com ${connection.owner.username}`,
          jsonData: { ...connection },
        });
      } else {
        await this.notificationsService.create(connection.target.id, {
          alias: NotificationAlias.CONNECTION_UNBLOCK,
          subject: NotificationSubject.connectionUnblock,
          content: `com ${connection.owner.username}`,
          jsonData: { ...connection },
        });
      }

      return connection;
    } catch (error) {
      throw new HttpException('Error on updade this connection.', 400);
    }
  }

  async delete(authUserId: number, connectionId: number) {
    try {
      const connection = await this.userConnectionRepository.findOne({
        id: connectionId,
        owner: authUserId,
      });

      await this.userConnectionRepository.removeAndFlush(connection);
    } catch (error) {
      throw new HttpException('Error delete this connection.', 400);
    }
  }
}
