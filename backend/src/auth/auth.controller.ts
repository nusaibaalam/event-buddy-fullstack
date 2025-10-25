import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ConflictException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private auth: AuthService,
    private users: UsersService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    // 1️⃣ Check if email already exists
    const existing = await this.users.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    // 2️⃣ Hash password
    const hashed = await this.auth.hashPassword(dto.password);

    // 3️⃣ Create user
    const user = await this.users.create({
      name: dto.name,
      email: dto.email,
      password: hashed,
      role: 'USER',
    });

    // 4️⃣ Issue token
    const accessToken = this.auth.signAccessToken(user);
    return { accessToken };
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.auth.validateUser(dto.email, dto.password);
    const accessToken = this.auth.signAccessToken(user);
    return { accessToken };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: any) {
    return { user };
  }
}
