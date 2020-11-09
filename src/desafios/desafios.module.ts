import { Module } from '@nestjs/common';
import { ClientProxyModule } from 'src/client-proxy/client-proxy.module';
import { DesafiosController } from './desafios.controller';

@Module({
  controllers: [DesafiosController],
  imports: [ClientProxyModule]
})
export class DesafiosModule {}
