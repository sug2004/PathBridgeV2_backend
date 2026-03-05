/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  @InjectRepository(Notification)
  private readonly notificationRepository: Repository<Notification>;

  async getNotifications(userId: string) {
    try {
      const notifications = await this.notificationRepository.find({
        where: { userId },
        relations: ['user', 'creator', 'post', 'comment'],
      });
      if (!notifications) return { message: 'no notification' };
      return notifications;
    } catch (error) {
      throw new Error(error);
    }
  }

  async markNotificationsAsRead(userId: string, notificationId: string) {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.read = true;
    await this.notificationRepository.save(notification);
    
    return { message: 'Notification marked as read' };
  }
}
