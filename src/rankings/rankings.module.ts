import { Module } from '@nestjs/common';
import { ClientProxyModule } from 'src/client-proxy/client-proxy.module';
import { RankingsController } from './rankings.controller';

@Module({
  controllers: [RankingsController],
  imports: [ClientProxyModule]
})
export class RankingsModule {}
