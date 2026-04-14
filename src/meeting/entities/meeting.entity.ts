/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

import { User } from 'src/users/entities/user.entity';

export enum MeetingStatus {
  REQUESTED = 'REQUESTED',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('meetings')
@Index(['studentId', 'mentorId'])
@Index(['date'])
export class Meeting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  date: Date;

  @Column()
  time: string;

  @Column({
    type: 'enum',
    enum: MeetingStatus,
    default: MeetingStatus.REQUESTED,
  })
  status: MeetingStatus;

  @Column()
  studentId: string;

  @Column()
  mentorId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations

  @ManyToOne(() => User, (user) => user.meetingsAsStudent, {
    onDelete: 'CASCADE',
  })
  student: User;

  @ManyToOne(() => User, (user) => user.meetingsAsMentor, {
    onDelete: 'CASCADE',
  })
  mentor: User;
}
