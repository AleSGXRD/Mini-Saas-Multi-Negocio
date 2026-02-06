import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { clerkClient } from '@clerk/clerk-sdk-node';

@Injectable()
export class AuthService {
  /**
   *
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findUser(clerkId: string) {
    return clerkClient.users.getUser(clerkId);
  }

  async findOrCreate(data: { clerkId: string; email: string; name?: any }) {
    let user = await this.userRepository.findOne({
      where: { clerkId: data.clerkId },
    });

    if (!user) {
      const clerkUser = await this.findUser(data.clerkId);
      const createUser = {
        email: clerkUser.emailAddresses[0]?.emailAddress,
        name: clerkUser.firstName,
        clerkId: data.clerkId,
      };

      user = this.userRepository.create(createUser);
      await this.userRepository.save(user);
    }

    return user;
  }
}
