/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create.post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { Comment } from './entities/comment.entity';
import {
  Notification,
  NotificationType,
} from 'src/notification/entities/notification.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(Like) private readonly likeRepository: Repository<Like>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async createPost(userId: string, createPostDto: CreatePostDto) {
    try {
      const post = this.postRepository.create({
        ...createPostDto,
        authorId: userId,
      });
      return await this.postRepository.save(post);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getPosts() {
    const posts = await this.postRepository.find({
      relations: ['author', 'comments', 'comments.author', 'likes'],
      select: {
        id: true,
        content: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        author: {
          id: true,
          firstName: true,
          image: true,
          email: true,
        },
        comments: {
          id: true,
          content: true,
          createdAt: true,
          author: {
            id: true,
            email: true,
            image: true,
            firstName: true,
          },
        },
        likes: {
          userId: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
    if (!posts) {
      return { message: 'No posts found' };
    }
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
  }

  // async toggleLike(postId: string, userId: string) {
  //   try {
  //     const deleteResult = await this.likeRepository.delete({ postId, userId });

  //     if (deleteResult.affected) {
  //       return { message: 'Unliked successfully' };
  //     }

  //     const [, post] = await Promise.all([
  //       this.likeRepository.insert({ postId, userId }),
  //       this.postRepository.findOne({
  //         where: { id: postId },
  //         select: { authorId: true },
  //       }),
  //     ]);

  //     if (!post) {
  //       throw new Error('Post not found');
  //     }

  //     if (post.authorId !== userId) {
  //       this.notificationRepository.insert({
  //         type: NotificationType.LIKE,
  //         postId,
  //         userId: post.authorId,
  //         creatorId: userId,
  //       }).catch(err => console.error('Notification error:', err));
  //     }

  //     return { message: 'Liked successfully' };
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // }

  async toggleLike(postId: string, userId: string) {
    try {
      const deleteResult = await this.likeRepository.delete({ postId, userId });

      if (deleteResult.affected) {
        return { message: 'Unliked successfully' };
      }

      // Parallel execution: insert like and get post author
      const [, post] = await Promise.all([
        this.likeRepository.insert({ postId, userId }),
        this.postRepository.findOne({
          where: { id: postId },
          select: { authorId: true },
        }),
      ]);

      if (!post) {
        throw new Error('Post not found');
      }

      // Fire and forget notification (don't await)
      if (post.authorId !== userId) {
        this.notificationRepository
          .insert({
            type: NotificationType.LIKE,
            postId,
            userId: post.authorId,
            creatorId: userId,
          })
          .catch((err) => console.error('Notification error:', err));
      }

      return { message: 'Liked successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createComment(postId: string, userId: string, content: string) {
    if (!content.trim()) {
      throw new Error('Content cannot be empty');
    }

    const post = await this.postRepository.findOne({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    const comment = this.commentRepository.create({
      content,
      authorId: userId,
      postId,
    });

    await this.commentRepository.save(comment);

    if (post.authorId !== userId) {
      this.notificationRepository
        .insert({
          type: NotificationType.COMMENT,
          userId: post.authorId,
          creatorId: userId,
          postId,
          commentId: comment.id,
        })
        .catch((err) => console.error('Notification error:', err));
    }

    return comment;
  }

  async deletePost(postId: string, userId: string) {
    try{
      const post = await this.postRepository.findOne({ where: { id: postId } });
      if (!post) {
        throw new Error('Post not found');
      }
      if (post.authorId !== userId) {
        throw new Error('Unauthorized');
      }
      await this.postRepository.delete({ id: postId });
      return { message: 'Post deleted successfully' };
    }catch(error){
      throw new Error(error.message);
    }
  }
}
