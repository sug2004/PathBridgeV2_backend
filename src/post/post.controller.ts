/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create.post.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async createPost(@Req() req: any, @Body() createPostDto: CreatePostDto) {
    return await this.postService.createPost(req.user.id, createPostDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getPosts() {
    return await this.postService.getPosts();
  }

  @Post('toggleLike/:postId')
  @UseGuards(AuthGuard('jwt'))
  async toggleLike(@Req() req: any, @Param('postId') postId: string) {
    return await this.postService.toggleLike(postId, req.user.id);
  }

  @Post('comment/:postId')
  @UseGuards(AuthGuard('jwt'))
  async createComment(
    @Req() req: any,
    @Param('postId') postId: string,
    @Body() commentData: { content: string },
  ) {
    return await this.postService.createComment(
      postId,
      req.user.id,
      commentData.content,
    );
  }

  @Delete('delete/:postId')
  @UseGuards(AuthGuard('jwt'))
  async deletePost(@Req() req: any, @Param('postId') postId: string) {
    return await this.postService.deletePost(postId, req.user.id);
  }
}
