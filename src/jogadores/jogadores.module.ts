import { Module } from '@nestjs/common';
import { ClientProxyModule } from 'src/client-proxy/client-proxy.module';
import { JogadoresController } from './jogadores.controller';

@Module({
  controllers: [JogadoresController],
  imports: [ClientProxyModule]
})
export class JogadoresModule {}
