import { Body, Controller, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxyService } from 'src/client-proxy/client-proxy.service';
import { AtualizarCategoriaDto } from 'src/categorias/dtos/atualizar-categoria.dto';
import { CriarCategoriasDto } from 'src/categorias/dtos/criar-categorias.dto';

@Controller('api/v1/categorias')
export class CategoriasController {

    constructor(
        private readonly _clientProxyService: ClientProxyService 
    ){}

    @Post()
    @UsePipes(ValidationPipe)
    criarCategoria(
        @Body() criarCategoriasDto: CriarCategoriasDto) {
            this._clientProxyService.emit('criar-categoria', criarCategoriasDto);
        }
    
    @Get()
    consultarCategorias(
        @Query('_id') _id: string ): Observable<any>{
        return this._clientProxyService.send('consultar-categorias', _id ? _id : '')
    }

    @Put('/:_id')
    @UsePipes(ValidationPipe)
    atualizarCategoria(
        @Body() atualizarCategoriaDto: AtualizarCategoriaDto,
        @Param('_id') _id: string ) {
        this._clientProxyService.emit('atualizar-categoria', {_id, categoria: atualizarCategoriaDto})
        }
}
