import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import crypto from 'node:crypto';
import { User } from '@prisma/client';

export type JwtPayload = {
  sub: string;
  role: 'USER' | 'ADMIN';
  name: string;
  email: string;
  iss?: string;
  aud?: string;
  jti?: string;
};

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async hashPassword(plain: string) {
    return bcrypt.hash(plain, 10);
  }

  async validateUser(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  signAccessToken(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      iss: 'event-buddy.api',
      aud: 'event-buddy.frontend',
      jti: crypto.randomUUID(),
    };
    return this.jwt.sign(payload); // exp configured in JwtModule
  }
}
