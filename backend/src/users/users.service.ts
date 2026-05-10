import { BadRequestException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto, UpdateProfileDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  me(id: string) { return this.prisma.user.findUnique({ where: { id }, select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true, addresses: true } }); }
  updateMe(id: string, dto: UpdateProfileDto) { return this.prisma.user.update({ where: { id }, data: dto, select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true } }); }
  async changePassword(id: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id } });
    if (!(await argon2.verify(user.passwordHash, dto.currentPassword))) throw new BadRequestException('Current password is incorrect');
    await this.prisma.user.update({ where: { id }, data: { passwordHash: await argon2.hash(dto.newPassword), refreshTokenHash: null } });
    return { message: 'Password changed successfully' };
  }
}
