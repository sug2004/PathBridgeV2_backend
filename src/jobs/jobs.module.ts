import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JobAssignment } from './entities/job-assignment.entity';
import { JobSubmission } from './entities/job-submission.entity';
import { UsersModule } from 'src/users/users.module';
import { Message } from 'src/message/entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, JobAssignment, JobSubmission, Message]),
    UsersModule,
  ],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
