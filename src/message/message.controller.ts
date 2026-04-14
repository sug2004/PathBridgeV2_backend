/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('send/:receiverId')
  @UseGuards(AuthGuard('jwt'))
  async sendMessage(
    @Req() req: { user: { id: string } },
    @Param('receiverId') receiverId: string,
    @Body() body: { content: string },
  ) {
    return await this.messageService.sendMessage(
        req.user.id,
        receiverId,
        body.content
    );
  }

  @Get('get/:otherUserId')
  @UseGuards(AuthGuard('jwt'))
  async getMessages(
    @Req() req:{user:{id:string}},
    @Param('otherUserId') otherUserId: string,
  ){
    return await this.messageService.getMessages(
        req.user.id,
        otherUserId
    )
  }
}
