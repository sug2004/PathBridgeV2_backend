/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateJobAssignmentDTO } from './dto/createJobAssignment.dto';
import { UsersService } from 'src/users/users.service';
import { UserRole } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JobAssignment } from './entities/job-assignment.entity';
import { Repository } from 'typeorm';
import {
  JobSubmission,
  SubmissionStatus,
} from './entities/job-submission.entity';
import { Message } from 'src/message/entities/message.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(JobAssignment)
    private readonly JobAssignmentRepo: Repository<JobAssignment>,
    @InjectRepository(JobSubmission)
    private readonly JobSubmissionRepo: Repository<JobSubmission>,
    private readonly userService: UsersService,
    @InjectRepository(Message)
    private readonly MessageRepo: Repository<Message>,
  ) {}

  async createJob(
    createJobAssignmentDto: CreateJobAssignmentDTO,
    userId: string,
  ) {
    try {
      const user = await this.userService.findUserById(userId);
      if (!user || user.role !== UserRole.ALUMNI) {
        throw new Error('Unauthorized');
      }
      const assignment = this.JobAssignmentRepo.create({
        ...createJobAssignmentDto,
        createdById: userId,
      });
      await this.JobAssignmentRepo.save(assignment);

      return { message: 'Job assignment created successfully' };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllJobs(userId: string) {
    try {
      if (!userId) throw new Error('Unauthorised');
      const assignments = await this.JobAssignmentRepo.find({
        relations: ['createdBy', 'submissions'],
        order: { createdAt: 'DESC' },
      });

      return assignments.map((assignment) => ({
        ...assignment,
        _count: {
          submissions: assignment.submissions?.length || 0,
        },
        isOwner: userId === assignment.createdById,
      }));
    } catch (error) {
      throw new Error(error);
    }
  }

  async getMyJobPosting(userId: string, role: UserRole) {
    try {
      if (!userId || role !== UserRole.ALUMNI) throw new Error('Unauthorised');
      const assignments = await this.JobAssignmentRepo.find({
        where: { createdById: userId },
        relations: ['createdBy', 'submissions'],
        order: { createdAt: 'DESC' },
      });

      return assignments.map((assignment) => ({
        ...assignment,
        _count: {
          submissions: assignment.submissions?.length || 0,
        },
        isOwner: userId === assignment.createdById,
      }));
    } catch (error) {
      throw new Error(error);
    }
  }

  async submitAssignment(
    userId: string,
    assignmentId: string,
    submissionText: string,
  ) {
    try {
      if (!userId) throw new Error('Unauthorised');

      const existingSubmission = await this.JobSubmissionRepo.findOne({
        where: {
          assignmentId,
          studentId: userId,
        },
      });

      if (existingSubmission) {
        throw new Error('You have already submitted this assignment');
      }

      const submission = this.JobSubmissionRepo.create({
        assignmentId,
        studentId: userId,
        submissionText,
      });

      await this.JobSubmissionRepo.save(submission);
      return { message: 'Assignment submitted successfully' };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAssignmentSubmissions(
    userId: string,
    role: UserRole,
    assignmentId: string,
  ) {
    try {
      if (!userId || role !== UserRole.ALUMNI) throw new Error('Unauthorised');

      const submissions = await this.JobSubmissionRepo.find({
        where: {
          assignmentId,
          assignment: {
            createdById: userId,
          },
        },
        relations: ['student', 'assignment'],
      });

      return {
        totalSubmissions: submissions?.length || 0,
        submissions: submissions.map((submission) => ({
          student: {
            submission_id:submission.id,
            id: submission.student?.id,
            firstName: submission.student?.firstName,
            email: submission.student?.email,
            submissionText: submission?.submissionText,
          },
        })),
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateSubmissionStatus(
    userId: string,
    role: UserRole,
    submissionId: string,
    status: SubmissionStatus,
    reviewNotes: string,
    referralCompany: string,
  ) {
    try {
      if (!userId || role !== UserRole.ALUMNI) throw new Error('Unauthorised');

      const submission = await this.JobSubmissionRepo.findOne({
        where: { id: submissionId },
        relations: ['assignment'],
      });

      if (!submission) throw new Error('Submission not found');

      submission.status = status;
      submission.reviewNotes = reviewNotes;
      submission.referralCompany = referralCompany;

      await this.JobSubmissionRepo.save(submission);

      if (
        status === SubmissionStatus.REFERRED &&
        referralCompany &&
        reviewNotes
      ) {
        const congratsMessage = `🎉 Congratulations! You have been referred to ${referralCompany} based on your excellent performance in the "${submission.assignment.title}" assignment.\n\nReferral Notes: ${reviewNotes}\n\nBest of luck with your application!`;

        await this.MessageRepo.save(
          this.MessageRepo.create({
            content: congratsMessage,
            senderId: userId,
            receiverId: submission.studentId,
          }),
        );
      }
      return { message: 'Submission status updated successfully' };
    } catch (error) {
      throw new Error(error);
    }
  }
}
