import { Module } from '@nestjs/common';
import { CategoriasModule } from './categorias/categorias.module';
import { ClientProxyModule } from './client-proxy/client-proxy.module';
import { JogadoresModule } from './jogadores/jogadores.module';
import { AwsModule } from './aws/aws.module';
import { ConfigModule } from '@nestjs/config';
import { DesafiosModule } from './desafios/desafios.module';
import { RankingsModule } from './rankings/rankings.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    CategoriasModule,
    ClientProxyModule, 
    JogadoresModule, 
    AwsModule,
    ConfigModule.forRoot({isGlobal: true}),
    DesafiosModule,
    RankingsModule,
    AuthModule
  ],
  providers: [],
})
export class AppModule {}
