import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { JWTEncryptedData } from './auth.service';

import { jwtOptions } from '../../config';

export type JwtStrategyValidateResponse = {
  userId: number;
  username: string;
  role: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtOptions.secret,
    });
  }

  async validate(
    payload: JWTEncryptedData,
  ): Promise<JwtStrategyValidateResponse> {
    // decrypt jwt user info
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
