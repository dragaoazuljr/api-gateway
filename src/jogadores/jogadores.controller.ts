import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RedshiftData } from 'aws-sdk';
import { AwsService } from 'src/aws/aws.service';
import { ClientProxyService } from 'src/client-proxy/client-proxy.service';
import { fileURLToPath } from 'url';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';

@Controller('api/v1/jogadores')
export class JogadoresController {
    
    constructor(
        private readonly _clientProxyService: ClientProxyService,
        private readonly _awsService: AwsService
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

    @Post('/:_id/upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadArquivos (
        @UploadedFile() file,
        @Param('_id') _id: string
    ) {
        const jogador: AtualizarJogadorDto = await this._clientProxyService.send('consultar-jogador', _id).toPromise();
        if(!jogador){
            throw new BadRequestException('jogador nao encontrado');
        }
        const data = await this._awsService.uploadArquivo(file, _id);
        jogador.urlFotoJogador = data.url;
        
        await this._clientProxyService.emit('atualizar-jogador', {_id, jogador});
        
        let jogadorAtualizado = await this._clientProxyService.send('consultar-jogador', _id);
        return jogadorAtualizado;
    }
}
