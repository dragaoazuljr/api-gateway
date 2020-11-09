import { IsNotEmpty } from "class-validator";
import { Jogador } from "src/jogadores/interfaces/jogador.interface";
import { Resultado } from "../interface/partidas.interface";

export class AtribuirDesafioPartidaDto{

    @IsNotEmpty()
    def: Jogador;

    @IsNotEmpty()
    resultado: Resultado[]
}