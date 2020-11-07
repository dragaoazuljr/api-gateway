import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxyService } from 'src/client-proxy/client-proxy.service';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';

@Controller('api/v1/jogadores')
export class JogadoresController {
    
    constructor(
        private readonly _clientProxyService: ClientProxyService
    ) {}

    @Post()
    async criarJogador(
        @Body() criarJogadorDto: CriarJogadorDto ){
            let categoria = await this._clientProxyService.send('consultar-categorias', criarJogadorDto.categoria).toPromise();
            if(!categoria){
                throw new BadRequestException('categoria nao encontrada');
            }
            this._clientProxyService.emit('criar-jogador', criarJogadorDto)
        }

    @Get()
    async consultarJogador(
        @Query('_id') _id: string) {
            return this._clientProxyService.send('consultar-jogador', _id ? _id : '');
        }
    
    @Put('/:_id')
    @UsePipes(ValidationPipe)
    async atualizarJogador(
        @Param('_id') _id:string,
        @Body() atualizarJogadroDto: AtualizarJogadorDto) {
            let categoria = await this._clientProxyService.send('consultar-categorias', atualizarJogadroDto.categoria).toPromise();
            if(!categoria){
                throw new BadRequestException('caetgoria nao encontrada')
            }
            this._clientProxyService.emit('atualizar-jogador', {_id: _id, jogador: atualizarJogadroDto})
        }

    @Delete('/:_id')
    @UsePipes(ValidationPipe)
    async apagarJogador(
        @Param('_id') _id: string ) {
            this._clientProxyService.emit('apagar-jogador', _id)
        }
}
