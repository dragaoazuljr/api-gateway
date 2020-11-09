import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class ClientProxyService {

  private clientAdminBackend: ClientProxy;

  constructor(
    private readonly _configService: ConfigService
  ){
    this.clientAdminBackend = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [this._configService.get('RABBITMQ_URL')],
          queue: 'admin-backend'
        }
      })
  }

  createProxyFactory(){
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this._configService.get('RABBITMQ_URL')],
        queue: 'admin-desafios'
      }
    })
  }

  createProxyRankings(){
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this._configService.get('RABBITMQ_URL')],
        queue: 'rankings'
      }
    })
  }

  emit(pattern: string, data: any){
    return this.clientAdminBackend.emit(pattern, data)
  }

  send(pattern: string, data: any){
      return this.clientAdminBackend.send(pattern, data)
  }
}
