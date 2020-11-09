import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AwsCognitoService } from 'src/aws/aws-cognito.service';
import { AuthLoginUsuarioDto } from './dtos/auth-login-usuario.dto';
import { AuthRegistroUsuarioDto } from './dtos/auth-registro-usuario';

@Controller('api/v1/auth')
export class AuthController {

    constructor(
        private awsCongnitoService: AwsCognitoService
    ) {}

    @Post('/registro')
    @UsePipes(ValidationPipe)
    async registro (
        @Body() authRegistroUsuarioDto : AuthRegistroUsuarioDto
    ) {
        return await this.awsCongnitoService.registrarUsuario(authRegistroUsuarioDto)
    }

    @Post('/login')
    @UsePipes(ValidationPipe)
    async login(
        @Body() authLoginUsuarioDto: AuthLoginUsuarioDto){
        return await this.awsCongnitoService.autenticarUsuario(authLoginUsuarioDto)
    }
}
