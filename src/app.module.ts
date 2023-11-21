import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './modules/admin/admin.module';
import { ConfigModule } from './modules/common/config/config.module';
import { ConfigService } from './modules/common/config/config.service';
import { MailModule } from './modules/common/mail/mail.module';
import { GuestModule } from './modules/guest/guest.module';
import { SchedulerModule } from './modules/task-schedule/sheduler.module';
// import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get().database.url,
      }),
      inject: [ConfigService],
    }),

    // User Global Define
    SchedulerModule,
    MailModule,

    // User define Modules
    AdminModule,
    GuestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  onModuleInit(): any {
    mongoose.set('debug', true);
  }
}
