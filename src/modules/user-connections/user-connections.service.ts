import { EntityRepository } from '@mikro-orm/knex';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, Inject, Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { UpdateConnectionDto } from './dto/update-connection.dto';
import { UserConnection } from '../../entities/user-connection.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationAlias } from '../../entities/notification.entity';
import { NotificationSubject } from '../../../utils/types';
import { NotificationsGateway } from '../notifications/notifications.gateway';

export interface ConnectionReponse {
  connections: UserConnection[];
  invites: UserConnection[];
}

const connectionPopulate = ['owner.profile.file', 'target.profile.file'];
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

  async connect(authUserId: number, targetId: number): Promise<UserConnection> {
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

      const inviteConnection = await this.userConnectionRepository.findOne({
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

      const selectedConnection = await this.findOne(newConnection.id);

      if (inviteConnection) {
        // connection
        await this.notificationsService.create(inviteConnection.owner.id, {
          alias: NotificationAlias.NEW_CONNECTION_ACCEPTED,
          subject: NotificationSubject.newConnectionAccepted,
          content: `com ${newConnection.owner.username}`,
          jsonData: { ...selectedConnection },
        });
      } else {
        //invite
        await this.notificationsService.create(newConnection.target.id, {
          alias: NotificationAlias.NEW_CONNECTION,
          subject: NotificationSubject.newConnection,
          content: `com ${newConnection.owner.username}`,
          jsonData: { ...selectedConnection },
        });
      }

      return selectedConnection;
    } catch (error) {
      throw error;
    }
  }

  async findAll(authUserId: number): Promise<ConnectionReponse> {
    try {
      const connections = await this.userConnectionRepository.find(
        {
          owner: authUserId,
        },
        connectionPopulate,
      );
      const invites = await this.userConnectionRepository.find(
        {
          target: authUserId,
        },
        connectionPopulate,
      );

      return {
        connections,
        invites,
      };
    } catch (error) {
      throw new HttpException(error.message, error.code);
    }
  }

  async findOne(connectionId: number) {
    try {
      const selectedConnection = await this.userConnectionRepository.findOne(
        { id: connectionId },
        connectionPopulate,
      );

      return selectedConnection;
    } catch (error) {
      throw error;
    }
  }

  async update(
    authUserId: number,
    connectionUserId: number,
    updateConnectionDto: UpdateConnectionDto,
  ) {
    try {
      const connection = await this.userConnectionRepository.findOneOrFail(
        {
          target: connectionUserId,
          owner: authUserId,
        },
        connectionPopulate,
      );

      connection.isBlocked = updateConnectionDto.isBlocked;

      this.userConnectionRepository.persist(connection);
      await this.userConnectionRepository.flush();

      if (updateConnectionDto.isBlocked) {
        await this.notificationsService.create(
          connection.target.id,
          {
            alias: NotificationAlias.CONNECTION_BLOCK,
            subject: NotificationSubject.connectionBlock,
            content: `com ${connection.owner.username}`,
            jsonData: { ...connection },
          },
          true,
          true,
          false,
          undefined,
        );
      } else {
        await this.notificationsService.create(
          connection.target.id,
          {
            alias: NotificationAlias.CONNECTION_UNBLOCK,
            subject: NotificationSubject.connectionUnblock,
            content: `com ${connection.owner.username}`,
            jsonData: { ...connection },
          },
          true,
          true,
          false,
          undefined,
        );
      }

      return connection;
    } catch (error) {
      throw new HttpException('Error on updade this connection.', 400);
    }
  }

  async delete(authUserId: number, userId: number) {
    try {
      const connection = await this.userConnectionRepository.findOne({
        owner: userId,
        target: authUserId,
      });

      const connectionReverse = await this.userConnectionRepository.findOne({
        owner: authUserId,
        target: connection.owner.id,
      });

      if (connectionReverse) {
        await this.userConnectionRepository.removeAndFlush(connectionReverse);
      }

      await this.userConnectionRepository.removeAndFlush(connection);
    } catch (error) {
      throw new HttpException('Error delete this connection.', 400);
    }
  }
}
