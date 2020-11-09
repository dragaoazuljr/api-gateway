import { IsNotEmpty, IsDateString } from "class-validator";
import { DesafioStatus } from "../interface/desafio.interface";

export class AtualizarDesafioDto {
   
    @IsNotEmpty()
    status: DesafioStatus
}