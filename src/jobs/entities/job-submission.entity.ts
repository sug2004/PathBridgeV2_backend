/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { JobAssignment } from './job-assignment.entity';

export enum SubmissionStatus {
  SUBMITTED = 'SUBMITTED',
  REVIEWED = 'REVIEWED',
  REFERRED = 'REFERRED',
  REJECTED = 'REJECTED',
}

@Entity('job_submissions')
@Unique(['assignmentId', 'studentId'])
export class JobSubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  assignmentId: string;

  @Column()
  studentId: string;

  @Column({ type: 'text', nullable: true })
  submissionText?: string;

  @Column({ nullable: true })
  attachmentUrl?: string;

  @Column({
    type: 'enum',
    enum: SubmissionStatus,
    default: SubmissionStatus.SUBMITTED,
  })
  status: SubmissionStatus;

  @Column({ nullable: true })
  reviewNotes?: string;

  @Column({ nullable: true })
  referralCompany?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations

  @ManyToOne(() => JobAssignment, (assignment) => assignment.submissions, {
    onDelete: 'CASCADE',
  })
  assignment: JobAssignment;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  student: User;
}
