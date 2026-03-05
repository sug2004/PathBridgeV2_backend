import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { Post } from '../../post/entities/post.entity';
import { Comment } from '../../post/entities/comment.entity';
import { Like } from '../../post/entities/like.entity';
import { Follow } from '../../post/entities/follow.entity';
import { Notification } from '../../notification/entities/notification.entity';

export enum UserRole {
  STUDENT = 'STUDENT',
  ALUMNI = 'ALUMNI',
}

export enum MentorshipStatus {
  NONE = 'NONE',
  SEEKING_MENTOR = 'SEEKING_MENTOR',
  OPEN_TO_MENTOR = 'OPEN_TO_MENTOR',
  MENTORING = 'MENTORING',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'text', nullable: true })
  image?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @Column({ nullable: true })
  institution?: string;

  @Column({ nullable: true })
  degree?: string;

  @Column({ nullable: true })
  department?: string;

  @Column({ nullable: true })
  yearOfStudy?: string;

  @Column({ type: 'int', nullable: true })
  graduationYear?: number;

  @Column({ nullable: true })
  currentPosition?: string;

  @Column({ nullable: true })
  currentOrganization?: string;

  @Column({ type: 'jsonb', nullable: true })
  workExperience?: any;

  @Column({ type: 'jsonb', nullable: true })
  certifications?: any;

  @Column({ type: 'jsonb', nullable: true })
  skills?: any;

  @Column({ type: 'jsonb', nullable: true })
  interests?: any;

  @Column({ type: 'jsonb', nullable: true })
  projects?: any;

  @Column({ type: 'jsonb', nullable: true })
  achievements?: any;

  @Column({ nullable: true })
  resumeUrl?: string;

  @Column({ nullable: true })
  linkedinUrl?: string;

  @Column({ nullable: true })
  githubUrl?: string;

  @Column({ nullable: true })
  portfolioUrl?: string;

  @Column({
    type: 'enum',
    enum: MentorshipStatus,
    default: MentorshipStatus.NONE,
  })
  mentorshipStatus: MentorshipStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /*
  =========================
  RELATIONS
  =========================
  */

  // User posts
  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  // User comments
  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  // Likes by user
  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  // Users following this user
  @OneToMany(() => Follow, (follow) => follow.following)
  followers: Follow[];

  // Users this user follows
  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[];

  // Notifications received
  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  // Notifications created by this user
  @OneToMany(() => Notification, (notification) => notification.creator)
  notificationsCreated: Notification[];
}
