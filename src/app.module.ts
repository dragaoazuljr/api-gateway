import { Module } from '@nestjs/common';
import { CategoriasModule } from './categorias/categorias.module';
import { ClientProxyModule } from './client-proxy/client-proxy.module';
import { JogadoresModule } from './jogadores/jogadores.module';

@Module({
  imports: [CategoriasModule, ClientProxyModule, JogadoresModule],
  providers: [],
})
export class AppModule {}
