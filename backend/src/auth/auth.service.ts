import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService, // ✅ Doğru şekilde enjekte edildi!
  ) {}

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { id: user.id, email: user.email };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return { accessToken: token };
  }
  async register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10); 
    const newUser = this.userRepository.create({ email, password: hashedPassword });
    await this.userRepository.save(newUser);
    return { message: 'User registered successfully' };
  }
  async getUserWithTasks(userId:number){
    return this.userRepository.findOne({
      where:{
        id:userId
      },
      relations: ['tasks'],
    });
  }

}
