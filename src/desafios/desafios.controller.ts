import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxyService } from 'src/client-proxy/client-proxy.service';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Desafio, DesafioStatus } from './interface/desafio.interface';
import { Partida } from './interface/partidas.interface';

@Controller('api/v1/desafios')
export class DesafiosController {

    private clientDesafios = this._clientProxyService.createProxyFactory();

    constructor(
        private readonly _clientProxyService: ClientProxyService
    ) { }

    @Post()
    @UsePipes(ValidationPipe)
    async cadastrarDesafio(
        @Body() criarDesafioDto: CriarDesafioDto) {

        let categoriaEncontrada = await this._clientProxyService.send('consultar-categorias', criarDesafioDto.categoria).toPromise();

        if (!categoriaEncontrada) {
            throw new BadRequestException(`categoria ${criarDesafioDto.categoria} não cadastrado na ferramenta`);
        }
        
        const jogadores: Jogador[] = await this._clientProxyService.send('consultar-jogador', '').toPromise();
        
        criarDesafioDto.jogadores.map(jogadorDto => {
            const jogadorEncontrado = jogadores.find(jogador => jogador._id == jogadorDto._id) 
            if(!jogadorEncontrado){
                throw new BadRequestException(`jogador ${jogadorDto._id} não cadastrado na ferramenta`);
            }

            if(jogadorEncontrado.categoria != criarDesafioDto.categoria){
                throw new BadRequestException(`jogador ${jogadorDto._id} não pertence a categoria do evento`);
            }
        })

        if (!criarDesafioDto.jogadores.find(jogador => jogador._id == criarDesafioDto.solicitante)) {
            throw new BadRequestException('Jogador solicitante nao faz parte da partida');
        }

        return await this.clientDesafios.emit('criar-desafio', criarDesafioDto)
    }

    @Get()
    async buscarTodosDesafios(
        @Query('idJogador') idJogador: string
    ) {
        if (idJogador) {
            const jogadorEncontrado = await this._clientProxyService.send('consultar-jogador', idJogador).toPromise();

            if (!jogadorEncontrado) {
                throw new BadRequestException(`jogador ${idJogador} não cadastrado na ferramenta`);
            }
            return await this.clientDesafios.send('consultar-desafios-jogador', idJogador);
        } else {
            return await this.clientDesafios.send('consultar-desafios', '');
        }
    }

    @Put('/:_id')
    @UsePipes(ValidationPipe)
    async atualizarDesafio(
        @Body() atualizarDesafioDto: AtualizarDesafioDto,
        @Param('_id') _id: string) {
        let desafioEncontrado = await this.clientDesafios.send('consultar-desafios', _id).toPromise();

        if (!desafioEncontrado) {
            throw new BadRequestException('desafio nao cadastrado');
        }

        if(desafioEncontrado.status != DesafioStatus.PENDENTE){
            throw new BadRequestException('apenas desafios com status pendente podem ser atualizados');
        }

        return this.clientDesafios.emit('atualizar-desafio', { _id, desafio: atualizarDesafioDto });
    }

    @Delete('/:_id')
    @UsePipes(ValidationPipe)
    async apagarDesafio(
        @Param('_id') _id: string) {
        let desafioEncontrado = await this.clientDesafios.send('consultar-desafios', _id).toPromise();

        if (!desafioEncontrado) {
            throw new BadRequestException('desafio nao cadastrado');
        }

        return this.clientDesafios.emit('apagar-desafio', _id);
    }

    @Post('/atribuir/:idDesafio')
    @UsePipes(ValidationPipe)
    async atribuirPartidaADesafio(
        @Body() atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto,
        @Param('idDesafio') _id: string){
            let desafioEncontrado: Desafio = await this.clientDesafios.send('consultar-desafios', _id).toPromise();

            if (!desafioEncontrado) {
                throw new BadRequestException('desafio nao cadastrado');
            }

            if(desafioEncontrado.status == DesafioStatus.REALIZADO){
                throw new BadRequestException('desafio ja realizado');                
            }

            if(desafioEncontrado.status != DesafioStatus.ACEITO){
                throw new BadRequestException('apenas desafios aceitos podem ser atribuido a uma partida');                                
            }

            if(!desafioEncontrado.jogadores.find(jogador => jogador == atribuirDesafioPartidaDto.def._id)){
                throw new BadRequestException('jogador nao pertence a partida');                
            }

            const partida = {
                categoria: desafioEncontrado.categoria,
                def: atribuirDesafioPartidaDto.def,
                jogadores: desafioEncontrado.jogadores,
                desafio: _id,
                resultado: atribuirDesafioPartidaDto.resultado
            }

            return await this.clientDesafios.emit('criar-partida', partida)
        }    

}
