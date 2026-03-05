/* eslint-disable prettier/prettier */

import {
  Entity,
  ManyToOne,
  CreateDateColumn,
  PrimaryColumn,
  Index,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity()
@Index(['followerId', 'followingId'])
export class Follow {
  @PrimaryColumn()
  followerId: string;

  @PrimaryColumn()
  followingId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.following, {
    onDelete: 'CASCADE',
  })
  follower: User;

  @ManyToOne(() => User, (user) => user.followers, {
    onDelete: 'CASCADE',
  })
  following: User;
}
