import { Module } from '@nestjs/common';
import { AwsModule } from 'src/aws/aws.module';
import { ClientProxyModule } from 'src/client-proxy/client-proxy.module';
import { JogadoresController } from './jogadores.controller';

@Module({
  controllers: [JogadoresController],
  imports: [
    ClientProxyModule,
    AwsModule
  ]
})
export class JogadoresModule {}
