import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PostModule } from './post/post.module';
import { NotificationModule } from './notification/notification.module';
import { MessageModule } from './message/message.module';
import { MeetingModule } from './meeting/meeting.module';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration available globally
      envFilePath: '.env', // Path to your .env file
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        // return {
        //   type: 'postgres',
        //   url: config.get<string>('DATABASE_URL'),
        //   autoLoadEntities: true,
        //   synchronize: true,
        //   ssl: { rejectUnauthorized: false },
        // };
        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST'),
          port: +(config.get<number>('DB_PORT') ?? 5432),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_DATABASE'),
          autoLoadEntities: true,
          synchronize: true, // Set to false in production
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    PostModule,
    NotificationModule,
    MessageModule,
    MeetingModule,
    JobsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
