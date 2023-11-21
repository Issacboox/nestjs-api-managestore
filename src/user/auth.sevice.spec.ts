import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Serialize } from 'src/interceptor/serialize.interceptor';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const fakeUserService: Partial<UserService> = {
      find: () => Promise.resolve([]),
      create: (name: string, email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('can create an instance of auth sevice', async () => {
    //Create a fake copy of the user service
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hased password', async () => {
    const users = await service.signup('', 'maruko@gmail.com', 'nura0024');

    expect(users.password).not.toEqual('nura0024');
    const [salt, hash] = users.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUserService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
    await expect(service.signup('', 'maruko@gmail.com', 'nura0024')).rejects.toThrow(
      BadRequestException,
    );
  });
});
