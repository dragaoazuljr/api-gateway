import { Module } from '@nestjs/common';
import { ClientProxyModule } from 'src/client-proxy/client-proxy.module';
import { CategoriasController } from './categorias.controller';

@Module({
  controllers: [CategoriasController],
  imports: [ClientProxyModule]
})
export class CategoriasModule {}
