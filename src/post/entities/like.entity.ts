/* eslint-disable prettier/prettier */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
  Index,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Post } from './post.entity';

@Entity()
@Unique(['userId', 'postId'])
@Index(['userId', 'postId'])
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  postId: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.likes, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Post, (post) => post.likes, {
    onDelete: 'CASCADE',
  })
  post: Post;
}
