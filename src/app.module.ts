import { Module } from '@nestjs/common';
import { ChatGateway } from './chat/chat.gateway';
import { AlertGateway } from './alert/alert.gateway';
import { AlertController } from './alert/alert.controller';
import { TestGateway } from './test.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: []
  // providers: [ChatGateway, AlertGateway, TestGateway],
})
export class AppModule {}
