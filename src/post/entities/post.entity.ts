/* eslint-disable prettier/prettier */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';
import { Notification } from '../../notification/entities/notification.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  authorId: string;

  @Column({ nullable: true })
  content?: string;

  @Column({ nullable: true })
  image?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // relations

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  author: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @OneToMany(() => Notification, (notification) => notification.post)
  notifications: Notification[];
}
