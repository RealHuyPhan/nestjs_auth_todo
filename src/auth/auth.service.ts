import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    // src/auth/auth.service.ts

    async register(registerDto: RegisterDto) {
        const { email, password, name } = registerDto;
        const normalizedEmail = email.toLowerCase().trim();

        const userExists = await this.usersService.findByEmail(normalizedEmail);
        if (userExists) {
            throw new BadRequestException('Email has been used');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await this.usersService.createUser({
            email: normalizedEmail,
            password: hashedPassword,
            name,
        });

        return { message: 'User created successfully' };
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        const normalizedEmail = email.toLowerCase().trim();
        const user = await this.usersService.findByEmail(normalizedEmail);

        if (!user) {
            throw new UnauthorizedException('Email or password invalid');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Email or password invalid');
        }

        const payload = { sub: user._id.toString(), email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
            },
        };
    }

}