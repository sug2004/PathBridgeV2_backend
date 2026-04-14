/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateJobAssignmentDTO } from './dto/createJobAssignment.dto';
import { UserRole } from 'src/users/entities/user.entity';
import { SubmissionStatus } from './entities/job-submission.entity';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async createJob(
    @Body() createJobAssignmentDTO: CreateJobAssignmentDTO,
    @Req() req: { user: { id: string } },
  ) {
    return await this.jobsService.createJob(
      createJobAssignmentDTO,
      req.user.id,
    );
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAllJobs(@Req() req: { user: { id: string } }) {
    return await this.jobsService.getAllJobs(req.user.id);
  }

  @Get('mine')
  @UseGuards(AuthGuard('jwt'))
  async getMyJobPosting(@Req() req: { user: { id: string; role: UserRole } }) {
    return await this.jobsService.getMyJobPosting(req.user.id, req.user.role);
  }

  @Post('submitAssignment/:assignmentId')
  @UseGuards(AuthGuard('jwt'))
  async submitAssignment(
    @Req() req: { user: { id: string } },
    @Param('assignmentId') assignmentId: string,
    @Body() submissionText: string,
  ) {
    return await this.jobsService.submitAssignment(
      req.user.id,
      assignmentId,
      submissionText,
    );
  }

  @Get('getAssignmentSubmissions/:assignmentId')
  @UseGuards(AuthGuard('jwt'))
  async getAssignmentSubmissions(
    @Req() req: { user: { id: string; role: UserRole } },
    @Param('assignmentId') assignmentId: string,
  ) {
    return await this.jobsService.getAssignmentSubmissions(
      req.user.id,
      req.user.role,
      assignmentId,
    );
  }

  @Put('updateSubmissionStatus/:submissionId')
  @UseGuards(AuthGuard('jwt'))
  async updateSubmissionStatus(
    @Req() req: { user: { id: string; role: UserRole } },
    @Param('submissionId') submissionId: string,
    @Body()
    body: {
      status: SubmissionStatus;
      reviewNotes: string;
      referralCompany: string;
    },
  ) {
    return await this.jobsService.updateSubmissionStatus(
      req.user.id,
      req.user.role,
      submissionId,
      body.status,
      body.reviewNotes,
      body.referralCompany,
    );
  }
}
