/* eslint-disable prettier/prettier */
import { IsString, IsDateString, IsOptional, IsArray } from 'class-validator';

export class CreateJobAssignmentDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  deadline: string;

  @IsString()
  assignmentType: string;

  @IsArray()
  @IsString({ each: true })
  skillsRequired: string[];

  @IsOptional()
  @IsString()
  attachmentUrl?: string;
}
