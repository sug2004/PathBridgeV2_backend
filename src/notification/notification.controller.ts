/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getNotifications(@Req() req: any) {
    return this.notificationService.getNotifications(req.user.id);
  }

  @Patch('markAsRead/:id')
  @UseGuards(AuthGuard('jwt'))
  async markAsRead(@Req() req: any, @Param('id') id: string) {
    return this.notificationService.markNotificationsAsRead(req.user.id, id);
  }
}
