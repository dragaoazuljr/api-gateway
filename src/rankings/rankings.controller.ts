import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ClientProxyService } from 'src/client-proxy/client-proxy.service';

@Controller('api/v1/rankings')
export class RankingsController {

    
    constructor(
        private readonly _clientProxy: ClientProxyService
    ){}
        
    private _clientProxyRankings = this._clientProxy.createProxyRankings();
    
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
}
