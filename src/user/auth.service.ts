import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}
  
  async signup(name: string, email: string, password: string) {
    //See if email is in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('Email is in use');
    }
    // Hash the user password
    // Generate a salt
    const salt = randomBytes(8).toString('hex');
    // Hash the salt and password tigether
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // Join the hased result and the salt together
    const result = salt + '.' + hash.toString('hex');
    // create a new user and seved it
    const user = await this.usersService.create(name, email, result);
    // return the user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('Email not found');
    }
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid password');
    }
    return user;
  }
}
