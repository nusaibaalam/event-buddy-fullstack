import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    // what you return here becomes req.user
    return {
      id: payload.sub,
      role: payload.role,
      name: payload.name,
      email: payload.email,
      iss: payload.iss,
      aud: payload.aud,
      jti: payload.jti,
      iat: payload.iat,
      exp: payload.exp,
    };
  }
}
