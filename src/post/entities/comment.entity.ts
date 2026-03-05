/* eslint-disable prettier/prettier */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Post } from './post.entity';
import { Notification } from '../../notification/entities/notification.entity';

@Entity()
@Index(['authorId', 'postId'])
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column()
  authorId: string;

  @Column()
  postId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  author: User;

  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: 'CASCADE',
  })
  post: Post;

  @OneToMany(() => Notification, (notification) => notification.comment)
  notifications: Notification[];
}
