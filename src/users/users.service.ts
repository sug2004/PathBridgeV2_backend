import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import {
  CreateUserDto,
  CreateSocialUserDto,
} from 'src/auth/dto/create-user.dto';
import { Repository } from 'typeorm';
import { Follow } from 'src/post/entities/follow.entity';
import { Post } from 'src/post/entities/post.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  async createUser(data: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(data);
    return await this.userRepository.save(newUser);
  }

  async createSocialUser(data: CreateSocialUserDto): Promise<User> {
    const newUser = this.userRepository.create(data);
    return await this.userRepository.save(newUser);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async updateUserById(id: string, data: any) {
    console.log('Update User - ID:', id);
    console.log('Update User - Data:', data);
    if (!data || Object.keys(data).length === 0) {
      return this.findUserById(id);
    }
    const user = await this.findUserById(id);
    console.log('Found User:', user);
    if (!user) {
      throw new Error('User not found');
    }
    Object.assign(user, data);
    const updated = await this.userRepository.save(user);
    console.log('Updated User:', updated);
    return updated;
  }

  async toggleFollow(targetId: string, id: string) {
    try {
      if (id === targetId) {
        throw new Error("You can't follow yourself");
      }

      const result = await this.followRepository.delete({
        followerId: id,
        followingId: targetId,
      });

      if (result.affected) {
        return { message: 'Unfollowed successfully' };
      }

      await this.followRepository.insert({
        followerId: id,
        followingId: targetId,
      });

      return { message: 'Followed successfully' };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUserPosts(userId: string) {
    try {
      const posts = await this.postRepository.find({
        where: { authorId: userId },
        relations: ['author', 'comments', 'comments.author', 'likes'],
        order: { createdAt: 'DESC' },
      });
      if (!posts) return { message: "User doesn't have any posts" };
      return posts.map((post) => ({
        ...post,
        _count: {
          likes: post.likes?.length || 0,
          comments: post.comments?.length || 0,
        },
        comments: post.comments?.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ),
      }));
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUserLikedPosts(userId: string) {
    try {
      const posts = await this.postRepository.find({
        relations: ['author', 'comments', 'comments.author', 'likes'],
        order: { createdAt: 'DESC' },
      });
      if (!posts) return { message: "User doesn't have any posts" };

      const likedPosts = posts.filter((post) =>
        post.likes.some((like) => like.userId === userId),
      );

      return likedPosts.map((post) => ({
        ...post,
        _count: {
          likes: post.likes?.length || 0,
          comments: post.comments?.length || 0,
        },
        comments: post.comments?.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ),
      }));
    } catch (error) {
      throw new Error(error);
    }
  }

  async isFollowing(userId: string, targetId: string) {
    try {
      if (!targetId) return false;
      const follow = await this.followRepository.findOne({
        where: { followerId: userId, followingId: targetId },
      });
      return follow ? true : false;
    } catch (error) {
      throw new Error('Error checking follow status:', error);
    }
  }
}
