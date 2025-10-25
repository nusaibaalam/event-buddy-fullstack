import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  create(data: {
    name: string;
    email: string;
    password: string;
    role?: 'USER' | 'ADMIN';
  }) {
    return this.prisma.user.create({
      data: { ...data, role: data.role ?? 'USER' },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
