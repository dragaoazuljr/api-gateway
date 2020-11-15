import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ClientProxyService } from 'src/client-proxy/client-proxy.service';

@Controller('api/v1/rankings')
export class RankingsController {

    
    constructor(
        private readonly _clientProxy: ClientProxyService
    ){}
        
    private _clientProxyRankings = this._clientProxy.createProxyRankings();
    
    @UseGuards(AuthGuard('jwt'))
    @Get()
    consultarRankings(
        @Query('idCategoria') idCategoria: string,
        @Query('dataRef') dataRef: string
    ){ 
        if (!idCategoria){
            throw new BadRequestException('o id da categoria é obrigatorio');
        }

        return this._clientProxyRankings.send('consultar-rankings', {idCategoria, dataRef})
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/jogador')
    consultarRankingPorJogador(
        @Query('idJogador') idJogador: string
    ) {
        if (!idJogador){
            throw new BadRequestException('o id do jogador é obrigatorio');
        }

        return this._clientProxyRankings.send('consultar-ranking-jogador', {idJogador})
    }

}
