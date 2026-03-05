/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private userServce: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async profile(@Req() req: any) {
    const user = await this.userServce.findUserByEmail(req.user.email);
    if (!user) {
      throw new Error('User not found');
    }
    return { email: user.email, user };
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(@Req() req: any, @Body() updateData: any) {
    const updatedUser = await this.userServce.updateUserById(
        req.user.id,
        updateData,
      );
      return updatedUser;
  }

  @Post('/follow/:targetId')
  @UseGuards(AuthGuard('jwt'))
  async toggleFollow(@Req() req: any, @Param('targetId') targetId: string) {
    const result = await this.userServce.toggleFollow(req.user.id, targetId);
    return result;
  }

  @Get('/posts')
  @UseGuards(AuthGuard('jwt'))
  async getUserPosts(@Req() req: any) {
    const posts = await this.userServce.getUserPosts(req.user.id);
    return posts;
  }

  @Get('/likedPosts')
  @UseGuards(AuthGuard('jwt'))
  async getUserLikedPosts(@Req() req: any) {
    const posts = await this.userServce.getUserLikedPosts(req.user.id);
    return posts;
  }

  @Get('/isFollowing/:targetId')
  @UseGuards(AuthGuard('jwt'))
  async isFollowing(@Req() req: any, @Param('targetId') targetId: string) {
    const isFollowing = await this.userServce.isFollowing(
      req.user.id,
      targetId,
    );
    return { following: isFollowing };
  }

}
