import { Module } from '@nestjs/common';
import { MeetingController } from './meeting.controller';
import { MeetingService } from './meeting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Meeting } from './entities/meeting.entity';
import { Message } from 'src/message/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Meeting, Message])],
  controllers: [MeetingController],
  providers: [MeetingService],
})
export class MeetingModule {}
