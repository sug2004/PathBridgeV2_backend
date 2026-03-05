import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { Follow } from 'src/post/entities/follow.entity';
import { Post } from 'src/post/entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Follow, Post])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
