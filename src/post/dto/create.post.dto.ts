/* eslint-disable prettier/prettier */
import { IsString, IsOptional } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  image?: string;
}
