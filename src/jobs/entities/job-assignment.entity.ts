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

import { User } from 'src/users/entities/user.entity';
import { JobSubmission } from './job-submission.entity';

@Entity('job_assignments')
export class JobAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  deadline: Date;

  @Column()
  assignmentType: string;

  @Column({ type: 'jsonb', nullable: true })
  skillsRequired?: any;

  @Column({ nullable: true })
  attachmentUrl?: string;

  @Column()
  createdById: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  createdBy: User;

  @OneToMany(() => JobSubmission, (submission) => submission.assignment)
  submissions: JobSubmission[];
}
