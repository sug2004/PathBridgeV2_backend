/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import {
  Notification,
  NotificationType,
} from 'src/notification/entities/notification.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly MessageRepo: Repository<Message>,
    @InjectRepository(Notification)
    private readonly NotificationRepo: Repository<Notification>,
  ) {}

  async sendMessage(userId: string, receiverId: string, content: string) {
    try {
      if (!userId) throw new Error('Unauthorised');
      const message = this.MessageRepo.create({
        content,
        senderId: userId,
        receiverId,
      });
      await this.MessageRepo.save(message);

      await this.NotificationRepo.save(
        this.NotificationRepo.create({
          userId: receiverId,
          creatorId: userId,
          type: NotificationType.MESSAGE,
        }),
      );

      return await this.MessageRepo.findOne({
        where: { id: message.id },
        relations: ['sender'],
        select: {
          id: true,
          content: true,
          senderId: true,
          receiverId: true,
          createdAt: true,
          read: true,
          sender: {
            id: true,
            firstName: true,
            email: true,
          },
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async getMessages(userId: string, otherUserId: string) {
    try {
      await this.MessageRepo.update(
        { receiverId: userId, read: false },
        { read: true },
      );

      return await this.MessageRepo.find({
        where: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
        relations: ['sender'],
        select: {
          id: true,
          content: true,
          senderId: true,
          receiverId: true,
          createdAt: true,
          read: true,
          sender: {
            id: true,
            firstName: true,
            email: true,
            image: true,
          },
        },
        order: { createdAt: 'ASC' },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  
}
