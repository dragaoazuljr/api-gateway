import { Jogador } from "src/jogadores/interfaces/jogador.interface";

export interface Partida extends Document{
    categoria: string;
    jogadores: string[];
    def: Jogador;
    resultado: Resultado[]
}

export interface Resultado{
    set: string;
}