import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private logger: Logger = new Logger(WsJwtGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      const authToken: any = client.handshake.headers.authorization;
      if (typeof authToken === 'undefined') {
        throw new WsException('Missing token.');
      }
      const validateToken = jwt.decode(authToken, { json: true });

      client.handshake.query.userId = validateToken.sub;

      if (!validateToken) {
        throw new WsException('Invalid token.');
      }

      return true;
    } catch (error) {
      throw new WsException(error.message);
    }
  }
}
