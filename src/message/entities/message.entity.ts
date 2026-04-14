/* eslint-disable prettier/prettier */
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';



@Entity('messages')
@Index(['senderId', 'receiverId'])
@Index(['createdAt'])
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @Column()
  senderId: string;

  @Column()
  receiverId: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  read: boolean;

  // Relations

  @ManyToOne(() => User, (user) => user.messagesSent, {
    onDelete: 'CASCADE',
  })
  sender: User;

  @ManyToOne(() => User, (user) => user.messagesReceived, {
    onDelete: 'CASCADE',
  })
  receiver: User;
}
