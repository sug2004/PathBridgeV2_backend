import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';
import { Follow } from './entities/follow.entity';
import { Notification } from 'src/notification/entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Comment, Like, Follow, Notification]),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
