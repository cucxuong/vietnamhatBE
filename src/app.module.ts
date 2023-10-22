import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminModule } from './modules/admin/admin.module';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { TeamsModule } from './modules/admin/teams/teams.module';
import { PlayersModule } from './modules/admin/players/players.module';
import { TournamentsModule } from './modules/admin/tournaments/tournaments.module';
import { UsersModule } from './modules/admin/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    // User defind Modules
    AdminModule,
    AuthModule,
    RouterModule.register([
      {
        path: '/admin',
        module: AdminModule,
        children: [PlayersModule, TeamsModule, TournamentsModule, UsersModule],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
