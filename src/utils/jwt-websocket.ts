import { WsException } from '@nestjs/websockets';

import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';

export function jwtValidateSocketClient(client: Socket) {
  try {
    const authToken: any = client.handshake.headers.authorization;
    if (typeof authToken === 'undefined') {
      client.disconnect();
      throw new WsException('Missing token.');
    }
    const validateToken = jwt.decode(authToken, { json: true });

    if (!validateToken) {
      client.disconnect();
      throw new WsException('Invalid token.');
    }

    client.handshake.query.userId = validateToken.sub;

    return true;
  } catch (error) {
    client.disconnect();
    throw new WsException(error.message);
  }
}
