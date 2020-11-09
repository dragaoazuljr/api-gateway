import { IsNotEmpty, IsOptional } from "class-validator";

export class AtualizarJogadorDto {
    @IsNotEmpty()
    readonly telefoneCelular: string;

    @IsNotEmpty()
    readonly nome: string;

    @IsNotEmpty()
    readonly categoria: string;

    @IsOptional()
    urlFotoJogador?: string;
}