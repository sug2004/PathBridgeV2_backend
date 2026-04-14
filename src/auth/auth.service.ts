import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  async socialLogin(userData: {
    email: string;
    firstName: string;
    lastName: string;
    provider: string;
  }) {
    let user = await this.usersService.findUserByEmail(userData.email);
    if (!user) {
      user = await this.usersService.createSocialUser({
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: '',
      });
    }
    return this.jwtService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  }

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService, // Assuming you have JwtService injected for token generation
  ) {}
  async register(createUserDTO: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDTO.password, 10);
    createUserDTO.password = hashedPassword;

    const user = await this.usersService.createUser(createUserDTO);
    return this.jwtService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  }

  async login(loginDTO: LoginDTO) {
    const user = await this.usersService.findUserByEmail(loginDTO.email);
    if (!user || !(await bcrypt.compare(loginDTO.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.jwtService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  }
}
