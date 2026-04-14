/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Post } from '../../post/entities/post.entity';
import { Comment } from '../../post/entities/comment.entity';

export enum NotificationType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  FOLLOW = 'FOLLOW',
  MESSAGE = 'MESSAGE',
}

@Entity()
@Index(['userId', 'createdAt'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  creatorId: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({ default: false })
  read: boolean;

  @Column({ nullable: true })
  postId?: string;

  @Column({ nullable: true })
  commentId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.notifications, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => User, (user) => user.notificationsCreated, {
    onDelete: 'CASCADE',
  })
  creator: User;

  @ManyToOne(() => Post, (post) => post.notifications, {
    onDelete: 'CASCADE',
  })
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.notifications, {
    onDelete: 'CASCADE',
  })
  comment: Comment;
}
