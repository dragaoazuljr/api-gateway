import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class ClientProxyService {

  private clientAdminBackend: ClientProxy;

  constructor(){
    this.clientAdminBackend = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:KMiBwRe8dlKg@52.91.4.62:5672/smartranking'],
          queue: 'admin-backend'
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
