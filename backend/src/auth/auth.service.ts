import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // valida se existe usuário
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const { passwordHash, ...result } = user;

      return result;
    }
    return null;
  }

  // gera token JWT
  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.userRole,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }
}
