import { EntityRepository } from '@mikro-orm/knex';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateDirectMessageDto } from './dto/create-message.dto';
import { DirectMessage } from './entities/direct-message.entity';

@Injectable()
export class DirectMessagesService {
  constructor(
    @InjectRepository(DirectMessage)
    private directMessageRepository: EntityRepository<DirectMessage>,
    @Inject(UsersService)
    private usersService: UsersService,
  ) {}

  async findReceived(authUser: number, offset = 1, limit = 10) {
    const last = (offset - 1) * limit;
    try {
      return this.directMessageRepository.find(
        { receiver: authUser },
        ['sender.profile.file', 'file'],
        undefined,
        limit,
        last,
      );
    } catch (error) {
      throw new HttpException("can't find messages", 404);
    }
  }

  async create(
    authUser: number,
    receiverId: number,
    createDirectMessageDto: CreateDirectMessageDto,
  ) {
    try {
      const sender = await this.usersService.findOne({ id: authUser });
      const receiver = await this.usersService.findOne({ id: receiverId });
      const newMessage = new DirectMessage({
        sender: 'id' in sender && sender,
        ...createDirectMessageDto,
        receiver: 'id' in receiver && receiver,
      });

      await this.directMessageRepository.persistAndFlush(newMessage);

      return newMessage;
    } catch (error) {
      throw new HttpException('error on send message', 400);
    }
  }

  async findOne(id: number) {
    try {
      return this.directMessageRepository.findOneOrFail({ id }, [
        'sender.profile.file',
        'file',
      ]);
    } catch (error) {
      throw new HttpException("can't find this message", 404);
    }
  }

  async conversation(authUserId: number, receiverId: number) {
    try {
      const directMessages = await this.directMessageRepository.find(
        {
          $or: [
            { sender: receiverId, receiver: authUserId },
            { sender: authUserId, receiver: receiverId },
          ],
        },
        ['sender.profile.file', 'receiver.profile.file', 'file'],
        { createdAt: -1 },
      );

      directMessages.forEach((message) => {
        if (message.receiver.id === authUserId) {
          message.readed = true;

          this.directMessageRepository.persist(message);
        }
      });

      await this.directMessageRepository.flush();

      return directMessages;
    } catch (error) {
      throw new HttpException("can't find this message", 404);
    }
  }
}
